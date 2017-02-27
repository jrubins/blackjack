import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import cn from 'classnames';

class SlidingToggle extends Component {
  constructor(props) {
    super(props);

    this.toggleSlider = this.toggleSlider.bind(this);
  }

  /**
   * Toggles the slider between the active and inactive positions.
   */
  toggleSlider() {
    const {
      handleChange,
      options,
    } = this.props;
    const newActiveOptionIndex = this.isSliderActive() ? 1 : 0;

    handleChange(_.get(options[newActiveOptionIndex], 'value'));
  }

  /**
   * Returns if the slider is in an active position or not.
   *
   * @returns {Boolean}
   */
  isSliderActive() {
    const {
      options,
      value,
    } = this.props;

    return value === _.get(options[0], 'value');
  }

  render() {
    const {
      options,
    } = this.props;
    const activeOptionLabel = _.get(options[0], 'label');
    const inactiveOptionLabel = _.get(options[1], 'label');

    return (
      <div
        className={cn('sliding-toggle-container', `sliding-toggle-ball-${this.isSliderActive() ? 'active' : 'inactive'}`)}
        onClick={this.toggleSlider}
      >
        <div className="sliding-toggle-ball" />
        <div className="sliding-toggle-label sliding-toggle-active-label">
          {activeOptionLabel}
        </div>
        <div className="sliding-toggle-label sliding-toggle-inactive-label">
          {inactiveOptionLabel}
        </div>
      </div>
    );
  }
}

SlidingToggle.propTypes = {
  handleChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
  })).isRequired,
  value: PropTypes.bool.isRequired,
};

export default SlidingToggle;
