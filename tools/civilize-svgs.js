const fs = require('fs');
const path = require('path');
const Svgo = require('svgo');
const xml = require('node-xml');

const svgo = new Svgo({
  floatPrecision: 2,
});

const commandLineArguments = process.argv.slice(2);
if (commandLineArguments.length !== 2) {
  console.error('Usage: build-svgs input-directory output-directory');
  process.exit(1);
}

function statAsync(filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (error, stat) => {
      if (error || !stat) {
        reject(error || new Error('Failed stat'));
      } else {
        resolve({
          path: filePath,
          stat,
        });
      }
    });
  });
}

function findSvgsAsync(directory) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (error, files) => {
      if (error || !files) {
        reject(error || new Error('No files.'));
      } else {
        resolve(files);
      }
    });
  })
  .then(files => files.map(file => path.join(directory, file)))
  .then(files => Promise.all(files.map(statAsync)))
  .then(stats => stats.map(item => {
    if (item.stat.isDirectory()) {
      return { directory: item.path };
    }

    if (item.stat.isFile()) {
      return { file: item.path };
    }

    return { other: item.path };
  })
    .filter(item => item.directory || (item.file && path.extname(item.file) === '.svg'))
  )
  .then(filesAndDirectories => {
    const directories = filesAndDirectories
      .map(item => item.directory)
      .filter(item => item);

    const files = filesAndDirectories
      .map(item => item.file)
      .filter(item => item);

    return Promise.all(files.concat(directories.map(findSvgsAsync)));
  })
  .then(results => results.reduce((left, right) => left.concat(Array.isArray(right) ? right : [right]), []));
}

function convertToCamelCase(name) {
  return name.split('-')
    .map((part, index) => (index ? part[0].toUpperCase() + part.slice(1) : part))
    .join('');
}

function convertToPascalCase(name) {
  return name.split('-')
    .map(part => part[0].toUpperCase() + part.slice(1))
    .join('');
}

const supportedAttributes = {
  version: null,
  class: 'className',
};

[
  'clip-rule',
  'cx',
  'cy',
  'd',
  'fill',
  'fill-opacity',
  'fill-rule',
  'height',
  'id',
  'opacity',
  'r',
  'rx',
  'ry',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'transform',
  'viewBox',
  'width',
  'x',
  'y',
].forEach(attribute => {
  supportedAttributes[attribute] = convertToCamelCase(attribute);
});

const supportedElements = {
  title: null,
};

[
  'circle',
  'defs',
  'ellipse',
  'g',
  'path',
  'rect',
  'svg',
].forEach(element => {
  supportedElements[element] = convertToCamelCase(element);
});

function getFileContentAsync(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (error, data) => {
      if (error || !data) {
        reject(error || new Error(`No file content for ${filePath}`));
      } else {
        resolve({ path: filePath, content: data });
      }
    });
  });
}

function optimizeSvgAsync(file) {
  return new Promise((resolve, reject) => {
    svgo.optimize(file.content, result => {
      if (result.error) {
        reject(result);
      } else {
        resolve({ path: file.path, content: result.data });
      }
    });
  });
}

function convertSvgToJsxAsync(file) {
  const filePath = file.path;
  return new Promise((resolve, reject) => {
    let methodBody = null;
    let rejected = false;

    const state = [];

    const parser = new xml.SaxParser((events) => {
      events.onEndDocument(() => {
        if (rejected) {
          return;
        }

        if (!methodBody) {
          reject(new Error(`No root element in file ${filePath}`));
        }

        resolve([
          'export function ',
          convertToPascalCase(path.basename(filePath, '.svg')),
          '() {\n  return ',
          methodBody,
          ';\n}\n',
        ].join(''));
      });

      events.onStartElementNS((element, attributes) => {
        if (rejected) {
          return;
        }

        const outputElementName = supportedElements[element];
        if (outputElementName === null) {
          state.push({ ignore: true });
          return;
        }

        if (!outputElementName) {
          rejected = true;
          reject(new Error(`Unrecognized element ${element} in file ${filePath}`));
          return;
        }

        let params = null;
        if (attributes.length) {
          const paramsBuilder = [];

          attributes.forEach(pair => {
            const outputAttributeName = supportedAttributes[pair[0]];
            if (outputAttributeName === null) {
              return;
            }

            if (!outputAttributeName && !rejected) {
              rejected = true;
              reject(new Error(`Unrecognized attribute ${pair[0]} in element ${element} of file ${filePath}`));
              return;
            }

            paramsBuilder.push(`${outputAttributeName}: \'${pair[1]}\'`);
          });

          if (!rejected) {
            paramsBuilder.push();
            params = `{ ${paramsBuilder.join(', ')} }`;
          }
        }

        state.push({
          preamble: `createElement(\'${outputElementName}\'`,
          params,
          children: [],
        });
      });

      events.onEndElementNS(() => {
        if (rejected) {
          return;
        }

        const output = state.pop();
        if (output.ignore) {
          return;
        }

        const code = [output.preamble];
        if (output.params) {
          code.push(', ', output.params);
        } else if (output.children.length) {
          code.push(', null');
        }

        if (output.children.length) {
          const indentation = new Array(state.length + 3).join('  ');
          code.push(',\n', indentation, output.children.join(`,\n${indentation}`));
        }

        code.push(')');

        if (state.length) {
          state[state.length - 1].children.push(code.join(''));
        } else if (methodBody === null) {
          methodBody = code.join('');
        } else {
          rejected = true;
          reject(new Error(`Multiple root elements in file ${filePath}`));
        }
      });
      events.onError(message => {
        if (!rejected) {
          rejected = true;
          reject(new Error(`Error from ${file}: ${message}`));
        }
      });
    });

    parser.parseString(file.content);
  });
}

function processSvgAsync(filePath) {
  return getFileContentAsync(filePath)
    .then(optimizeSvgAsync)
    .then(convertSvgToJsxAsync);
}

function writeFileAsync(filePath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, {
      encoding: 'utf8',
    }, error => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

const inputDirectory = path.resolve(path.normalize(commandLineArguments[0]));
const outputDirectory = path.resolve(path.normalize(commandLineArguments[1]));

try {
  if (!fs.statSync(outputDirectory).isDirectory()) {
    console.error(`${outputDirectory} is not a directory.`);
    process.exit(1);
  }
} catch (x) {
  console.error(`${outputDirectory} is not a directory.`);
  process.exit(1);
}

findSvgsAsync(inputDirectory).then(filePaths => Promise.all(filePaths.map(filePath => processSvgAsync(filePath)
  .then(method => {
    const group = path.dirname(path.relative(inputDirectory, filePath));

    return {
      group: group === '.' ? 'common' : group,
      definition: method,
    };
  }))))
  .then(methods => methods.reduce((groups, method) => Object.assign({}, groups, {
    [method.group]: (groups[method.group] || []).concat([method.definition]),
  }), {}))
  .then(groups => Object.keys(groups).map(groupName => ({
    path: path.join(outputDirectory, `${groupName}-icons.g.js`),
    content: `import React from \'react\';\n\nconst createElement = React.createElement;\n\n${groups[groupName].join('\n')}`,
  })))
  .then(outputFiles => Promise.all(outputFiles.map(file => writeFileAsync(file.path, file.content))))
  .catch(error => {
    console.error(error.stack || error);
    process.exit(1);
  });
