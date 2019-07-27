import React from 'react'
import Gauge from 'react-svg-gauge'

const defaultProps = {
  height: 200,
  width: 300,
  backgroundColor: '#BCBCBC',
  topLabelStyle: { textTransform: 'uppercase', fill: '#777', fontSize: '26px' },
  valueLabelStyle: { fontSize: '26px' },
  minMaxLabelStyle: { fill: '#777' },
}
export default function({ ...props }) {
  return <Gauge {...defaultProps} {...props} />
}
