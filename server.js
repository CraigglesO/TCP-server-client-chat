//Get nodes net framework
const net = require('net');
var socketServer;

//setup an array of all the clients that connnet to the server
var streams = [];
var streamsNames = [];


//get our server up and running
const server = net.createServer(function (socket) {
  console.log('CONNECTED: ' + socket.remoteAddress +':'+ socket.remotePort);
  // when the socket ends/errors it will automatically be removed from the set
  socket.on('close', () => {
    console.log('A client has disconnected!');

    //get id of the guy who left
    let id = streams.indexOf(socket);
    //send a leave message
    let content = {
      username: streamsNames[id-1].name,
      message: 'has left'
    }
    //convert to a sendable format
    content = JSON.stringify(content).toString(16);

    //remove component
    streams.splice(id,1);
    streamsNames.splice(id-1,1);

    //send information
    streams.forEach((otherSocket) => {
      otherSocket.write(new Buffer(content, 16));
    });

  });

  socket.on('data', function(data) {
    streams.forEach((otherSocket) => {
      if (socket != otherSocket){
        otherSocket.write(data);
      }
    });
  });

  // socket.on('connection', () => {
  //   console.log('a connection has been established');
  //   let name = 'user';
  //
  //
  //
  //   streamsNames.push({name: name, id: socket.remotePort});
  // });

  streams.push(socket);
})
var newUser = {};
server.listen(10000, '0.0.0.0', () => {
  socketServer = net.connect(10000, 'localhost');
  socketServer.on('data', function (data) {
    let content = JSON.parse(data.toString());
    if (content.message === 'has joined') {
      newUser.name = content.username;
      streamsNames.push(newUser);
    }
  });
});

server.on('connection', (socket) => {

  newUser = {name: '', id: socket.remotePort};
  // streamsNames.push({name: '', id: socket.remotePort});
});
