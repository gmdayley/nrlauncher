const EventEmitter = require('events').EventEmitter
const five = require('johnny-five')
const Particle = require('particle-io')

class Launcher extends EventEmitter {
  constructor(name = 'Unknown', opts) {
    super()
    this.opts = Object.assign(
      {},
      {
        launchPin: 2,
        airPin: 3,
        waterPin: 4,
        pressurePin: 'A1',
        z1: 270,
        pinVoltage: 5,
        pinMaxAnalogValue: 1023,
      },
      opts
    )

    // Data
    this.name = name
    this.ready = false
    this.psi = 0
    this.voltage = 0
  }

  initBoard(board) {
    this.board = board
    board.on('ready', () => {
      console.log('board ready')
      let launcher = this

      // Setup pins
      board.pinMode(this.opts.launchPin, five.Pin.OUTPUT)
      board.pinMode(this.opts.airPin, five.Pin.OUTPUT)
      board.pinMode(this.opts.waterPin, five.Pin.OUTPUT)

      // Setup sensor
      let pressureSensor = new five.Sensor(this.opts.pressurePin)

      pressureSensor.on('change', function() {
        console.log(this.value)
        // Scale for voltage
        launcher.voltage = this.fscaleTo(0, launcher.opts.pinVoltage)

        // https://www.amazon.com/Pressure-Transducer-Sender-Sensor-Stainless/dp/B0748CV4G1/ref=asc_df_B0748BHLQL/?tag=&linkCode=df0&hvadid=312179635408&hvpos=1o4&hvnetw=g&hvrand=15704198629500178214&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9029705&hvtargid=pla-491658188060&ref=&adgrpid=61727971106&th=1
        // Output: 0.5-4.5V linear voltage output. 0 psi outputs 0.5V, 75 psi outputs 2.5V, 150 psi outputs 4.5V
        // y = 37.5x - 18.75
        let psi = 37.5 * launcher.voltage - 18.75
        launcher.psi = Math.min(150, Math.max(0, psi))
      })

      this.ready = true
      this.emit('ready')
    })

    board.on('error', error => {
      this.emit('error', error)
    })

    board.on('exit', msg => {
      this.emit('exit', msg)
    })
  }

  openAir() {
    if (this.ready) this.board.digitalWrite(this.opts.airPin, 1)
  }

  closeAir() {
    if (this.ready) this.board.digitalWrite(this.opts.airPin, 0)
  }

  openWater() {
    if (this.ready) this.board.digitalWrite(this.opts.waterPin, 1)
  }

  closeWater() {
    if (this.ready) this.board.digitalWrite(this.opts.waterPin, 0)
  }

  openLaunch() {
    if (this.ready) this.board.digitalWrite(this.opts.launchPin, 1)
  }

  closeLaunch() {
    if (this.ready) this.board.digitalWrite(this.opts.launchPin, 0)
  }

  launch(waitToClose = 1000) {
    if (this.ready) {
      this.board.digitalWrite(this.opts.launchPin, 1)
      setTimeout(() => this.board.digitalWrite(this.opts.launchPin), waitToClose)
    }
  }
}

class ArduinoUnoLauncher extends Launcher {
  constructor() {
    super('Uno', {
      launchPin: 2,
      airPin: 3,
      waterPin: 4,
      pressurePin: 'A1',
      pinVoltage: 5,
      pinMaxAnalogValue: 1023,
    })

    // Create board
    const board = new five.Board({
      repl: false,
      debug: false,
    })

    this.initBoard(board)
  }
}

class ParticleLauncher extends Launcher {
  constructor(token, deviceId) {
    super('Particle', {
      launchPin: 2,
      airPin: 0,
      waterPin: 1,
      pressurePin: 'A0',
      pinVoltage: 3.3,
      pinMaxAnalogValue: 4095,
    })

    //Create Board
    const particle = new Particle({
      token,
      deviceId,
    })

    particle.on('error', error => {
      console.log(error)
      // this.emit("error", error);
    })

    const board = new five.Board({
      io: particle,
      repl: false,
      debug: true,
    })

    this.initBoard(board)
  }
}

module.exports = { ArduinoUnoLauncher, ParticleLauncher }
