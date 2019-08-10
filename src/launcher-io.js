import React from 'react'
import socketClient from 'socket.io-client'

function useWebSocket(url) {
  const [socket, setSocket] = React.useState()
  React.useEffect(() => {
    const _socket = socketClient(url)
    setSocket(_socket)

    return () => {
      _socket.close()
    }
  }, [url])
  return [socket]
}

export default function useLauncherIO(dispatch) {
  const [socket] = useWebSocket('http://:3001')

  React.useEffect(() => {
    if (socket) {
      socket.on('data', data => {
        // console.log(data)
        dispatch({ type: 'LAUNCHER_DATA_RECEIVED', action: data })
      })

      return () => {
        console.log('closing socket')
        socket.close()
      }
    }
  }, [dispatch, socket])

  function air(on) {
    if (on) {
      socket.emit('open-air')
    } else {
      socket.emit('close-air')
    }
  }

  function water(on) {
    if (on) {
      socket.emit('open-water')
    } else {
      socket.emit('close-water')
    }
  }

  function launch(on) {
    if (on) {
      socket.emit('open-launch')
    } else {
      socket.emit('close-launch')
    }
  }

  return [air, water, launch]
}
