import _ from 'lodash';
import numeral from 'numeral';

/**
 * An array of the different vowels.
 *
 * @type {Array}
 */
const VOWELS = ['a', 'e', 'i', 'o', 'u'];

/**
 * Returns a format to use if decimals should be added.
 *
 * @param {Number} [numDecimals]
 * @returns {String}
 */
function getDecimalsFormat(numDecimals = null) {
  return numDecimals ? `.${_.padEnd('', numDecimals, '0')}` : '';
}

/**
 * Formats the provided value with an ordinal indicator (1st, 2nd, 3rd, etc.).
 *
 * @param {Number} value
 * @returns {String}
 */
export function formatOrdinalIndicator(value) {
  return numeral(value).format('Oo');
}

/**
 * Formats the provided value with commas inserted in the appropriate places.
 *
 * @param {Number} value
 * @param {Object} [opts]
 * @param {Number} [opts.numDecimals]
 * @returns {String}
 */
export function formatCommas(value, opts = {}) {
  const numDecimals = opts.numDecimals || 0;
  const decimalString = getDecimalsFormat(numDecimals);

  return numeral(value).format(`0,0${decimalString}`);
}

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
 * Formats the provided value into a percentage.
 *
 * @param {Number} value
 * @param {Object} [opts]
 * @param {Number} [opts.numDecimals]
 * @returns {String}
 */
export function formatPercentage(value, opts = {}) {
  const numDecimals = opts.numDecimals || 0;
  const decimalString = getDecimalsFormat(numDecimals);

  return numeral(value / 100).format(`0${decimalString}%`);
}

/**
 * Returns either "an" or "a" depending on which one fits as the word before the
 * provided value.
 *
 * @param {String} value
 * @returns {String}
 */
export function anify(value) {
  if (_.includes(VOWELS, _.toLower(value[0]))) {
    return 'an';
  }

  return 'a';
}
