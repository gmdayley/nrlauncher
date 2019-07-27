// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

export default function Switch({
  isOn,
  onColor = 'hotpink',
  knobColor = 'hotpink',
  backgroundColor = 'grey',
  handleDown,
  handleUp,
  handleToggle,
  text,
  label,
}) {
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

    span:nth-child(1) {
      content: '';
      position: absolute;
      top: 2px;
      left: ${isOn ? 'calc(100% - 2px)' : '2px'};
      transform: ${isOn ? 'translateX(-100%);' : 'translateX(0%);'};
      width: 45px;
      height: 45px;
      border-radius: 45px;
      transition: 0.2s;
      background: ${knobColor};
      box-shadow: 0 0 2px 0 rgba(10, 10, 10, 0.29);
    }
    /* &:active {
      span {
        width: 60px;
      }
    } */
  `;

  return (
    <div css={switchCss} onMouseDown={handleDown} onMouseUp={handleUp}>
      <span />
    </div>
  );
}
