import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

class Input extends Component {
  /**
   * Returns the DOM node for the input.
   *
   * @returns {DOMElement}
   */
  getInputNode() {
    return this.input;
  }

  render() {
    const {
      handleBlur,
      handleChange,
      handleFocus,
      placeholder,
      style,
      type,
      value,
    } = this.props;

    return (
      <input
        ref={input => this.input = input}
        className="input"
        onBlur={handleBlur}
        onChange={event => handleChange(event.target.value)}
        onFocus={handleFocus}
        placeholder={placeholder}
        readOnly={value && !handleChange}
        style={style}
        type={type}
        value={_.isNil(value) ? '' : value}
      />
    );
  }
}

Input.propTypes = {
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  handleFocus: PropTypes.func,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

Input.defaultProps = {
  handleBlur: null,
  handleChange: null,
  handleFocus: null,
  style: null,
};

export default Input;
