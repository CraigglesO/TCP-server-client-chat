var topology = require('fully-connected-topology');
var jsonStream = require('duplex-json-stream');
var streamSet = require('stream-set');
var register = require('register-multicast-dns');
var toPort = require('hash-to-port');

var me = process.argv[2];
var peers = process.argv.slice(3);

var swarm = topology(toAddress(me), peers.map(toAddress));
var streams = streamSet();

var id = Math.random();
var seq = 0;
var logs = {};

register(me);

swarm.on('connection', (socket) => {
  socket = jsonStream(socket);
  streams.add(socket);
  socket.on('data', (data) => {
    if (logs[data.log] <= data.seq) return;
    logs[data.log] = data.seq;
    console.log(`${data.username}> ${data.message}`);
    streams.forEach((othersockets) => {
      othersockets.write(data);
    })
  });
  console.log('new connection');


});



process.stdin.on('data', function (data) {
  var next = seq++;
  streams.forEach((socket) => {
    socket.write({log: id, seq: seq, username: me, message: data.toString().trim()});
  });
});


function toAddress (name) {
  return name + '.local:' + toPort(name);
}
