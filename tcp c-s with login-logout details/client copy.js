const net = require('net');
const os = require('os');
const username = process.argv[2];
const socket = net.connect(10000, 'localhost');

process.stdin.on('data', function (data) {
  let content = {
    username: username,
    message: data.toString().trim()
  }
  content = JSON.stringify(content).toString(16);
  socket.write(new Buffer(content, 16));
});

socket.on('data', function (data) {
  let content = JSON.parse(data.toString());
  if (content.message === 'has joined') {
    console.log(`${content.username} ${content.message}`);
  }
  else if (content.message === 'has left') {
    console.log(`${content.username} ${content.message}`);
  }
  else if (content.username === 'server') {
    let content = {
      username: username,
      message: 'to server'
    }
    content = JSON.stringify(content).toString(16);
    socket.write(new Buffer(content, 16));
  }
  else {
    console.log(`${content.username}> ${content.message}`);
  }
});

// socket.on('connect', function(data) {
//   console.log(os.networkInterfaces());
// });

socket.on('connect', (data) => {
  let content = {
    username: username,
    message: 'has joined'
  }
  content = JSON.stringify(content).toString(16);
  socket.write(new Buffer(content, 16));
});
