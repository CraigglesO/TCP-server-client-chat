var net = require('net')
var jsonStream = require('duplex-json-stream')
var username = process.argv[2]
var socket = jsonStream(net.connect(10000, 'localhost'))

// var streamSet = require('stream-set')
//
// var streams = streamSet()

// var server = net.createServer(function (socket) {
//   console.log('A client is connected!');
//   // when the socket ends/errors it will automatically be removed from the set
//
//   streams.forEach((otherSocket) => {
//
//     otherSocket.on('data', function (data) {
//       socket.write(data)
//     })
//
//     socket.on('data', function (data) {
//       otherSocket.write(data)
//     })
//
//   })
//
//   streams.add(socket)
// })
//
// server.listen(10000, function () {
//   console.log('opened server on', server.address());
//   var socket = net.connect(10000)
//   // connect and destroy
//   socket.on('connect', function () {
//     socket.destroy()
//   })
// })

process.stdin.on('data', function (data) {
  socket.write({
    username: username,
    message: data.toString().trim()
  })
})

socket.on('data', function (data) {
  console.log(`${data.username}> ${data.message}`)
})
