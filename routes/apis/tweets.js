const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweetController')
const { authenticated } = require('../../middleware/auth')

router.get('/', authenticated, tweetController.getTweets)
router.get('/:id', authenticated, tweetController.getTweet)
router.delete('/:id', authenticated, tweetController.deleteTweet)
router.post('/', authenticated, tweetController.postTweet)
router.put('/:id', authenticated, tweetController.putTweet)
router.post('/:tweetId/replies', authenticated, tweetController.postReply)
router.get('/:tweetId/replies', authenticated, tweetController.getReply)
router.post('/:tweetId/like', authenticated, tweetController.addLike)
router.post('/:tweetId/unlike', authenticated, tweetController.removeLike)


module.exports = router