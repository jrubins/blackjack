import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import GaScript from './reusable/scripts/ga';
import Header from './reusable/header/header';
import HomePage from './pages/home/home';

const App = () => (
  <BrowserRouter>
    <div className="app-container">
      <GaScript />

      <Header />

      <Route
        exact
        path="/"
        component={HomePage}
      />
    </div>
  </BrowserRouter>
);

export default App;
