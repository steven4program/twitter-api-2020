const socket = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: [
        'https://learnpytest.github.io/Front_End_Vue_Simple_Twitter/',
        'https://twitter-llrs-chatroom.herokuapp.com/',
        'http://localhost:3000',
        'http://localhost:8080'
      ],
      methods: ['GET', 'POST'],
      transports: ['websocket', 'polling']
    },
    allowEIO3: true
  })
  io.on('connection', (socket) => {
    console.log('A user connected')
    const { clientsCount } = io.engine
    console.log(`在線人數: ${clientsCount}`)

    socket.on('joinRoom', () => {
      socket.broadcast.emit('join', {
        message: '一位 User 進入聊天室'
      })
    })

    socket.on('message', (msg) => {
      console.log('message', msg)
    })

    socket.on('disconnect', () => {
      console.log('一位 User 離開聊天室')
    })
  })
}

module.exports = { socket }
