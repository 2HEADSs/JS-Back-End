
const Ad = require('../models/Ad');


async function getAll() {
    return Ad.find({}).lean()
}

async function createAd(crypto) {
    return Ad.create(crypto)
}

async function getById(id) {
    return Ad.findById(id).lean()
}

async function deleteById(id) {
    return Ad.findByIdAndDelete(id)
}

async function editById(id, data) {
    const existing = await Ad.findById(id);
    existing.name = data.name
    existing.imageUrl = data.imageUrl
    existing.price = data.price
    existing.description = data.description
    existing.payment = data.payment

    return existing.save()
}

async function buyCrypto(cryptoId, userId) {
    const existing = await Ad.findById(cryptoId)
    existing.buyer.push(userId);
    return existing.save()
}

//TODO check
async function searchRefDATA(userId) {
    return Book.find({ wishingList: { $elemMatch: { $eq: userId } } }).lean()
}

async function addUserToItem(bookId, userId) {
    const existing = await Book.findById(bookId)
    existing.wishingList.push(userId)

    return existing.save()
}


//TODO When ready to delete unnecessary 

module.exports = {
    getAll,
    createAd,
    getById,
    editById,
    deleteById,
    buyCrypto,
    searchRefDATA,
    addUserToItem
}
//TODO When ready to delete unnecessary 