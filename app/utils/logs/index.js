import { isDevelopment } from '../environment';

/**
 * The logging instance.
 *
 * @type {?Object}
 */
const logger = console;

/**
 * Outputs a debug message.
 *
 * @param {...String} rest
 */
export function debug(...rest) {
  if (process.env.DEBUG) {
    logger.debug(...rest);
  }
}

/**
 * Outputs an info message.
 *
 * @param {...String} rest
 */
export function info(...rest) {
  if (isDevelopment()) {
    logger.info(...rest);
  }
}

/**
 * Outputs an error message.
 *
 * @param {...String} rest
 */
export function error(...rest) {
  logger.error(...rest);
}
