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
