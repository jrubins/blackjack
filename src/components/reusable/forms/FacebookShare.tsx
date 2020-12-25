import React from 'react'
import _ from 'lodash'

import { EVENT_NAMES, customEvent } from '../../../utils/analytics'
import { openShareDialog } from '../../../utils/fb'

import FacebookIcon from '../icons/FacebookIcon'

const FacebookShare: React.FC = () => {
  return (
    <div
      onClick={() => {
        openShareDialog((response: any) => {
          if (!_.isNil(response)) {
            customEvent(EVENT_NAMES.SHARE_FACEBOOK)
          }
        })
      }}
    >
      <FacebookIcon />
    </div>
  )
}

export default FacebookShare
