const { getByUserCreate } = require('../services/itemServices')
const { getUserWithPosts } = require('../services/userService')

const profileController = require('express').Router()

profileController.get('/', async (req, res) => {
    const data = await getByUserCreate(req.user._id)

    res.render('my-posts', {
        title: 'My Posts',
        user: req.user,
        data


    })
})

module.exports = profileController