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
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))

// Socket
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: [
      'https://learnpytest.github.io/Front_End_Vue_Simple_Twitter',
      'http://localhost:3000'
    ],
    methods: ['GET', 'POST'],
    transports: ['websocket', 'polling'],
    credentials: true
  },
  allowEIO3: true
})
const users = new Map() //儲存 Socket id 對應到的使用者名稱

io.on('connection', (socket) => {
  console.log(`${socket.id} connected`)
  const { clientsCount } = io.engine
  console.log('有人加入公開聊天室，目前人數:', clientsCount)

  socket.on('join', (name) => {
    io.emit('new member', name)
  })

  socket.on('message', (name, msg) => {
    io.emit('new message', name, msg)
  })

  socket.on('disconnect', () => {
    const name = users.get(socket.id)
    io.emit('member leave', name)
  })
})

server.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app)

module.exports = app
