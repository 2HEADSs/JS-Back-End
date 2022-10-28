
const Trip = require('../models/Model');


async function getAll() {
    return Trip.find({}).lean()
}

async function createCrypto(crypto) {
    return Trip.create(crypto)
}

async function getById(id) {
    return Trip.findById(id).lean()
}

async function deleteById(id) {
    return Trip.findByIdAndDelete(id)
}

async function editById(id, data) {
    const existing = await Trip.findById(id);
    existing.name = data.name
    existing.imageUrl = data.imageUrl
    existing.price = data.price
    existing.description = data.description
    existing.payment = data.payment

    return existing.save()
}

async function buyCrypto(cryptoId, userId) {
    const existing = await Trip.findById(cryptoId)
    existing.buyer.push(userId);
    return existing.save()
}

//TODO check
async function searchRefDATA(userId) {
    return Book.find({ wishingList: { $elemMatch: { $eq: userId } } }).lean()
}

async function addUserToTrip(bookId, userId) {
    const existing = await Book.findById(bookId)
    existing.wishingList.push(userId)

    return existing.save()
}


//TODO When ready to delete unnecessary 

module.exports = {
    getAll,
    createCrypto,
    getById,
    editById,
    deleteById,
    buyCrypto,
    searchRefDATA,
    addUserToItem: addUserToTrip
}
//TODO When ready to delete unnecessary 