// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import Logo from './nrlogo.png'

export default () => (
  <header
    css={css`
      margin: 1.5rem;
    `}
  >
    <img src={Logo} width="70" alt="NodeRockets" />
  </header>
)
