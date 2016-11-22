import Joi from 'joi';

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
