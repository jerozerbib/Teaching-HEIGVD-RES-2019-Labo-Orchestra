const dgram = require('dgram');
const s = dgram.createSocket('udp4');

var instrument = process.argv[2];
var sound;
switch(instrument) {
    case "piano":
        sound = "ti-ta-ti";
        break;
    case "trumpet":
        sound = "pouet";
        break;
    case "flute":
        sound = "trulu";
        break;
    case "violin":
        sound = "gzi-gzi";
        break;
    case "drum":
        sound = "boum-boum";
        break;
}

var message = new Buffer(sound);

setInterval(function()
    {
        s.send(message, 0, message.length, 2205, '239.255.2.3', function(err, bytes){
            console.log("Sending payload: " + message + " via port 2205.");
        });
    }, 1000
);
