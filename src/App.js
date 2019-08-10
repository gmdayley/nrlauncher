import React from 'react'
import tinygradient from 'tinygradient'
import Gamepad from 'react-gamepad'
import Switch from './Switch'
import Gauge from './Gauge'
import Header from './Header'
import Footer from './Footer'
import useLauncherIO from './launcher-io'

// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { jsx, css } from '@emotion/core'

function useLauncherState() {
  function reducer(state, action) {
    // console.log(action, state)
    switch (action.type) {
      case 'AIR_BUTTON_PRESSED':
        return {
          ...state,
          airPressed: true,
        }
      case 'AIR_BUTTON_RELEASED':
        return {
          ...state,
          airPressed: false,
        }
      case 'WATER_BUTTON_PRESSED':
        return {
          ...state,
          waterPressed: true,
        }
      case 'WATER_BUTTON_RELEASED':
        return {
          ...state,
          waterPressed: false,
        }
      case 'LAUNCH_BUTTON_PRESSED':
        return {
          ...state,
          launchPressed: true,
        }
      case 'LAUNCH_BUTTON_RELEASED':
        return {
          ...state,
          launchPressed: false,
        }
      case 'LAUNCHER_DATA_RECEIVED':
        return {
          ...state,
          launcher: action,
        }
      default:
        throw new Error('Unknown action type', action.type)
    }
  }

  return React.useReducer(reducer, {
    airPressed: false,
    waterPressed: false,
    launchPressed: false,
    launcherData: { name: 'Unknown', ready: false, voltage: 0, psi: 0 },
  })
}

function App() {
  const [{ airPressed, waterPressed, launchPressed, launcherData }, dispatch] = useLauncherState()
  const [air, water, launch] = useLauncherIO(dispatch)
  const [controller, setController] = React.useState()
  const [lastLaunchPsi, setLastLaunchPsi] = React.useState()
  const gradient = tinygradient([{ color: '#E175E7', pos: 0.7 }, { color: '#9473F7', pos: 1 }])

  // function onDataRecieved(data) {
  //   dispatch({ type: 'LAUNCHER_DATA_RECEIVED', action: data })
  // }

  function handleGamepadConnected(gamepadIndex) {
    setController(navigator.getGamepads()[0])
    console.log(`Gamepad ${gamepadIndex} connected!`)
  }

  function airValve(open) {
    open ? dispatch({ type: 'AIR_BUTTON_PRESSED' }) : dispatch({ type: 'AIR_BUTTON_RELEASED' })
    air(open)
  }

  function waterValve(open) {
    open ? dispatch({ type: 'WATER_BUTTON_PRESSED' }) : dispatch({ type: 'WATER_BUTTON_RELEASED' })
    water(open)
  }

  function launchValve(open) {
    open
      ? dispatch({ type: 'LAUNCH_BUTTON_PRESSED' })
      : dispatch({ type: 'LAUNCH_BUTTON_RELEASED' })

    launch(open)
    if (open) {
      setLastLaunchPsi(Math.trunc(launcherData.psi))
    }
  }

  function formatAirPressure(value) {
    return `${Math.trunc(value)} psi`
  }
  function formatVoltage(value) {
    return `${value.toFixed(2)} v`
  }

  function handleButtonChange(btn, pressed) {
    switch (btn) {
      case 'LT':
        airValve(pressed)
        break
      case 'RT':
        waterValve(pressed)
        break
      case 'A':
        launchValve(pressed)
        break
      default:
        break
    }
  }

  const containerCss = css`
    position: relative;
    min-height: 100vh;
    overflow: auto;
    min-width: 380px;
  `

  const contentCss = css`
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    max-width: 700px;
    padding-bottom: 1.5rem;
  `

  const gaugePanel = css`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    text-align: center;
  `

  const switchPanel = css`
    display: flex;
    margin: 40px 20px;
    min-width: 340px;
    justify-content: space-evenly;
  `
  return (
    <Gamepad onConnect={handleGamepadConnected} onButtonChange={handleButtonChange}>
      <div css={containerCss}>
        <Header />
        <div css={contentCss}>
          <div css={gaugePanel}>
            <Gauge
              label="Air Pressure"
              min={0}
              max={150}
              color={gradient.rgbAt(launcherData.psi / 160)}
              value={launcherData.psi}
              valueFormatter={formatAirPressure}
            />

            <Gauge
              label="Voltage"
              min={0}
              max={5}
              color={gradient.rgbAt(launcherData.voltage / 5)}
              value={launcherData.voltage}
              valueFormatter={formatVoltage}
            />
          </div>

          <div css={switchPanel}>
            <Switch
              label="Air"
              isOn={airPressed}
              onColor="#44AF69"
              handleDown={() => {
                airValve(true)
              }}
              handleUp={() => {
                airValve(false)
              }}
            />

            <Switch
              label="Water"
              isOn={waterPressed}
              onColor="#10C7E3"
              handleDown={() => {
                waterValve(true)
              }}
              handleUp={() => {
                waterValve(false)
              }}
            />

            <Switch
              label="Launch"
              isOn={launchPressed}
              onColor="#F8333C"
              handleDown={() => {
                launchValve(true)
              }}
              handleUp={() => {
                launchValve(false)
              }}
            />
          </div>
        </div>
        <Footer launchPsi={lastLaunchPsi} launcher={launcherData} controller={controller} />
      </div>
    </Gamepad>
  )
}

export default App
