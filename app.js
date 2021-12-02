const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')

const helpers = require('./_helpers');
const passport = require('./config/passport')
const methodOverride = require('method-override')

const db = require('./models')

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
};

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
require('./routes')(app)
module.exports = app
