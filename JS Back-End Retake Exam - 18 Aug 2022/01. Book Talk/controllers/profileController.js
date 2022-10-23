const { isGuest } = require('../middlewares/guard')
const { getUserWishList } = require('../services/bookServices')

const profileController = require('express').Router()


profileController.get('/', isGuest(), async (req, res) => {
    const wished = await getUserWishList(req.user._id);
    res.render('profile', {
        user: req.user,
        wished,
    })
})


module.exports = profileController
