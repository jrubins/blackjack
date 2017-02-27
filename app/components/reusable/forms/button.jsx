import React, { PropTypes } from 'react';
import cn from 'classnames';

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
    onClick={() => {
      if (!isDisabled) {
        handleClick();
      }
    }}
  >
    <span className="button-text">
      {text}
    </span>
  </button>
);

Button.propTypes = {
  handleClick: PropTypes.func,
  inverse: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  type: PropTypes.string,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
};

Button.defaultProps = {
  handleClick(event) {
    event.preventDefault();
  },
  inverse: false,
  isDisabled: false,
  isLoading: false,
  type: 'submit',
};

export default Button;
