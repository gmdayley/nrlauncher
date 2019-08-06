import React from 'react'

export default function({ children, onKeyDown, onKeyUp }) {
  const kbRoot = React.useRef(null)

  React.useEffect(() => {
    const { current } = kbRoot
    console.log(current)

    current.addEventListener('keydown', onKeyDown)
    current.addEventListener('keyup', onKeyUp)

    return () => {
      current.removeEventListener('keydown', onKeyDown)
      current.removeEventListener('keydown', onKeyUp)
    }
  }, [onKeyDown, onKeyUp])

  return <div ref={kbRoot}>{children}</div>
}
