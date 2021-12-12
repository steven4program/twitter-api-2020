// const socketio = require('socket.io')

// let io
// let userList = []

// const socket = (server) => {
//   io = socketio(server, {
//     cors: {
//       origin: [
//         'https://learnpytest.github.io/Front_End_Vue_Simple_Twitter',
//         'http://localhost:3000',
//         'http://localhost:8080'
//       ],
//       methods: ['GET', 'POST'],
//       transports: ['websocket', 'polling'],
//       credentials: true
//     },
//     allowEIO3: true
//   })
//   console.log('Init success')

//   if (!io) throw new Error('Init fail')

//   io.on('connection', (socket) => {
//     console.log('connected')
//     socket.on('join', () => {
//       console.log('User join')
//       socket.broadcast.emit('new member', {
//         message: 'User join'
//       })
//     })

//     socket.on('message', (msg) => {
//       console.log('msg', msg)
//       socket.broadcast.emit('new message', msg)
//     })

//     socket.on('disconnect', () => {
//       console.log('User leave.')
//       io.emit('member leave', {
//         message: 'user leave'
//       })
//     })
//   })
// }

// module.exports = { socket }
