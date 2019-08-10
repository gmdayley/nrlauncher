import React from 'react'
// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { jsx, css } from '@emotion/core'

function Switch({
  isOn,
  onColor = '#F8333C',
  knobColor = '#FFF',
  backgroundColor = '#BCBCBC',
  handleDown,
  handleUp,
  handleToggle,
  label,
}) {
  const labelCss = css`
    text-align: center;
    color: #9a9a9a;
    color: #777;
    text-transform: uppercase;
    position: relative;
    top: 4px;
  `
  const switchCss = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    width: 100px;
    height: 50px;
    background: ${isOn ? onColor : backgroundColor};
    border-radius: 100px;
    position: relative;
    transition: background-color 0.2s;
    -webkit-tap-highlight-color: transparent;

    span {
      content: '';
      position: absolute;
      top: 5px;
      left: ${isOn ? 'calc(100% - 5px)' : '5px'};
      transform: ${isOn ? 'translateX(-100%);' : 'translateX(0%);'};
      width: 40px;
      height: 40px;
      border-radius: 40px;
      transition: 0.2s;
      background: ${knobColor};
      box-shadow: 0 0 2px 0 rgba(10, 10, 10, 0.29);
    }
    /* &:active {
      span {
        width: 60px;
      }
    } */
  `

  return (
    <div>
      <div
        css={switchCss}
        // onClick={handleToggle}
        // onTouchStart={handleDown}
        // onTouchEnd={handleDown}
        // onMouseDown={handleDown}
        // onMouseUp={handleUp}
        // onMouseOverCapture={() => console.log('over')}
        // onMouseOutCapture={() => console.log('out')}
        onPointerDown={e => {
          e.stopPropagation()
          e.preventDefault()
          handleDown()
        }}
        onPointerUp={handleUp}
        // onLostPointerCapture={handleUp}
        // onMouseOut={handleUp}
      >
        <span />
      </div>
      <div css={labelCss}>{label}</div>
    </div>
  )
}

export default React.memo(Switch)
