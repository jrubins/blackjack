import React, { PropTypes } from 'react';
import Perf from 'react-addons-perf';
import { Provider } from 'react-redux';
import { Router, browserHistory, applyRouterMiddleware } from 'react-router';
import useScroll from 'react-router-scroll/lib/useScroll';

import { ENV_DEV } from './utils/environment';
import { setLogger } from './utils/logs';
import routes from './routes';

// Import our root SASS file to get built by Webpack.
import './assets/sass/app.scss';

// Include React performance add-on when on development.
if (process.env.NODE_ENV === ENV_DEV) {
  window.Perf = Perf;
}

// Set our logger to be the browser console.
setLogger(console);

const Root = ({ store }) => (
  <Provider store={store}>
    <Router
      history={browserHistory}
      routes={routes}
      render={applyRouterMiddleware(useScroll())}
    />
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
