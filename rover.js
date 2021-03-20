class Rover {
  constructor(position) {
    this.position = position;
    this.mode = 'NORMAL';
    this.generatorWatts = 110;
  }

  get status() {
    const { position, mode, generatorWatts } = this;
    return { position, mode, generatorWatts };
  }

  receiveMessage(message) {
    return {
      message: message.name,
      results: message.commands.map(({ commandType, value }) => {
        switch(commandType) {
          case 'MOVE':
            if (!value) {
              throw Error('A value must be given for a MOVE command.');
            } else if (this.mode === 'LOW_POWER') {
              return {completed: false};
            } else {
              this.position = value;
              return {completed: true};
            }
          case 'STATUS_CHECK':
            return {completed: true, roverStatus: this.status};
          case 'MODE_CHANGE':
            if (!value) {
              throw Error('A value must be given for a MODE_CHANGE command.');
            } else {
              this.mode = value;
              return {completed: true};
            }
          default:
            throw Error('Invalid command given.');
        }
      }),
    };
  }
}

module.exports = Rover;