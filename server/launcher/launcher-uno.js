const EventEmitter = require('events').EventEmitter;
const five = require('johnny-five');
// const Particle = require("particle-io");

class Launcher extends EventEmitter {
  constructor(opts) {
    super();
    this.opts = Object.assign(
      {},
      {
        launchPin: 2,
        airPin: 3,
        waterPin: 4,
        pressurePin: 'A1',
        z1: 270,
        slope: 0.54789,
        yint: -2.22689,
      },
      opts
    );

    // Data
    this.ready = false;
    this.pressure = 0;
    this.voltage = 0;

    // Initialize
    this.initBoard();
  }

  initBoard() {
    // Connect to the board
    this.board = new five.Board({
      repl: false,
      debug: false,
    });

    this.board.on('ready', () => {
      console.log('board ready');
      let launcher = this;

      // Setup pins
      this.board.pinMode(this.opts.launchPin, five.Pin.OUTPUT);
      this.board.pinMode(this.opts.airPin, five.Pin.OUTPUT);
      this.board.pinMode(this.opts.waterPin, five.Pin.OUTPUT);

      // Setup sensor
      let pressureSensor = new five.Sensor(this.opts.pressurePin);

      pressureSensor.on('change', function() {
        // Scale for voltage
        launcher.voltage = this.fscaleTo(0, 5);

        // Solve for Z2:  Z2 = Z1 / ((Vin / Vout) - 1)
        let z2 = launcher.opts.z1 / (5 / launcher.voltage) - 1;

        // Vout = (Z2 / (Z1 + Z2)) * Vin
        let rawPressure = launcher.opts.slope * z2 + launcher.opts.yint;
        launcher.pressure = Math.max(0, Math.min(rawPressure, 160));
      });

      this.ready = true;
      this.emit('ready');
    });

    this.board.on('error', error => {
      this.emit('error', error);
    });

    this.board.on('exit', msg => {
      this.emit('exit', msg);
    });
  }

  openAir() {
    if (this.ready) this.board.digitalWrite(this.opts.airPin, 1);
  }

  closeAir() {
    if (this.ready) this.board.digitalWrite(this.opts.airPin, 0);
  }

  openWater() {
    if (this.ready) this.board.digitalWrite(this.opts.waterPin, 1);
  }

  closeWater() {
    if (this.ready) this.board.digitalWrite(this.opts.waterPin, 0);
  }

  launch(waitToClose = 1000) {
    if (this.ready) {
      this.board.digitalWrite(this.opts.launchPin, 1);
      setTimeout(() => this.board.digitalWrite(this.opts.launchPin), waitToClose);
    }
  }
}

module.exports = Launcher;
