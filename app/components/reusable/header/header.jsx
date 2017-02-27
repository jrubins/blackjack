import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';

import {
  getPlayerBalance,
  isBasicStrategyOpen,
  isMobileNavOpen,
} from '../../../reducers';
import {
  closeBasicStrategy,
  openBasicStrategy,
  closeMobileNav,
  openMobileNav,
} from '../../../actions/ui';

import HamburgerIcon from '../icons/hamburger';
import SlidingToggle from '../forms/slidingToggle';

class Header extends Component {
  constructor(props) {
    super(props);

    this.toggleBasicStrategy = this.toggleBasicStrategy.bind(this);
    this.toggleMobileNav = this.toggleMobileNav.bind(this);
  }

  /**
   * Toggles the basic strategy advice.
   */
  toggleBasicStrategy() {
    const {
      closeBasicStrategy,
      isBasicStrategyOpen,
      openBasicStrategy,
    } = this.props;

    if (isBasicStrategyOpen) {
      closeBasicStrategy();
    } else {
      openBasicStrategy();
    }
  }

  /**
   * Toggles the mobile navigation menu.
   */
  toggleMobileNav() {
    const {
      closeMobileNav,
      isMobileNavOpen,
      openMobileNav,
    } = this.props;

    if (isMobileNavOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  render() {
    const {
      isBasicStrategyOpen,
      isMobileNavOpen,
      playerBalance,
    } = this.props;

    return (
      <header>
        <div className="header-logo">
          Blackjack
        </div>

        <div className="header-player">
          <div className="player-balance">
            ${playerBalance}
          </div>
          <HamburgerIcon
            isOpen={isMobileNavOpen}
            handleClick={this.toggleMobileNav}
          />
        </div>

        <div
          className={cn('mobile-navigation', {
            'mobile-navigation-open': isMobileNavOpen,
          })}
        >
          <div className="ui-toggles">
            <h3>Customize UI</h3>
            <div className="ui-toggle">
              <span className="ui-toggle-label">
                Basic Strategy
              </span>
              <SlidingToggle
                handleChange={this.toggleBasicStrategy}
                options={[
                  {
                    label: 'On',
                    value: true,
                  },
                  {
                    label: 'Off',
                    value: false,
                  },
                ]}
                value={isBasicStrategyOpen}
              />
            </div>
          </div>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  closeBasicStrategy: PropTypes.func.isRequired,
  closeMobileNav: PropTypes.func.isRequired,
  isBasicStrategyOpen: PropTypes.bool.isRequired,
  isMobileNavOpen: PropTypes.bool.isRequired,
  openBasicStrategy: PropTypes.func.isRequired,
  openMobileNav: PropTypes.func.isRequired,
  playerBalance: PropTypes.number.isRequired,
};

export default connect(state => ({
  isBasicStrategyOpen: isBasicStrategyOpen(state),
  isMobileNavOpen: isMobileNavOpen(state),
  playerBalance: getPlayerBalance(state),
}), {
  closeBasicStrategy,
  closeMobileNav,
  openBasicStrategy,
  openMobileNav,
})(Header);
