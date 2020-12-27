import React, { useEffect, useRef } from 'react'

/**
 * A custom hook that only runs the provided callback function after the initial render.
 */
export function useDeferredEffect(cb: () => void, deps: React.DependencyList) {
  const hasMounted = useRef(false)

  useEffect(() => {
    if (hasMounted.current) {
      cb()
    }

    hasMounted.current = true
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}
