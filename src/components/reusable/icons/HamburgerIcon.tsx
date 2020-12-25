import React from 'react'

const HamburgerIcon: React.FC<{ onClick: () => void; isOpen: boolean }> = ({
  onClick,
  isOpen,
}) => {
  const hamburgerBarCommonClasses =
    'absolute top-0 left-0 w-full h-hamburger-bar transition-all duration-200 ease-in-out bg-light-grey'
  const topBottomClasses = isOpen ? 'top-1/2 left-1/2 w-0-per' : ''
  const middleClasses = 'top-1/2 transform -translate-y-1/2'

  return (
    <div className="block relative w-4 h-4 cursor-pointer" onClick={onClick}>
      <div className={`${hamburgerBarCommonClasses} ${topBottomClasses}`} />
      <div
        className={`${hamburgerBarCommonClasses} ${middleClasses} ${
          isOpen ? 'rotate-45' : ''
        }`}
      />
      <div
        className={`${hamburgerBarCommonClasses} ${middleClasses} ${
          isOpen ? '-rotate-45' : ''
        }`}
      />
      <div
        className={`${hamburgerBarCommonClasses} top-auto bottom-0 ${topBottomClasses}`}
      />
    </div>
  )
}

export default HamburgerIcon
