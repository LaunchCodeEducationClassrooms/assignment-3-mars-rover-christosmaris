const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {
  const oldRoverPosition = 353535;
  const newRoverPosition = 464646;
  const messageName = 'Hello, from Earth!';
  const commandStatusCheck = new Command('STATUS_CHECK');
  const commandModeChangeLowPower = new Command('MODE_CHANGE', 'LOW_POWER');
  const commandMove = new Command('MOVE', newRoverPosition);

  it("constructor sets position and default values for mode and generatorWatts", function() {
    const rover = new Rover(oldRoverPosition);
    expect(rover.position).toEqual(oldRoverPosition);
    expect(rover.mode).toEqual('NORMAL');
    expect(rover.generatorWatts).toEqual(110);
  });

  it("response returned by receiveMessage contains name of message", function() {
    const rover = new Rover(oldRoverPosition);
    const message = new Message(messageName, [commandStatusCheck]);
    expect(rover.receiveMessage(message).message).toEqual(messageName);
  });

  it("response returned by receiveMessage includes two results if two commands are sent in the message", function() {
    const rover = new Rover(oldRoverPosition);
    const message = new Message(messageName, [commandStatusCheck, commandStatusCheck]);
    expect(rover.receiveMessage(message).results.length).toEqual(2);
  });

  it("responds correctly to status check command", function() {
    const rover = new Rover(oldRoverPosition);
    const message = new Message(messageName, [commandStatusCheck]);
    const { roverStatus } = rover.receiveMessage(message).results[0];

    expect(typeof roverStatus).toEqual('object');
    expect(roverStatus.mode).toEqual('NORMAL');
    expect(roverStatus.generatorWatts).toEqual(110);
    expect(roverStatus.position).toEqual(oldRoverPosition);
  });

  it("responds correctly to mode change command", function() {
    const rover = new Rover(oldRoverPosition);
    const message = new Message(messageName, [commandModeChangeLowPower, commandStatusCheck]);

    const [responseModeChange, responseStatusCheck] = rover.receiveMessage(message).results;

    expect(responseModeChange.completed).toEqual(true);
    expect(responseStatusCheck.completed).toEqual(true);
    expect(responseStatusCheck.roverStatus.mode).toEqual('LOW_POWER');
  });

  it("responds with false completed value when attempting to move in LOW_POWER mode", function() {
    const rover = new Rover(oldRoverPosition);
    const message = new Message(messageName, [commandModeChangeLowPower, commandMove]);
    const [responseModeChange, responseMove] = rover.receiveMessage(message).results;

    expect(responseModeChange.completed).toEqual(true);
    expect(responseMove.completed).toEqual(false);
    expect(rover.position).toEqual(oldRoverPosition);
  });

  it("responds with position for move command", function() {
    const rover = new Rover(oldRoverPosition);
    const message = new Message(messageName, [commandMove]);
    const responseMove = rover.receiveMessage(message).results[0];

    expect(responseMove.completed).toEqual(true);
    expect(rover.position).toEqual(newRoverPosition);
  });
});
