import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'

// Import our root SASS file to get built by Webpack.
import './assets/sass/app.scss'

import App from './components/app'

const Root = ({ store }) => (
  <Provider store={store}>
    <App />
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired,
}

export default Root
