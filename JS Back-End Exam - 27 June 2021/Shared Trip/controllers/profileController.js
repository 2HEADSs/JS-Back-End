const { getUserWithTrips } = require('../services/userService')

const profileController = require('express').Router()

profileController.get('/', async (req, res) => {

    const data = await getUserWithTrips(req.user._id)
    let male = true;
    if (data.gender == 'female') {
        male = false
    }

    res.render('profile', {
        title: 'Profile Page',
        user: req.user,
        trips: data.tripHistory,
        count: data.tripHistory.length,
        male,
        email: data.email
    })
})


module.exports = profileController