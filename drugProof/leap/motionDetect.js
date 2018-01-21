var Leap = require('leapjs');
var events = require('events');

const ERP = new events.EventEmitter();

var controller = new Leap.Controller();


var numOfHands = 0;

var velocities;
var totalPalmVelocity = 0.0;
var hasHand = false;

controller.on('frame', (frameData) => {

    if(frameData.hands.length >= 1) {
        hasHand = true;
        var element = frameData.hands[0];
        
        totalPalmVelocity = Math.pow((element.palmVelocity[0]*element.palmVelocity[0]
            +element.palmVelocity[1]*element.palmVelocity[1]
            +element.palmVelocity[2]*element.palmVelocity[2]),0.5)/1000;
    }
    else {
        hasHand = false;
    }

    if(totalPalmVelocity >= 0.3 && hasHand) {
        ERP.emit('event');
    }
    else if(controller.frame(1).hands.length >= 1) {
        ERP.emit('event');
    }
    else if(controller.frame(2).hands.length >= 1 && frameData.hands.length == 0) { //end case
        ERP.emit('readyToSend');
    }
    else {
        ERP.emit('wait');
    }

});

/*Leap.loop(function(frame) {

    if(frame.hands.length != numOfHands) {
        numOfHands = frame.hands.length;
        console.log(frame.hands.length);
        
    }
    
    

    

});*/

  controller.connect();

  module.exports = {
      ERP: ERP
  }