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

const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    transports: ['websocket', 'polling'],
    credentials: true
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

server.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app)

module.exports = app
