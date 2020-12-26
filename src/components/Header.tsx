import React from 'react'
import cn from 'classnames'

import { formatCurrency, formatThousands } from '../utils/text'

import HamburgerIcon from './reusable/icons/HamburgerIcon'
import SlidingToggle from './reusable/forms/SlidingToggle'
import TagPicker from './reusable/forms/TagPicker'

const Header: React.FC<{
  isBasicStrategyOpen: boolean
  isCardCounterOpen: boolean
  isMobileNavOpen: boolean
  numDecks: number
  onNumDecksChanged: (numDecks: number) => void
  onToggleBasicStrategy: () => void
  onToggleCardCounter: () => void
  onToggleMobileNav: () => void
  playerBalance: number
}> = ({
  isBasicStrategyOpen,
  isCardCounterOpen,
  isMobileNavOpen,
  numDecks,
  onNumDecksChanged,
  onToggleBasicStrategy,
  onToggleCardCounter,
  onToggleMobileNav,
  playerBalance,
}) => {
  return (
    <header className="flex items-center justify-between h-header max-w-screen-md mx-auto px-4">
      <h1 className="text-blue text-lg uppercase">Blackjack</h1>

      <div className="flex items-center">
        <div className="mr-4 text-light-black">
          ${formatThousands(playerBalance)}
        </div>
        <HamburgerIcon isOpen={isMobileNavOpen} onClick={onToggleMobileNav} />
      </div>

      <div
        className={cn(
          'absolute top-header right-0 bottom-0 left-0 w-full max-w-screen-md mx-auto px-4 transition duration-200 bg-white opacity-1 visible z-40',
          {
            'opacity-0 invisible': !isMobileNavOpen,
          }
        )}
      >
        <div>
          <h2 className="my-4 text-light-grey uppercase">Gameplay</h2>
          <div className="flex items-center mb-2">
            <span className="w-48">Balance:</span>
            <span className="text-blue font-bold">
              {formatCurrency(playerBalance)}
            </span>
          </div>
          <div className="flex flex-wrap items-center mb-2">
            <span className="w-48"># of Decks</span>
            <TagPicker
              onChange={onNumDecksChanged}
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

          <h2 className="my-4 text-light-grey uppercase">Customize UI</h2>
          <div className="flex items-center mb-2">
            <span className="w-48">Basic Strategy</span>
            <SlidingToggle
              onChange={onToggleBasicStrategy}
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
          <div className="flex items-center mb-2">
            <span className="w-48">Card Counter</span>
            <SlidingToggle
              onChange={onToggleCardCounter}
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

export default Header
