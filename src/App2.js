import React from 'react';
import './App.css';
import Logo from './nrlogo.png';
import Gauge from 'react-svg-gauge';
import tinygradient from 'tinygradient';
import socketClient from 'socket.io-client';
import Gamepad from 'react-gamepad';
import Switch from './Switch';

// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

function useGradient(colors) {
  const [gradient] = React.useState(tinygradient(colors));
  return [gradient];
}

function useWebSocket(url) {
  const [socket, setSocket] = React.useState();
  React.useEffect(() => {
    const _socket = socketClient(url);
    setSocket(_socket);

    return () => {
      _socket.close();
    };
  }, [url]);
  return [socket];
}

function useLauncher() {
  const [socket] = useWebSocket('http://localhost:3001');
  const [launcherData, setLauncherData] = React.useState({
    connected: false,
    voltage: 0,
    pressure: 0,
  });

  React.useEffect(() => {
    if (socket) {
      socket.on('data', data => {
        console.log(data);
        setLauncherData(data);
      });

      return () => {
        socket.close();
      };
    }
  }, [socket]);

  function air(on) {
    if (on) {
      socket.emit('open-air');
    } else {
      socket.emit('close-air');
    }
  }

  function water(on) {
    if (on) {
      socket.emit('open-water');
    } else {
      socket.emit('close-water');
    }
  }

  function launch() {
    socket.emit('launch');
  }

  return [launcherData, air, water, launch];
}

function useLauncherButton() {
  function reducer(state, action) {
    console.log(action, state);
    switch (action.type) {
      case 'AIR_BUTTON_PRESSED':
        return {
          ...state,
          airPressed: true,
        };
      case 'AIR_BUTTON_RELEASED':
        return {
          ...state,
          airPressed: false,
        };
      case 'WATER_BUTTON_PRESSED':
        return {
          ...state,
          waterPressed: true,
        };
      case 'WATER_BUTTON_RELEASED':
        return {
          ...state,
          waterPressed: false,
        };
      case 'LAUNCH_BUTTON_PRESSED':
        return {
          ...state,
          launchPressed: true,
        };
      case 'LAUNCH_BUTTON_RELEASED':
        return {
          ...state,
          launchPressed: false,
        };
      case 'LAUNCHER_DATA_RECEIVED':
        return {
          ...state,
          launcherData: action.launcherData,
        };
      default:
        throw new Error('Unknown action type', action.type);
    }
  }

  return React.useReducer(reducer, {
    airPressed: false,
    waterPressed: false,
    launchPressed: false,
    launcherData: { voltage: 0, psi: 0 },
  });

  // return [state, dispatch];
}

function App() {
  const [gradient] = useGradient(['#e175e7', '#9473f7']);
  const [launcherData, air, water, launch] = useLauncher();
  const [state, dispatch] = useLauncherButton();

  console.log('rendering', state);

  function handleGamepadConnected(gamepadIndex) {
    console.log(`Gamepad ${gamepadIndex} connected !`);
  }

  function airValve(open) {
    open ? dispatch({ type: 'AIR_BUTTON_PRESSED' }) : dispatch({ type: 'AIR_BUTTON_RELEASED' });
    air(open);
  }

  function waterValve(open) {
    open ? dispatch({ type: 'WATER_BUTTON_PRESSED' }) : dispatch({ type: 'WATER_BUTTON_RELEASED' });
    water(open);
  }

  function launchValve(open) {
    open
      ? dispatch({ type: 'LAUNCH_BUTTON_PRESSED' })
      : dispatch({ type: 'LAUNCH_BUTTON_RELEASED' });

    if (open) launch();
  }

  function handleButtonChange(btn, pressed) {
    switch (btn) {
      case 'LT':
        airValve(pressed);
        break;
      case 'RT':
        waterValve(pressed);
        break;
      case 'A':
        launchValve(pressed);
        break;
      default:
        break;
    }
  }
  return (
    <Gamepad
      onConnect={handleGamepadConnected}
      onRT={handleButtonChange}
      onButtonChange={handleButtonChange}
    >
      <div
        css={css`
          background: linear-gradient(#9473f7, #e175e7);
          padding: 30px;
          height: 100vh;
          overflow: auto;
          min-width: 440px;
        `}
      >
        <div
          css={css`
            max-width: 800px;
            min-width: 380px;
            margin: 13px;
            background: white;
            margin: auto;
            padding: 20px;
            border-radius: 15px;
          `}
        >
          <div>
            <img src={Logo} width="100" alt="NodeRockets" />
          </div>

          <div
            css={css`
              display: flex;
              margin: auto;
              max-width: 440px;
              justify-content: space-around;
            `}
          >
            <Switch
              isOn={state.airPressed}
              onColor="#44AF69"
              knobColor="#fff"
              backgroundColor="#bcbcbc"
              handleDown={() => {
                airValve(true);
              }}
              handleUp={() => {
                airValve(false);
              }}
              label="Air"
            />

            <Switch
              isOn={state.waterPressed}
              onColor="#10c7e3"
              knobColor="#fff"
              backgroundColor="#bcbcbc"
              handleDown={() => {
                waterValve(true);
              }}
              handleUp={() => {
                waterValve(false);
              }}
              label="Water"
            />

            <Switch
              isOn={state.launchPressed}
              onColor="#F8333C"
              knobColor="#fff"
              backgroundColor="#bcbcbc"
              handleDown={() => {
                launchValve(true);
              }}
              handleUp={() => {
                launchValve(false);
              }}
              label="Launch"
            />
          </div>
        </div>
      </div>
    </Gamepad>
  );
}

export default App;
