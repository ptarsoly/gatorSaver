var Muse = require('./muse/index');
var Leap = require('./leap/motionDetect');
var NRP = require('node-redis-pubsub');

var config = {
    port: 6379,
    host:'192.168.1.138',
    auth: 'potato',
    scope: 'swamphacks'
   };
   
   
   var nrp = new NRP(config);

//console.log(Muse.alphaWaves);

var alphaData = 0.0;
var thetaData = 0.0;

var enableMuseCollection = false;
var isIntoxicated = false;
var thetaCount = 0.0;
var alphaCount = 0.0;

/*var redisData = {
    alpha: redisAlpha,
    theta: redisTheta
};

redisAlpha.emit('data',alphaData);
redisTheta.emit('data',thetaData);*/

Muse.onTheta.on('refresh', (data) => {
    if(enableMuseCollection) {
        //console.log('theta is being called at '+data);

        thetaData += data;
        thetaCount++;
        //console.log('Theta: '+data/thetaCount);
    }
    
});

Muse.onAlpha.on('refresh', (data) => {
    if(enableMuseCollection) {
        console.log('muse is collecting');
        alphaData += data;
        alphaCount++;
        //console.log('Alpha: '+data/alphaCount);
    }
});

Leap.ERP.on('event', () => {
    if(Muse.isConnected) {
        enableMuseCollection = true;
        //console.log('on');
    }
});
Leap.ERP.on('wait', () => {
    if(Muse.isConnected) {
        enableMuseCollection = false;
        //console.log('wait');
    }
});

Leap.ERP.on('readyToSend', () => {
    if(Muse.isConnected) {
        alphaData/=alphaCount;
        if(alphaData<0.05) {
            console.log('You may be intoxicated');
            isIntoxicated = true;
        }
        else {
            console.log('You are likely not intoxicated');
            isIntoxicated = false;
        }
        //console.log('Theta: '+(redisData.theta/thetaCount));
        console.log('Alpha: '+alphaData);
        alphaData = 0.0;
        alphaCount = 0.0;
        enableMuseCollection = false;
        nrp.emit('intoxication', {drunk: isIntoxicated});
    }
});

//module.exports = redisData;