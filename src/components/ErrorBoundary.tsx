import React, { ReactNode } from 'react'
import { ErrorBoundary as SentryErrorBounday } from '@sentry/react'

const ErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SentryErrorBounday fallback={<p>Something went wrong :(</p>}>
      {children}
    </SentryErrorBounday>
  )
}

export default ErrorBoundary
