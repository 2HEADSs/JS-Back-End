const { getUserWithPosts } = require('../services/userService')

const profileController = require('express').Router()

profileController.get('/', async (req, res) => {
    const data = await getUserWithPosts(req.user._id)
    const author = req.user.email
    data.posts.map(x=> x.author = req.user.email)
    res.render('my-posts', {
        title: 'My Posts',
        user: req.user,
        posts: data.posts,
        author
    })
})

module.exports = profileController