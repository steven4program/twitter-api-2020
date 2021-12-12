const db = require('../models')
const { Chat, Member } = db

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

  io.on('connection', async (socket) => {
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

    socket.on('leaved', async (obj) => {
      console.log('leaved', obj)
      const user = await Member.findByPk(obj.id)
      if (user) return
      await Member.destroy({ where: { id: obj.id } })
      // 下線的動作
      await Chat.create({
        UserId: obj.id,
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

    socket.emit('allMessages', async () => {
      let chats = await Chat.findAll({
        raw: true,
        attribute: [
          ['UserId', 'id'],
          'name',
          'message', // 可能為0或字串
          'type'
        ]
      })

      chats = chats.map((chat) => ({
        ...chat,
        message: chat.message == 0 ? 0 : chat.message
      }))
      return res.json(chats)
    })

    socket.on('typing', (data) => {
      socket.broadcast.emit('typing', data)
    })
    socket.on('stopTyping', (data) => {
      socket.broadcast.emit('stopTyping', data)
    })

    socket.on('message', async (obj) => {
      console.log('使用者' + obj.name + '傳來訊息' + obj.message)
      await Chat.create({
        UserId: obj.id,
        name: obj.name,
        message: obj.message,
        type: obj.type
      })
      io.emit('newMessage', obj)
    })

    socket.emit('allUsers', async () => {
      let members = await Member.findAll({
        raw: true
      })
      return res.json(members)
    })

    socket.on('user', async (obj) => {
      // username來自前端進入聊天室的動作
      const user = await Member.findByPk(obj.id)
      if (user) return
      await Member.create({
        ...obj
      })
      // 下線的動作
      await Chat.create({
        UserId: obj.id,
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
