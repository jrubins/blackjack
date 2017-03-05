import { Component } from 'react';

import { insertScript } from '../../../utils/dom';
import {
  FB_SDK_URL,
  setupFb,
} from '../../../utils/fb';

class FacebookSdk extends Component {
  componentDidMount() {
    setupFb();

    insertScript({
      id: 'facebook-jssdk',
      src: FB_SDK_URL,
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return null;
  }
}

export default FacebookSdk;
