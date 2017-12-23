import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

const Input = ({
  handleChange,
  placeholder,
  type,
  value,
}) => (
  <input
    className="input"
    onChange={event => handleChange(event.target.value)}
    placeholder={placeholder}
    readOnly={value && !handleChange}
    type={type}
    value={_.isNil(value) ? '' : value}
  />
)

Input.propTypes = {
  handleChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
}

export default Input
