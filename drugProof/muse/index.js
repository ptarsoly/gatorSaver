//var ipAddressAndPort = 'http://10.223.57.29:8011';

var events = require('events');
var nodeMuse = require('node-muse');
//var request = require('request-json');
//var client = request.createClient(ipAddressAndPort);
 
const alphaEvent = new events.EventEmitter();
const thetaEvent = new events.EventEmitter();

var jsonData = {

    'concentration':0.0,
    'mellow':0.0
};

var Muse = nodeMuse.Muse;
var OSC = nodeMuse.OSC;

var alpha = 0.0;
var theta = 0.0;

var toExport = {
    onTheta: thetaEvent,
    onAlpha: alphaEvent,
    isConnected: false
};

Muse.on('/muse/elements/theta_absolute', function(data) {
    theta = ((data.values[1]+data.values[2])/2.0);
    //console.log('theta: '+theta);
    thetaEvent.emit('refresh',theta);
});

Muse.on('/muse/elements/alpha_absolute', function(data) {
    alpha = ((data.values[0]+data.values[1]+data.values[2]+data.values[3])/4.0);
    alphaEvent.emit('refresh',alpha);
});

Muse.on('connected', () => {
    console.log('connected');
    toExport.isConnected = true;
});

/*Muse.on('/muse/elements/experimental/mellow', function(data) {
    jsonData.mellow = data.values;
    if(jsonData.mellow >= 0.5) {
        console.log("Mellowing out");
        client.post('/posts/', jsonData, function(err, res, body) {
            return console.log(res.statusCode);
          });
    }
    
});*/

Muse.on('disconnected', function(){
    console.log("No sensor =  no fun");
    toExport.isConnected = false;
});


function exitHandler(options, err) {
    if (options.cleanup) {
        nodeMuse.disconnect();
        console.log('clean');
    }
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

module.exports = toExport;

nodeMuse.connect();