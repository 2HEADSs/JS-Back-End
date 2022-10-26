
const Item = require('../models/Item');
const User = require('../models/User');


async function getAll() {
    return Item.find({}).lean()
}

async function createItem(crypto) {
    return Item.create(crypto)
}

async function getById(id) {
    return Item.findById(id).lean()
}

async function deleteById(id) {
    return Item.findByIdAndDelete(id)
}

async function editById(id, data) {
    const existing = await Item.findById(id);
    existing.title = data.title
    existing.category = data.category
    existing.description = data.description
    existing.imageUrl = data.imageUrl
    existing.price = data.price

    return existing.save()
}

async function buyItem(cryptoId, userId) {
    const existing = await Item.findById(cryptoId)
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


async function getOwner(userId) {
    return User.findById(userId).lean()
}


async function bitById(id, data, userId) {
    const existing = await Item.findById(id);
    existing.price = Number(existing.price) + Number(data)
    existing.bidders.push(userId)

    return existing.save()
}

async function getBidderUser(id) {
    const user = await User.findById(id).lean()
    return user
}
//TODO When ready to delete unnecessary 

module.exports = {
    getAll,
    createItem,
    getById,
    editById,
    deleteById,
    buyItem,
    searchRefDATA,
    addUserToItem,
    getOwner,
    bitById,
    getBidderUser
}
//TODO When ready to delete unnecessary 