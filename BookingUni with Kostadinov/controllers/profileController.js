const { hasUser } = require('../middlewares/guard');
const { getByUserBooking } = require('../services/hotelService');

const profileController = require('express').Router();

profileController.get('/', hasUser(), async (req, res) => {
    const bookings = await getByUserBooking(req.user._id)
    res.render('profile', {
        title: 'Profile page',
        user: Object.assign({ bookings: bookings }, req.user)
    });
});

module.exports = profileController;