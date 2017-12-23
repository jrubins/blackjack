import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

const Button = ({
  handleClick,
  inverse,
  isDisabled,
  isLoading,
  text,
  type,
}) => (
  <button
    className={cn('button', {
      'button-disabled': isDisabled,
      'button-loading': isLoading,
      'button-inverse': inverse,
    })}
    type={type}
    onClick={event => {
      if (!isDisabled) {
        handleClick(event)
      }
    }}
  >
    <span className="button-text">
      {text}
    </span>
  </button>
)

Button.propTypes = {
  handleClick: PropTypes.func,
  inverse: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  type: PropTypes.string,
  text: PropTypes.node.isRequired,
}

Button.defaultProps = {
  handleClick(event) {
    event.preventDefault()
  },
  inverse: false,
  isDisabled: false,
  isLoading: false,
  type: 'submit',
}

export default Button
