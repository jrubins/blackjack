import numeral from 'numeral';

/**
 * Formats the provided value into a string of how many KBs it represents.
 *
 * @param {Number} value
 * @returns {String}
 */
export function formatBytes(value) {
  return numeral(value).format('0.0 b');
}

/**
 * Formats the provided value into a string representing the value as a currency with commas.
 *
 * @param {Number} value
 * @returns {String}
 */
export function formatCurrency(value) {
  return numeral(value).format('$0,0');
}

/**
 * Formats the provided value into a string abbreviated with 'k' representing thousands.
 *
 * @param {Number} value
 * @returns {String}
 */
export function formatThousands(value) {
  return numeral(value).format('0[.]00a');
}
