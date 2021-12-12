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

  let users = []
  let messagesArr = []
  let index = 0
  const messages = [
    {
      id: '',
      name: 'Jack',
      message: 'HELLOOOOO',
      type: 0
    }
  ]

  app.get('/', (req, res) => {
    res.send('Hello')
  })

  io.on('connection', (socket) => {
    console.log('a user connected')
    const { clientsCount } = io.engine
    console.log(`在線人數: ${clientsCount}`)

    socket.on('Created', (data) => {
      socket.broadcast.emit('Created', data)
    })

    socket.on('joined', (obj) => {
      console.log('joined', obj)
      socket.broadcast.emit('joined', {
        ...obj
      })
    })

    socket.on('leaved', (obj) => {
      console.log('leaved', obj)
      const isExisted = users.find((user) => user.id === obj.id)
      if (!isExisted) return
      users.filter((user) => user.id !== obj.id)
      // 下線的動作
      messages.push({
        id: obj.id,
        name: obj.name,
        message: 0,
        type: -1
      })
      io.emit('newUser', {
        ...obj
      })
      io.emit('newMessage', {
        ...obj
      })
      socket.broadcast.emit('leaved', obj)
    })

    socket.emit('allMessages', messages)
    socket.on('typing', (data) => {
      socket.broadcast.emit('typing', data)
    })
    socket.on('stopTyping', (data) => {
      socket.broadcast.emit('stopTyping', data)
    })
    socket.on('message', (obj) => {
      console.log('使用者' + obj.name + '傳來訊息' + obj.message)
      messages.push({
        ...obj
      })
      io.emit('newMessage', obj)
    })
    socket.emit('allUsers', users)
    socket.on('user', (obj) => {
      // username來自前端進入聊天室的動作
      console.log(`${obj} has arrived the chatroom`)
      // socket.username = username
      // users.push(socket)
      const isExisted = users.find((user) => user.id === obj.id)
      if (isExisted) return
      users.push({
        ...obj
      })
      // 上線的動作
      messages.push({
        id: obj.id,
        name: obj.name,
        message: 0,
        type: 1
      })
      io.emit('newMessage', {
        id: obj.id,
        name: obj.name,
        message: 0,
        type: 1
      })
      io.emit('newUser', {
        ...obj
      })
      // test
      // socket.broadcast.emit("newUserReady", obj)
      // socket.broadcast.emit("joined", obj)
      socket.on('disconnect', () => {
        console.log(`${socket.username} has left the chatroom.`)
      })
    })
    socket.on('disconnect', () => {
      console.log(`${socket.username} has left the chatroom.`)
    })
  })
}

module.exports = { socket }
