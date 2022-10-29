
const Item = require('../models/Model');
const User = require('../models/User')


async function getAll() {
    return Item.find({}).lean()
}

async function createPost(crypto) {
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
    existing.name = data.name
    existing.imageUrl = data.imageUrl
    existing.price = data.price
    existing.description = data.description
    existing.payment = data.payment

    return existing.save()
}

async function buyCrypto(cryptoId, userId) {
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

async function updateUser(userId, postId) {

    const existing = await User.findById(userId)
    existing.posts.push(postId)

    return existing.save()
}


//TODO When ready to delete unnecessary 

module.exports = {
    getAll,
    createPost,
    getById,
    editById,
    deleteById,
    buyCrypto,
    searchRefDATA,
    addUserToItem,
    updateUser
}
//TODO When ready to delete unnecessary 