/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  const newObj = {};

  Object.entries(obj).map(([key, value]) => {
    for (let y = 0; y < fields.length; y++) {
      if (fields[y] === value) {
        newObj[key] = value;
      }
    }
  });

  return newObj;
};
