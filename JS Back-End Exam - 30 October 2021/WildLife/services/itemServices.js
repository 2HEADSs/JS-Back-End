
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

async function getByIdWithAllData(id) {
    return Item.findById(id).populate('author').populate('votes').lean()
}

async function deleteById(id) {
    return Item.findByIdAndDelete(id)
}


async function editById(id, data) {
    const existing = await Item.findById(id);
    existing.title = data.title
    existing.keyword = data.keyword
    existing.location = data.location
    existing.description = data.description
    existing.date = data.date
    existing.imageUrl = data.imageUrl
    existing.description = data.description
    
    
    return existing.save()
}

async function upVote(postId, userId) {
    const existing = await Item.findById(postId)
    existing.votes.push(userId);
    existing.raiting++
    return existing.save()
}
async function downVote(postId, userId) {
    const existing = await Item.findById(postId)
    existing.votes.push(userId);
    existing.raiting--
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

async function getByUserCreate(userId) {
    return Item.find({ author: userId }).populate('author').lean()
}

//TODO When ready to delete unnecessary 

module.exports = {
    getAll,
    createPost,
    getById,
    editById,
    deleteById,
    upVote,
    searchRefDATA,
    addUserToItem,
    updateUser,
    getByIdWithAllData,
    downVote,
    getByUserCreate
}
//TODO When ready to delete unnecessary 