/* eslint global-require: 0 */
import { readdirSync } from 'fs';
import validator from 'node-validator';
import path from 'path';

function copyRequiredProperties(template, value) {
  if (typeof template === 'function' || typeof template.validate === 'function') {
    return value;
  }

  return Object.keys(template).reduce((copy, key) => ({
    ...copy,
    [key]: copyRequiredProperties(template[key], value[key]),
  }), {});
}

function createValidator(template) {
  if (typeof template === 'function' || typeof template.validate === 'function') {
    return template;
  }

  return Object.keys(template).reduce(
    (objectValidator, key) => objectValidator.withRequired(key, createValidator(template[key])),
    validator.isObject(),
  );
}

export default function findConfig({ environment, configLocation, configTemplate }) {
  const configValidator = createValidator(configTemplate);

  const environmentConfigs = readdirSync(configLocation)
    .filter(file => path.extname(file) === '.js')
    .reduce((accumulator, file) => {
      const environmentName = path.basename(file, '.js');
      const config = require(`./environments/${file}`);

      validator.run(configValidator, config, (errorCount, errors) => {
        if (errorCount !== 0) {
          throw new Error([
            'Configuration errors for environment ',
            environmentName,
            ': ',
            JSON.stringify(errors),
          ].join(''));
        }
      });

      return {
        ...accumulator,
        [environmentName]: config,
      };
    }, {});

  const currentConfig = environmentConfigs[environment];

  if (!currentConfig) {
    throw new Error(`Invalid environment name: ${environment}`);
  }

  return copyRequiredProperties(configTemplate, currentConfig);
}
