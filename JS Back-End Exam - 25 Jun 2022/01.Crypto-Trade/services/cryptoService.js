const Crypto = require('../models/Crypto');

//guards

async function getAll() {
    return Crypto.find({}).lean()
}

async function createCrypto(crypto) {
    return Crypto.create(crypto)
}

async function getById(id) {
    return Crypto.findById(id).lean()
}

async function deleteById(id) {
    return Crypto.findByIdAndDelete(id)
}

async function editById(id, data) {
    const existing = await Crypto.findById(id);
    existing.name = data.name
    existing.imageUrl = data.imageUrl
    existing.price = data.price
    existing.description = data.description
    existing.payment = data.payment

    return existing.save()
}


module.exports = {
    getAll,
    createCrypto,
    getById,
    editById,
    deleteById
}