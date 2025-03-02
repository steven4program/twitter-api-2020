const { json } = require('body-parser')
const { system } = require('faker')
const db = require('../../models')
const { Tweet, Like } = db
const helpers = require('../../_helpers')

const likeController = {
  like: async (req, res) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) {
        return res.json({
          status: 'error',
          message: 'This tweet did Not exist!'
        })
      }
      const likeStatusCheck = await Like.findOne({
        where: { UserId, TweetId }
      })
      if (likeStatusCheck) {
        return res.json({
          status: 'error',
          message: "You've already liked this tweet!"
        })
      }
      await Like.create({ UserId, TweetId })
      return res.json({
        status: 'success',
        message: 'Successfully like tweet!'
      })
    } catch (err) {
      console.log(err)
    }
  },
  unlike: async (req, res) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) {
        return res.json({
          status: 'error',
          message: 'This tweet did Not exist!'
        })
      }
      const likeStatusCheck = await Like.findOne({
        where: { UserId, TweetId }
      })

      if (!likeStatusCheck) {
        return res.json({
          status: 'error',
          message: 'You have Not liked this tweet!'
        })
      }

      const like = await Like.findOne({
        where: { UserId, TweetId }
      })
      await like.destroy()
      return res.json({
        status: 'success',
        message: 'Successfully unlike tweet!'
      })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = likeController
