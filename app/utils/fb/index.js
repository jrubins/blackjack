import {
  debug,
  error,
} from '../logs'

/**
 * An array holding actions that have been queued prior to the FB global object being initialized.
 *
 * @type {Array}
 */
const actionQueue = []

/**
 * Opens a FB share dialog with the provided share URL.
 *
 * @param {String} shareUrl
 * @param {Function} handleShareComplete
 */
function openShareDialog(shareUrl, handleShareComplete) {
  debug('Sharing on FB:', shareUrl)

  FB.ui({
    method: 'share',
    href: shareUrl,
  }, handleShareComplete)
}

/**
 * The Facebook URL for the SDK.
 *
 * @const
 * @type {String}
 */
export const FB_SDK_URL = '//connect.facebook.net/en_US/sdk.js'

/**
 * Available actions that can be executed using the Facebook JS SDK.
 *
 * @type {Object}
 */
export const ACTION_NAMES = {
  FB_SHARE: 'fb-share',
}

/**
 * Sets up the FB SDK. This will invoke the provided initialized method.
 */
export function setupFb() {
  window.fbAsyncInit = () => {
    debug('Initializing FB SDK:', process.env.FACEBOOK_APP_ID)

    window.FB.init({
      appId: process.env.FACEBOOK_APP_ID,
      version: 'v2.8',
    })

    // Now that our object has been initialized, let's execute any queued actions.
    actionQueue.forEach(({ actionName, args }) => {
      executeAction(actionName, ...args)
    })
  }
}

/**
 * Executes a FB action or if the SDK has not loaded, it queues the action for execution once
 * it has loaded.
 *
 * @param {String} actionName
 * @param {...*} args
 */
export function executeAction(actionName, ...args) {
  // If the SDK is loaded, let's execute our action right away.
  if (window.FB) {
    switch (actionName) {
      case ACTION_NAMES.FB_SHARE:
        openShareDialog(...args)
        break

      default:
        error('Unrecognized FB action requested to be executed!')
        break
    }
  } else { // SDK is not loaded, queue our action.
    actionQueue.push({
      actionName,
      args,
    })
  }
}
