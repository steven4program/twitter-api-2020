//必要套件
const passport = require('passport')
const bcrypt = require('bcryptjs')
// DB
const db = require('../models')
const { User, Tweet } = db

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  User.findByPk(jwt_payload.id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' },
      { model: Tweet, as: 'LikedTweets' }
    ]
  }).then((user) => {
    if (!user) return next(null, false)
    return next(null, user)
  })
})
passport.use(strategy)

module.exports = passport
