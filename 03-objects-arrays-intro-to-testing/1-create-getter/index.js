/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const arrayPath = path.split('.');

  const searchPath = (obj) => {
    for (let value of Object.values(arrayPath)) {
      if (obj[value]) {

        if (typeof obj[value] === "object") {
          return searchPath(obj[value]);
        }

        return obj[value];
      }
    }
  };

  return searchPath;
}
