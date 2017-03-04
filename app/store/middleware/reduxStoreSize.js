import sizeOf from 'object-sizeof';

import { formatBytes } from '../../utils/text';
import { debug } from '../../utils/logs';
import { isDevelopment } from '../../utils/environment';

/**
 * This is a middleware to output the size of the Redux store in bytes. Useful to keep an
 * eye on how much memory your store is using.
 *
 * @param {Object} store
 * @returns {Function}
 */
const ReduxStoreSize = store => next => action => {
  if (isDevelopment()) {
    debug('Store Size:', formatBytes(sizeOf(store.getState())));
  }

  return next(action);
};

export default ReduxStoreSize;
