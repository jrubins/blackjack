import clsx from 'clsx'

import { formatCurrency, formatThousands } from '../utils/text'
import { ThemeColor } from '../utils/types'

import HamburgerIcon from './reusable/icons/HamburgerIcon'
import SlidingToggle from './reusable/forms/SlidingToggle'
import TagPicker from './reusable/forms/TagPicker'

const Header = ({
  isBasicStrategyOpen,
  isCardCounterOpen,
  isMobileNavOpen,
  numDecks,
  onChangeThemeColor,
  onNumDecksChanged,
  onToggleBasicStrategy,
  onToggleCardCounter,
  onToggleMobileNav,
  playerBalance,
  themeColor,
}: {
  isBasicStrategyOpen: boolean
  isCardCounterOpen: boolean
  isMobileNavOpen: boolean
  numDecks: number
  onChangeThemeColor(themeColor: ThemeColor): void
  onNumDecksChanged: (numDecks: number) => void
  onToggleBasicStrategy: () => void
  onToggleCardCounter: () => void
  onToggleMobileNav: () => void
  playerBalance: number
  themeColor: ThemeColor
}): JSX.Element => {
  return (
    <header className="flex items-center justify-between h-header max-w-screen-md mx-auto px-4">
      <h1 className="text-primary text-lg uppercase">Blackjack</h1>

      <div className="flex items-center">
        <div className="mr-4 text-light-black">
          ${formatThousands(playerBalance)}
        </div>
        <HamburgerIcon isOpen={isMobileNavOpen} onClick={onToggleMobileNav} />
      </div>

      <div
        className={clsx(
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
            <span className="text-primary font-bold">
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
            <span className="w-48">Theme Color</span>
            <div className="flex items-center space-x-4">
              <div
                className={clsx('w-8 h-8 rounded-full bg-blue cursor-pointer', {
                  'border-4 border-black': themeColor === '#42b4e6',
                })}
                onClick={() => {
                  onChangeThemeColor('#42b4e6')
                }}
              />
              <div
                className={clsx(
                  'w-8 h-8 rounded-full bg-purple cursor-pointer',
                  {
                    'border-4 border-black': themeColor === '#6a0caf',
                  }
                )}
                onClick={() => {
                  onChangeThemeColor('#6a0caf')
                }}
              />
            </div>
          </div>
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
