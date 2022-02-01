import { ReactNode } from 'react'
import { ErrorBoundary as SentryErrorBounday } from '@sentry/react'

const ErrorBoundary = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <SentryErrorBounday fallback={<p>Something went wrong :(</p>}>
      {children}
    </SentryErrorBounday>
  )
}

export default ErrorBoundary
