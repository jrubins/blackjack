import _ from 'lodash';

/**
 * A mapping of API response codes to be more semantic.
 *
 * @type {Object}
 */
export const STATUS_CODES = {
  UNAUTHORIZED: 401,
};

/**
 * Transforms data into the format the API expects using the provided mapping and data.
 *
 * @param {Object} options.mapping
 * @param {Object} options.data
 * @param {Boolean} [options.onlyWithValue]
 * @returns {Object}
 */
export function transformFieldsForAPI({ mapping, data, onlyWithValue = false }) {
  const apiData = {};

  _.forEach(mapping, (apiId, appId) => {
    if (onlyWithValue) {
      if (data[appId]) {
        apiData[apiId] = data[appId];
      }
    } else {
      apiData[apiId] = data[appId];
    }
  });

  return apiData;
}

/**
 * Transforms data into the format our App uses from the response of the API.
 *
 * @param {Object} options.mapping
 * @param {Array<Object>} options.apiData
 * @returns {Array<Object>}
 */
export function transformApiResponseForApp({ mapping, apiData }) {
  return apiData.map(apiResponse => {
    const appData = {};

    _.forEach(mapping, (apiId, appId) => {
      appData[appId] = _.get(apiResponse, apiId);
    });

    return appData;
  });
}

/**
 * Stringifies the provided object for use in a query string.
 *
 * @param {Object} obj
 * @returns {String}
 */
export function queryStringify(obj) {
  return _.reduce(obj, (result, value, key) => {
    if (value) {
      result.push(`${key}=${value}`);
    }

    return result;
  }, []).join('&');
}

/**
 * Makes an error object for an API request that failed.
 *
 * @param {Number} options.statusCode
 * @param {Object} options.json
 * @returns {Error}
 */
export function makeApiResponseError({ statusCode, json }) {
  const error = new Error(_.isArray(json.errors) ? json.errors[0] : 'Internal server error');
  error.statusCode = statusCode;

  return error;
}
