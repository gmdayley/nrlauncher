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

export default function useLauncher(dispatch) {
  const [socket] = useWebSocket('http://localhost:3001')

  React.useEffect(() => {
    if (socket) {
      socket.on('data', data => {
        // console.log(data)
        dispatch({ type: 'LAUNCHER_DATA_RECEIVED', launcherData: data })
      })

      return () => {
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
    console.log('launchy says', on)
    if (on) {
      socket.emit('open-launch')
    } else {
      socket.emit('close-launch')
    }
  }

  // function launch() {
  //   socket.emit('launch')
  // }

  return [air, water, launch]
}
