/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const sortArr = [...arr];
  const locales = ['ru', 'en'];
  const options = {
    caseFirst: 'upper',
  };

  sortArr.sort((a, b) => {
    return param === 'desc' ? b.localeCompare(a, locales, options) : a.localeCompare(b, locales, options);
  });

  return sortArr;
}
