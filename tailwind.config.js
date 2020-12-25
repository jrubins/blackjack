module.exports = {
  purge: ['./public/index.html', './src/**/*.ts', './src/**/*.tsx'],
  theme: {
    colors: {
      blue: '#42b4e6',
      'dark-grey': '#aaa',
      'light-black': '#333',
      'light-grey': '#ddd',
      'off-white': '#f5f5f4',
      red: '#a33b3b',
      transparent: 'transparent',
      white: '#fff',
    },
    extend: {
      animation: {
        'active-hand': '500ms infinite alternate active-indicator ease-in-out',
      },
      boxShadow: {
        card: '0 0 6px #aaa',
      },
      fontSize: {
        tiny: ['0.5rem', '0.75rem'],
      },
      height: {
        card: '120px',
        'hamburger-bar': '2px',
        header: '55px',
      },
      inset: {
        header: '55px',
      },
      keyframes: {
        'active-indicator': {
          from: { transform: 'translate(0, -50%)' },
          to: { transform: 'translate(-10px, -50%)' },
        },
      },
      transitionDelay: {
        0: '0ms',
      },
      width: {
        '0-per': '0%',
        card: '80px',
      },
    },
    fontFamily: {
      sans: ['Montserrat', 'sans-serif'],
    },
  },
}
