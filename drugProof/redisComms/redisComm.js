var data = require('../index');
var NRP = require('node-redis-pubsub');

var config = {
 port: 6379,
 host:'192.168.1.138',
 auth: 'potato',
 scope: 'swamphacks'
};


var nrp = new NRP(config);

console.log('starting');

nrp.on('hello',function(data){
 console.log(data);
})



