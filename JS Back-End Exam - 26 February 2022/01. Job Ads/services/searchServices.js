const User = require('../models/User');


async function getBySearch(email) {
    return await User.find({ email: { $regex: email, $options: 'i' } }).populate('personalAds').lean()

}


module.exports = getBySearch