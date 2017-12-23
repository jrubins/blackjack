import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import {
  ACTION_NAMES,
  executeAction,
} from '../../../utils/fb'
import {
  EVENT_NAMES,
  customEvent,
} from '../../../utils/analytics'

import Button from './button'
import FacebookIcon from '../icons/facebook'

class FacebookShare extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isSharing: false,
    }

    this.doFacebookShare = this.doFacebookShare.bind(this)
    this.handleShareComplete = this.handleShareComplete.bind(this)
  }

  /**
   * Executes the Facebook share by opening the Facebook share dialog.
   *
   * @param {SyntheticEvent} event
   */
  doFacebookShare(event) {
    event.preventDefault()

    const { shareUrl } = this.props

    this.setState({
      isSharing: true,
    }, () => {
      executeAction(ACTION_NAMES.FB_SHARE, shareUrl, this.handleShareComplete)
    })
  }

  /**
   * Handles when a Facebook share completes. This does not necessarily mean it was successful.
   *
   * @param {Object} response
   */
  handleShareComplete(response) {
    this.setState({
      isSharing: false,
    }, () => {
      if (!_.isNil(response)) {
        customEvent(EVENT_NAMES.SHARE_FACEBOOK)
      }
    })
  }

  render() {
    const { isSharing } = this.state

    return (
      <div
        className="facebook-share"
      >
        <Button
          text={<FacebookIcon />}
          handleClick={this.doFacebookShare}
          type="button"
          isLoading={isSharing}
        />
      </div>
    )
  }
}

FacebookShare.propTypes = {
  shareUrl: PropTypes.string.isRequired,
}

export default FacebookShare
