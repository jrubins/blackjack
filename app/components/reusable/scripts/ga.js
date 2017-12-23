import { Component } from 'react'

import {
  ANALYTICS_SCRIPT_URL,
  initAndSendPageview,
  setupGaTracker,
} from '../../../utils/analytics'
import { insertScript } from '../../../utils/dom'

class GaScript extends Component {
  componentDidMount() {
    setupGaTracker()

    initAndSendPageview()

    insertScript({
      id: 'ga-js',
      src: ANALYTICS_SCRIPT_URL,
      async: true,
    })
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    return null
  }
}

export default GaScript
