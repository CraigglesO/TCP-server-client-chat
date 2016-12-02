var streamSet = require('stream-set')
var net = require('net')

var streams = streamSet()

var server = net.createServer(function (socket) {
  console.log('A client is connected!');
  // when the socket ends/errors it will automatically be removed from the set

  streams.forEach((otherSocket) => {

    otherSocket.on('data', function (data) {
      socket.write(data)
    })

    socket.on('data', function (data) {
      otherSocket.write(data)
    })

  })

  streams.add(socket)
})

server.listen(10000, function () {
  console.log('opened server on', server.address());
  var socket = net.connect(10000)
  // connect and destroy
  socket.on('connect', function () {
    socket.destroy()
  })
})
