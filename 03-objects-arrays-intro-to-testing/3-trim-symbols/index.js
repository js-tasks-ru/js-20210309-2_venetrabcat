/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  switch (size !== undefined) {
  case true:
    const arrayStr = string.split("");
    const options = {
      str: '',
      symbolCompare: '',
      sizeIndicator: 0
    };

    for (let symbol of arrayStr) {
      if (options.symbolCompare !== symbol) {
        options.symbolCompare = symbol;
        options.sizeLoop = 0;
      }
      if (options.sizeLoop < size) {
        options.str += symbol;
        options.sizeLoop++;
      }
    }
    return options.str;
  default:
    return string;
  }
}
