import { ENV_DEV } from '../environment';

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
  if (process.env.NODE_ENV === ENV_DEV) {
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
