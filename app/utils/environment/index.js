export const APP_ENV_LOCAL = 'local'
export const APP_ENV_STAGING = 'staging'

/**
 * Returns whether we are in debug or not.
 *
 * @returns {Boolean}
 */
export function isDebug() {
  return process.env.DEBUG
}

/**
 * Returns whether we are in development or not.
 *
 * @returns {Boolean}
 */
export function isDevelopment() {
  return process.env.NODE_ENV === 'development'
}
