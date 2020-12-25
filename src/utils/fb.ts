/**
 * An array holding actions that have been queued prior to the FB global object being initialized.
 */
const actionQueue: (() => void)[] = []

/**
 * The Facebook URL for the SDK.
 */
export const FB_SDK_URL = '//connect.facebook.net/en_US/sdk.js'

/**
 * Opens a FB share dialog with the provided share URL.
 */
export function openShareDialog(onShareComplete: (response: any) => void) {
  // @ts-ignore
  if (!window.FB) {
    actionQueue.push(() => {
      openShareDialog(onShareComplete)
    })

    return
  }

  console.info('Sharing on FB:', process.env.APP_BASE_URL)

  // @ts-ignore
  window.FB.ui(
    {
      method: 'share',
      href: process.env.APP_BASE_URL,
    },
    onShareComplete
  )
}

/**
 * Sets up the FB SDK. This will invoke the provided initialized method.
 */
export function setupFb() {
  // @ts-ignore
  window.fbAsyncInit = () => {
    console.info('Initializing FB SDK:', process.env.FACEBOOK_APP_ID)

    // @ts-ignore
    window.FB.init({
      appId: process.env.FACEBOOK_APP_ID,
      version: 'v2.8',
    })

    // Now that our object has been initialized, let's execute any queued actions.
    actionQueue.forEach((fn) => {
      fn()
    })
  }
}
