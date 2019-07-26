import React from 'react';
import './App.css';
import Logo from './nrlogo.png';
import Gauge from 'react-svg-gauge';
import tinygradient from 'tinygradient';
import socketClient from 'socket.io-client';
import Gamepad from 'react-gamepad';

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
    if (false && socket) {
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
    switch (action.type) {
      case 'BUTTON_PRESSED':
        return {
          pressed: true,
        };
      case 'BUTTON_RELEASED':
        return {
          pressed: false,
        };
      default:
        throw new Error('Unknown action type', action);
    }
  }

  const [state, dispatch] = React.useReducer(reducer, { pressed: false });

  React.useEffect(() => {
    state.pressed ? console.log('pressed') : console.log('released');
  });

  return [state, dispatch];
}

function App() {
  console.log('rendering');
  const [gradient] = useGradient(['#e175e7', '#9473f7']);
  const [launcherData, air, water, launch] = useLauncher();

  const [state, dispatch] = useLauncherButton();

  function formatAirPressure(value) {
    return `${Math.trunc(value)} psi`;
  }
  function formatVoltage(value) {
    return `${value.toFixed(2)} v`;
  }

  function handleGamepadConnected(gamepadIndex) {
    console.log(`Gamepad ${gamepadIndex} connected !`);
  }

  function handleButtonChange(btn, pressed) {
    switch (btn) {
      case 'LT':
        air(pressed);
        break;
      case 'RT':
        water(pressed);
        break;
      case 'A':
        launch();
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
              text-align: center;
            `}
          >
            <Gauge
              color={gradient.rgbAt(launcherData.pressure / 160)}
              valueLabelStyle={{ fontSize: '32px' }}
              xbackgroundColor="darkgray"
              height={200}
              width={300}
              value={launcherData.pressure}
              label="Air Pressure"
              min={0}
              max={150}
              valueFormatter={formatAirPressure}
            />

            <Gauge
              color={gradient.rgbAt(launcherData.voltage / 5)}
              valueLabelStyle={{ fontSize: '32px' }}
              xbackgroundColor="white"
              height={200}
              width={300}
              value={launcherData.voltage}
              label="Voltage"
              min={0}
              max={5}
              valueFormatter={formatVoltage}
            />
          </div>

          <div
            css={css`
              display: flex;
              justify-content: center;
            `}
          >
            <Button
              text="Air"
              handleButtonDown={() => air(true)}
              handleButtonUp={() => air(false)}
            />
            <Button
              text="Water"
              handleButtonDown={() => water(true)}
              handleButtonUp={() => water(false)}
            />
            <Button text="Launch" handleButtonClick={launch} />

            <a
              onMouseDown={() => dispatch({ type: 'BUTTON_PRESSED' })}
              onMouseUp={() => dispatch({ type: 'BUTTON_RELEASED' })}
            >
              <B pressed={state.pressed} />
            </a>
          </div>
        </div>
      </div>
    </Gamepad>
  );
}

function B({ pressed, onPressed, onReleased }) {
  return pressed ? <div>PRESSED</div> : <div>RELEASED</div>;
}

function Button({ text, pressed, handleButtonDown, handleButtonUp, handleButtonClick }) {
  // const [pressed, setPressed] = React.useState(false);

  const btnStyle = css`
    height: 50px;
    line-height: 50px;
    font-size: 22px;
    font-weight: bold;
    text-transform: uppercase;
    color: #9473f7;
    text-align: center;
    width: 150px;
    box-shadow: 0 0 2px #777;
    border: 1px solid #9473f7;
    /* border: 3px solid;
    border-image: linear-gradient(#9473f7, #e175e7) 1; */
    &:active {
      color: white;
      /* background:linear-gradient(#9473f7,#e175e7); */
      background: #9473f7;
    }
    margin: 5px;
  `;

  function buttonDown() {
    // setPressed(true);
    handleButtonDown && handleButtonDown();
  }

  function buttonUp() {
    // setPressed(false);
    handleButtonUp && handleButtonUp();
  }

  return (
    <a css={btnStyle} onMouseDown={buttonDown} onMouseUp={buttonUp} onClick={handleButtonClick}>
      {text} {pressed && '****'}
    </a>
  );
}

export default App;
