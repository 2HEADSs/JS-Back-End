const Crypto = require('../models/Crypto');

//guards

async function getAll() {
    return Crypto.find({}).lean()
}

async function createCrypto(crypto) {
    return Crypto.create(crypto)
}

async function getById(id) {
    return Crypto.findById(id)
}


module.exports = {
    getAll,
    createCrypto,
    getById
}