const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const { ArduinoUnoLauncher: Launcher } = require('./launcher/launcher')
const launcher = new Launcher()

// const { ParticleLauncher: Launcher } = require('./launcher/launcher')
// const { token, deviceId } = require('./config.json').particle
// const launcher = new Launcher(token, deviceId)

// our localhost port
const port = process.env.PORT || 3001

const app = express()

// our server instance
const server = http.createServer(app)

// This creates our socket using the instance of the server
const io = socketIO(server)

io.on('connection', socket => {
  console.log('client connected')

  socket.on('open-water', () => {
    console.log('open-water')
    launcher.openWater()
  })

  socket.on('close-water', () => {
    console.log('close-water')
    launcher.closeWater()
  })

  socket.on('open-air', () => {
    console.log('open-air')
    launcher.openAir()
  })

  socket.on('close-air', () => {
    console.log('close-air')
    launcher.closeAir()
  })

  socket.on('open-launch', () => {
    console.log('open-launch')
    launcher.openLaunch()
  })

  socket.on('close-launch', () => {
    console.log('close-launch')
    launcher.closeLaunch()
  })

  socket.on('launch', () => {
    console.log('launch')
    launcher.launch()
  })

  setInterval(() => {
    const { name, voltage, pressure, ready } = launcher
    socket.emit('data', { name, ready, voltage, pressure })
  }, 100)

  launcher.on('ready', () => {
    console.log(`launcher ready`)
    // socket.emit('data');
    socket.emit('launcher-ready')
  })

  launcher.on('error', error => {
    console.log(`Error: ${error.message}`)
  })
})

app.use(express.static('../build'))

server.listen(port, () => console.log(`Listening on port ${port}`))
