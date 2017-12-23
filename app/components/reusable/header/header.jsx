import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import cn from 'classnames'

import {
  formatCurrency,
  formatThousands,
} from '../../../utils/text'

import {
  getNumDecks,
  getPlayerBalance,
  isBasicStrategyOpen,
  isCardCounterOpen,
  isMobileNavOpen,
} from '../../../reducers'
import {
  closeBasicStrategy,
  closeCardCounter,
  closeMobileNav,
  openBasicStrategy,
  openCardCounter,
  openMobileNav,
} from '../../../actions/ui'
import { setNumDecks } from '../../../actions/gameplay'

import FacebookShare from '../forms/fbShare'
import HamburgerIcon from '../icons/hamburger'
import SlidingToggle from '../forms/slidingToggle'
import TagPicker from '../forms/tagPicker'

class Header extends Component {
  constructor(props) {
    super(props)

    this.toggleBasicStrategy = this.toggleBasicStrategy.bind(this)
    this.toggleCardCounter = this.toggleCardCounter.bind(this)
    this.toggleMobileNav = this.toggleMobileNav.bind(this)
    this.setNumDecks = this.setNumDecks.bind(this)
  }

  /**
   * Toggles the basic strategy advice.
   */
  toggleBasicStrategy() {
    const {
      closeBasicStrategy,
      isBasicStrategyOpen,
      openBasicStrategy,
    } = this.props

    if (isBasicStrategyOpen) {
      closeBasicStrategy()
    } else {
      openBasicStrategy()
    }
  }

  /**
   * Toggles the card counter advice.
   */
  toggleCardCounter() {
    const {
      closeCardCounter,
      isCardCounterOpen,
      openCardCounter,
    } = this.props

    if (isCardCounterOpen) {
      closeCardCounter()
    } else {
      openCardCounter()
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
    } = this.props

    if (isMobileNavOpen) {
      closeMobileNav()
    } else {
      openMobileNav()
    }
  }

  /**
   * Sets the number of decks in use.
   *
   * @param {Number} numDecks
   */
  setNumDecks(numDecks) {
    const {
      setNumDecks,
    } = this.props

    setNumDecks(numDecks)
  }

  render() {
    const {
      isBasicStrategyOpen,
      isCardCounterOpen,
      isMobileNavOpen,
      numDecks,
      playerBalance,
    } = this.props

    return (
      <header>
        <div className="left-header">
          <div className="header-logo">
            Blackjack
          </div>
          <FacebookShare
            shareUrl={process.env.APP_BASE_URL}
          />
        </div>

        <div className="right-header">
          <div className="player-balance">
            ${formatThousands(playerBalance)}
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
          <div className="settings">
            <h3>Gameplay</h3>
            <div className="setting setting-balance">
              <span className="setting-label">
                Balance:
              </span>
              <span className="player-full-balance">
                {formatCurrency(playerBalance)}
              </span>
            </div>
            <div className="setting setting-wrap setting-num-decks">
              <span className="setting-label">
                # of Decks
              </span>
              <TagPicker
                handleChange={this.setNumDecks}
                options={[
                  {
                    label: '1',
                    value: 1,
                  },
                  {
                    label: '2',
                    value: 2,
                  },
                  {
                    label: '4',
                    value: 4,
                  },
                  {
                    label: '6',
                    value: 6,
                  },
                  {
                    label: '8',
                    value: 8,
                  },
                ]}
                value={numDecks}
              />
            </div>

            <h3>Customize UI</h3>
            <div className="setting">
              <span className="setting-label">
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
            <div className="setting">
              <span className="setting-label">
                Card Counter
              </span>
              <SlidingToggle
                handleChange={this.toggleCardCounter}
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
                value={isCardCounterOpen}
              />
            </div>
          </div>
        </div>
      </header>
    )
  }
}

Header.propTypes = {
  closeBasicStrategy: PropTypes.func.isRequired,
  closeCardCounter: PropTypes.func.isRequired,
  closeMobileNav: PropTypes.func.isRequired,
  isBasicStrategyOpen: PropTypes.bool.isRequired,
  isCardCounterOpen: PropTypes.bool.isRequired,
  isMobileNavOpen: PropTypes.bool.isRequired,
  numDecks: PropTypes.number.isRequired,
  openBasicStrategy: PropTypes.func.isRequired,
  openCardCounter: PropTypes.func.isRequired,
  openMobileNav: PropTypes.func.isRequired,
  playerBalance: PropTypes.number.isRequired,
  setNumDecks: PropTypes.func.isRequired,
}

export default connect(state => ({
  isBasicStrategyOpen: isBasicStrategyOpen(state),
  isCardCounterOpen: isCardCounterOpen(state),
  isMobileNavOpen: isMobileNavOpen(state),
  numDecks: getNumDecks(state),
  playerBalance: getPlayerBalance(state),
}), {
  closeBasicStrategy,
  closeCardCounter,
  closeMobileNav,
  openBasicStrategy,
  openCardCounter,
  openMobileNav,
  setNumDecks,
})(Header)
