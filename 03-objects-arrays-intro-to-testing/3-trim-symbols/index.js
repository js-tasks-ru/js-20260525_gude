/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size == null) return string;

  let result = '';
  let count = 0;
  let prev = '';

  for (const char of string) {
    if (char === prev) {
      count++;
    } else {
      count = 1;
      prev = char;
    }

    if (count <= size) {
      result += char;
    }
  }

  return result;
}
