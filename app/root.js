import React, { PropTypes } from 'react';
import Perf from 'react-addons-perf';
import { Provider } from 'react-redux';

// Import our root SASS file to get built by Webpack.
import './assets/sass/app.scss';

import { isDevelopment } from './utils/environment';

import App from './components/app';

// Include React performance add-on when on development.
if (isDevelopment()) {
  window.Perf = Perf;
}

const Root = ({ store }) => (
  <Provider store={store}>
    <App />
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
