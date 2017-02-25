import _ from 'lodash';
import fetch from 'isomorphic-fetch';

import { info, error } from '../../utils/logs';
import { makeApiResponseError } from '../../utils/api';

/**
 * The base url for API requests.
 *
 * @type {String}
 */
const API_BASE_URL = process.env.API_BASE_URL;

/**
 * The mimetype that represents JSON.
 *
 * @type {String}
 */
const JSON_MIME_TYPE = 'application/json';

/**
 * Checks for a request response error and throws an API error if one happened.
 *
 * @param {Object} response
 * @param {Object} [apiJsonResponse]
 * @throws Error
 */
function checkForRequestErrorAndThrow(response, apiJsonResponse = {}) {
  const hasError = response.status >= 400 && response.status <= 500;

  if (hasError) {
    error(`Error making API request: ${response.statusText} (${response.status})`);

    throw makeApiResponseError({
      statusCode: response.status,
      json: apiJsonResponse,
    });
  }
}

/**
 * Makes an API request to the provided path with the provided options.
 *
 * @param {String} path
 * @param {Object} options
 * @param {String} [options.authToken]
 * @param {Boolean} [options.skipDefaultHeaders]
 * @param {Boolean} [options.isExternal]
 * @returns {Promise}
 */
function makeRequest(path, options = {}) {
  const {
    authToken = null,
    skipDefaultHeaders = false,
    isExternal = false,
  } = options;

  // Add default headers unless we're skipping them.
  const headers = (
    skipDefaultHeaders
      ? {}
      : {
        Accept: JSON_MIME_TYPE,
        'Content-Type': JSON_MIME_TYPE,
      }
  );

  // Add our API Authorization header if provided.
  if (authToken) {
    headers.Authorization = authToken;
  }

  const requestOptions = _.merge({}, _.omit(options, 'authToken'), {
    headers,
  });

  // Isomorphic-fetch doesn't send cookies in requests by default.
  if (options.sendCookies) {
    requestOptions.credentials = 'same-origin';
  }

  info('request:', requestOptions);

  // Make our AJAX request - allow external requests as well.
  return fetch(isExternal ? path : `${API_BASE_URL}${path}`, requestOptions)
    .then(response => {
      // If we don't have a JSON response parser, skip it.
      if (headers.Accept !== JSON_MIME_TYPE) {
        checkForRequestErrorAndThrow(response);

        return Promise.resolve(response);
      }

      return response.json()
        .then(apiJsonResponse => {
          checkForRequestErrorAndThrow(response, apiJsonResponse);

          return apiJsonResponse;
        });
    });
}

/**
 * Makes an API GET request.
 *
 * @param {String} path
 * @param {Object} options
 * @returns {Promise}
 */
export function get(path, options = {}) {
  const requestOptions = _.merge({}, options, {
    method: 'GET',
  });

  return makeRequest(path, requestOptions);
}

/**
 * Makes an API POST request.
 *
 * @param {String} path
 * @param {Object} options
 * @returns {Promise}
 */
export function post(path, options = {}) {
  const requestOptions = _.merge({}, options, {
    method: 'POST',
    body: JSON.stringify(options.body || {}),
  });

  return makeRequest(path, requestOptions);
}

/**
 * Makes an API PUT request.
 *
 * @param {String} path
 * @param {Object} options
 * @returns {Promise}
 */
export function put(path, options = {}) {
  const { bodyNotJSON = false } = options;

  const requestOptions = _.merge({}, options, {
    method: 'PUT',
    body: bodyNotJSON ? options.body : JSON.stringify(options.body || {}),
  });

  return makeRequest(path, requestOptions);
}

/**
 * Makes an API DELETE request.
 *
 * @param {String} path
 * @param {Object} options
 * @returns {Promise}
 */
export function apiDelete(path, options = {}) {
  const requestOptions = _.merge({}, options, {
    method: 'DELETE',
  });

  return makeRequest(path, requestOptions);
}
