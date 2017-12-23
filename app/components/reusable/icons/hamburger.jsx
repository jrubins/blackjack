import React, { PropTypes } from 'react'
import cn from 'classnames'

const HamburgerIcon = ({ handleClick, isOpen }) => (
  <div
    className={cn('hamburger', {
      'hamburger-open': isOpen,
    })}
    onClick={handleClick}
  >
    <div className="hamburger-middle" />
    <div className="hamburger-hidden-middle" />
  </div>
)

HamburgerIcon.propTypes = {
  handleClick: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
}

export default HamburgerIcon
