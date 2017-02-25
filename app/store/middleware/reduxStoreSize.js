import sizeOf from 'object-sizeof';

import { formatBytes } from '../../utils/text';
import { debug } from '../../utils/logs';
import { ENV_DEV } from '../../utils/environment';

/**
 * This is a middleware to output the size of the Redux store in bytes. Useful to keep an
 * eye on how much memory your store is using.
 *
 * @param {Object} store
 * @returns {Function}
 */
const ReduxStoreSize = store => next => action => {
  if (process.env.NODE_ENV === ENV_DEV) {
    debug('Store Size:', formatBytes(sizeOf(store.getState())));
  }

  return next(action);
};

export default ReduxStoreSize;
