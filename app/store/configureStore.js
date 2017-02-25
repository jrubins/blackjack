import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';

import ReduxStoreSize from './middleware/reduxStoreSize';
import {
  APP_ENV_LOCAL,
  APP_ENV_STAGING,
} from '../utils/environment';
import reducers from '../reducers';

let store;

/**
 * Creates the redux store.
 *
 * @returns {Object}
 */
export default function configureStore() {
  store = createStore(reducers, undefined, compose(
    // Allows us to use asynchronous actions.
    applyMiddleware(ReduxThunk),

    applyMiddleware(ReduxStoreSize),

    // Enables the Chrome Redux dev tools extension. It's awesome.
    ((process.env.APP_ENV === APP_ENV_LOCAL || process.env.APP_ENV === APP_ENV_STAGING) &&
      typeof window === 'object' &&
      typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f)
  ));

  return store;
}

/**
 * Returns the store state. NOTE: This should be used sparingly. Currently used to get store state
 * for form validations. You should strongly prefer connecting via react-redux if possible.
 *
 * @returns {Object}
 */
export function getStoreState() {
  return store ? store.getState() : {};
}
