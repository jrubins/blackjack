import React, { PropTypes } from 'react';

import Header from './reusable/header/header';

const App = ({ children }) => (
  <div className="app-container">
    <Header />

    {children}
  </div>
);

App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
