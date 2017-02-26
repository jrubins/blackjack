import React, { PropTypes } from 'react';
import cn from 'classnames';

const Button = ({ text, handleClick, type, isLoading, inverse }) => (
  <button
    className={cn('button', {
      'button-loading': isLoading,
      'button-inverse': inverse,
    })}
    type={type}
    onClick={handleClick}
  >
    <span className="button-text">
      {text}
    </span>
  </button>
);

Button.propTypes = {
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
  handleClick: PropTypes.func,
  type: PropTypes.string,
  isLoading: PropTypes.bool,
  inverse: PropTypes.bool,
};

Button.defaultProps = {
  handleClick(event) {
    event.preventDefault();
  },
  type: 'submit',
  isLoading: false,
  inverse: false,
};

export default Button;
