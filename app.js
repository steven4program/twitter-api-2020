/* setting */
const port = process.env.PORT || 3000
// dotenv.config()
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

/* necessary package */
// express
const express = require('express')
const cors = require('cors')

// passport
const passport = require('./config/passport')
// body-parser
const bodyParser = require('body-parser')
// methodOverride
const methodOverride = require('method-override')

/* app */
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(cors())
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))

// load static resource
// const path = require('path')
// app.use(express.static(path.join(__dirname, 'public')))

// Socket
// const exphbs = require('express-handlebars')
const server = require('http').Server(app)
const io = require('socket.io')(server)
let users = []
let messagesArr = []
let index = 0
const messages = [
  {
    name: 'Jack',
    message: 'HELLOOOOO'
  }
]
app.get('/', (req, res) => {
  res.send('Hello')
})
io.on('connection', (socket) => {
  console.log('a user connected')
  socket.emit('allMessages', messages)
  socket.on('message', (obj) => {
    console.log('使用者' + obj.name + '傳來訊息' + obj.message)
    messages.push(obj)
    io.emit('newMessage', obj)
  })
  // socket.on("mouseMove", obj => {
  //   console.log(obj)
  // })
  // socket.emit("")
  socket.on('newuser', (username) => {
    // username來自前端進入聊天室的動作
    console.log(`${username} has arrived the chatroom`)
    socket.username = username
    users.push(socket)
  })
  socket.on('disconnect', () => {
    console.log(`${socket.username} has left the chatroom.`)
  })
})

server.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app)

module.exports = app
