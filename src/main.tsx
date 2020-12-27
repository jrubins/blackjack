import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { init as SentryInit } from '@sentry/react'
import { Integrations as SentryIntegrations } from '@sentry/tracing'
import { setConfig } from 'react-hot-loader'

import { getEnvironment, isProduction } from './utils/environment'

import './main.css'
import App from './components/App'
import ErrorBoundary from './components/ErrorBoundary'

if (isProduction()) {
  // Set up Sentry for error reporting.
  SentryInit({
    autoSessionTracking: true,
    dsn: process.env.SENTRY_DSN,
    environment: getEnvironment(),
    integrations: [new SentryIntegrations.BrowserTracing()],
    tracesSampleRate: 1,
  })
}

setConfig({
  reloadHooks: false,
})

ReactDOM.render(
  <ErrorBoundary>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ErrorBoundary>,
  document.getElementById('react-root')
)
