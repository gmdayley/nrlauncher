// import React from 'react'

// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { jsx, css } from '@emotion/core'

import { GoRocket, GoDashboard } from 'react-icons/go'
import { GiConsoleController } from 'react-icons/gi'

export default function({ launcher, controller, launchPsi = 'N/A' }) {
  const footerCss = css`
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px;
    background: #e175e7;
    color: white;

    > div {
      padding: 0 10px;
      height: 100%;
      display: grid;
      grid-template-columns: 30px 30px auto 80px;
    }
  `

  return (
    <footer css={footerCss}>
      <div>
        <div>{launcher.ready && <IconLabel Icon={GoRocket} />}</div>
        <div>{controller && <IconLabel Icon={GiConsoleController} />}</div>
        <div />
        <div>
          <IconLabel Icon={GoDashboard} label={`${launchPsi} psi`} />
        </div>
      </div>
    </footer>
  )
}

function IconLabel({ Icon, label }) {
  const itemCss = css`
    font-size: 20px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    span:nth-child(1) {
      font-size: 20px;
      line-height: 40px;
    }
    span:nth-child(2) {
      margin: 5px;
      font-size: 14px;
    }
  `

  return (
    <div css={itemCss}>
      <span>
        <Icon />
      </span>
      <span>{label}</span>
    </div>
  )
}
