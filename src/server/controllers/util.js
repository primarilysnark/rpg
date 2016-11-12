import Joi from 'joi';

const dotRegex = new RegExp(/\./, 'g');

class ValidationTypeException {
  constructor(type) {
    this.type = type;
    this.toString = () => `${this.type} is not a supported validation error.`;
  }
}

function formatSource(error, isParams) {
  if (isParams) {
    return {
      parameter: error.path,
    };
  }

  return {
    pointer: `/${error.path.replace(dotRegex, '/')}`,
  };
}

export function formatValidationErrors(errors, isParams = false) {
  return errors.details.map(error => {
    switch (error.type) {
      case 'any.required':
        return {
          title: 'Missing field',
          detail: 'A required field is missing. Add the field to form a proper response',
          source: formatSource(error, isParams),
        };

      case 'object.allowUnknown':
        return {
          title: 'Unnecessary field',
          detail: 'The provided field was unnecessary or deprecated. Remove the field to form a proper request.',
          source: formatSource(error, isParams),
        };

      case 'number.base':
      case 'string.base':
        return {
          title: 'Malformed field',
          detail: 'The provided field was malformed or of the wrong type. Correct the field\'s value to form a proper request.',
          source: formatSource(error, isParams),
        };

      case 'any.allowOnly':
        if (error.path === 'type') {
          return {
            title: 'Invalid resource type',
            detail: `The provided resource was of the wrong type. The following resource types are valid: ${error.context.valids.join(', ')}.`,
            source: formatSource(error, isParams),
          };
        }

        return {
          title: 'Invalid field type',
          detail: `The provided field has a value that is invalid. The following field values are valid: ${error.context.valids.join(', ')}.`,
          source: formatSource(error, isParams),
        };

      default:
        throw new ValidationTypeException(error.type);
    }
  });
}

export function validateObject(object, schema) {
  return new Promise((resolve, reject) => {
    Joi.validate(object, schema, {
      abortEarly: false,
    }, (error, value) => {
      if (error != null) {
        return reject(error);
      }

      return resolve(value);
    });
  });
}

export function sendBadRequest(res, message) {
  return res.status(400).json({
    error: message,
  });
}

export function sendNotFound(res) {
  return res.status(404).send();
}
