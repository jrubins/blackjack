import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { setConfig } from 'react-hot-loader'

import './main.css'

import App from './components/App'

setConfig({
  reloadHooks: false,
})

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('react-root')
)
