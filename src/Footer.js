// import React from 'react'

// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { jsx, css } from '@emotion/core'

export default function({ board, controller, launchPsi = '?' }) {
  const footerCss = css`
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px;
    background: #e175e7;
    color: white;

    > div {
      display: flex;
      justify-content: space-between;
      margin: 5px 15px 5px 15px;
      line-height: 30px;
    }
  `

  const itemCss = css`
    max-width: calc(32%);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `
  return (
    <footer css={footerCss}>
      <div>
        <div css={itemCss}>
          <span>Board: </span>
          <span>{board}</span>
        </div>

        <div css={itemCss}>
          <span>Last Launch: </span>
          <span>{launchPsi} psi</span>
        </div>

        <div css={itemCss}>
          <span>Controller: </span>
          <span>{controller ? controller.id : 'Not Connected'}</span>
        </div>
      </div>
    </footer>
  )
}
