// TCP
var dgram = require('dgram');

var s = dgram.createSocket('udp4');
var moment = require('moment');
var instruments = [];

s.bind(2205, function(){
    console.log("Joining multicast group");
    s.addMembership('239.255.2.3');
});

s.on('message', function(msg, source) {
    console.log("Data has arrived: " + msg + ". Sourc IP: " + source.address + ". Source port: " + source.port);
    var sound = msg.toString();
    var instrument;
    var port = source.port;
    switch(sound){
        case "ti-ta-ti":
            instrument = "piano";
            break;
        case "trulu":
            instrument = "flute";
            break;
        case "boum-boum":
            instrument = "drum";
            break;
        case "gzi-gzi":
            instrument = "violin";
            break;
        case "pouet":
            instrument = "trumpet";
            break;
    }
    if(!instruments[port]){
        var uuid = guid();
        instruments[port] = [];
        instruments[port].push(instrument);
        instruments[port].push(uuid);
        instruments[port].push(moment());

    }
    // Actualisation du moment du dernier message
    instruments[port].splice(3,1);
    instruments[port].push(moment());
    console.log(instruments);


});


setInterval(function() {
        for(port in instruments){
            if(moment().diff(instruments[port][3], 'seconds') >= 5){
                delete instruments[port];
            }
        }
    }, 10
);

const net = require('net');

const PORT = 2205;
const ADDRESS = '0.0.0.0';

var server = net.createServer(onClientConnected);
server.listen(PORT, ADDRESS);

function onClientConnected(socket) {
    console.log(`New client: ${socket.remoteAddress}:${socket.remotePort}`);
    var tab = [];
    for(port in instruments) {
        var test = new Object();
        test.uuid = instruments[port][1];
        test.instrument = instruments[port][0];
        test.activeSince = instruments[port][2];
        tab.push(test);
    }

    socket.write(JSON.stringify(tab));
    socket.destroy();
}

console.log(`Server started at: ${ADDRESS}:${PORT}`);

// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
