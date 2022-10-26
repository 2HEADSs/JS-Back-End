
const Crypto = require('../models/Crypto');


async function getBySearch(cryptoName, paymentMethod) {
    return await Crypto.find({ name: { $regex: cryptoName, $options: 'i' }, payment: { $regex: paymentMethod, $options: 'i' } }).lean()
}


module.exports = getBySearch