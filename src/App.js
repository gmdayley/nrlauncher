import React from 'react'
import Logo from './nrlogo.png'
import tinygradient from 'tinygradient'
import Gamepad from 'react-gamepad'
import Switch from './Switch'
import Gauge from './Gauge'
import useLauncherIO from './launcher-io'

// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { jsx, css } from '@emotion/core'

function useLauncherButton() {
  function reducer(state, action) {
    console.log(action, state)
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
          launcherData: action.launcherData,
        }
      default:
        throw new Error('Unknown action type', action.type)
    }
  }

  return React.useReducer(reducer, {
    airPressed: false,
    waterPressed: false,
    launchPressed: false,
    launcherData: { voltage: 0, psi: 0 },
  })
}

function App() {
  const [state, dispatch] = useLauncherButton()
  const [air, water, launch] = useLauncherIO(dispatch)
  const gradient = tinygradient([{ color: '#E175E7', pos: 0.7 }, { color: '#9473F7', pos: 1 }])

  function handleGamepadConnected(gamepadIndex) {
    console.log(`Gamepad ${gamepadIndex} connected !`)
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

    if (open) launch()
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
    min-width: 440px;
  `

  const contentCss = css`
    max-width: 800px;
    min-width: 380px;
    margin: auto;
    padding: 2rem;
    padding-bottom: 3.5rem;
  `

  const gaugePanelCss = css`
    text-align: center;
    margin-top: 20px;
  `

  const switchPanel = css`
    display: flex;
    margin: 20px auto 0px auto;
    max-width: 440px;
    justify-content: space-around;
  `

  const footerCss = css`
    display: flex;
    justify-content: space-between;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 2.5rem;
    /* padding: 3px; */
    /* background: linear-gradient(#9473f7, #e175e7); */
    background: #e175e7;
    color: white;
    line-height: 2.5rem;
  `
  return (
    <Gamepad
      onConnect={handleGamepadConnected}
      onRT={handleButtonChange}
      onButtonChange={handleButtonChange}
    >
      <div css={containerCss}>
        <div css={contentCss}>
          <div>
            <img src={Logo} width="100" alt="NodeRockets" />
          </div>

          <div css={gaugePanelCss}>
            <Gauge
              label="Air Pressure"
              min={0}
              max={150}
              color={gradient.rgbAt(state.launcherData.pressure / 160)}
              value={state.launcherData.pressure}
              valueFormatter={formatAirPressure}
            />

            <Gauge
              label="Voltage"
              min={0}
              max={5}
              color={gradient.rgbAt(state.launcherData.voltage / 5)}
              value={state.launcherData.voltage}
              valueFormatter={formatVoltage}
            />
          </div>

          <div css={switchPanel}>
            <Switch
              label="Air"
              isOn={state.airPressed}
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
              isOn={state.waterPressed}
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
              isOn={state.launchPressed}
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
        <footer css={footerCss}>
          <span>Hello</span>
        </footer>
      </div>
    </Gamepad>
  )
}

export default App
