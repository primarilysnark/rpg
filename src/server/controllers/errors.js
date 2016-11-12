export const getMalformedAttributeError = function getMalformedAttributeError(resourceName, attributeName, correctType) {
  return {
    title: 'Malformed attribute',
    detail: `The ${resourceName} ${attributeName} attribute is of the wrong type. Should be of type ${correctType}.`,
    source: {
      pointer: `/data/attributes/${attributeName}`,
    },
  };
};

export const getMissingAttributeError = function getMissingAttributeError(resourceName, attributeName) {
  return {
    title: 'Missing attribute',
    detail: `The ${resourceName} ${attributeName} attribute is missing from the attributes object.`,
    source: {
      pointer: `/data/attributes/${attributeName}`,
    },
  };
};

export const getMissingAttributesError = function getMissingAttributesError(resourceName) {
  return {
    title: 'Missing attributes',
    detail: `A ${resourceName} resource is missing the required attributes object`,
  };
};
