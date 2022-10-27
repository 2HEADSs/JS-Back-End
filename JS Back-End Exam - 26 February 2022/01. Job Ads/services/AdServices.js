const Ad = require('../models/Ad');


async function getAll() {
    return Ad.find({}).lean()
}

async function createAd(crypto) {
    return Ad.create(crypto)
}

async function getById(id) {
    return Ad.findById(id).populate('owner').lean()
}

async function deleteById(id) {
    return Ad.findByIdAndDelete(id)
}

async function editById(id, data) {
    const existing = await Ad.findById(id);
    existing.headline = data.headline
    existing.location = data.location
    existing.companyName = data.companyName
    existing.companyDescription = data.companyDescription
    return existing.save()
}

async function applyForJob(adId, userId) {
    const existing = await Ad.findById(adId)
    existing.applied.push(userId);
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

async function getOneWithCandidates(adId) {
    return Ad.findById(adId).populate('applied').lean()

}

//TODO When ready to delete unnecessary 

module.exports = {
    getAll,
    createAd,
    getById,
    editById,
    deleteById,
    applyForJob,
    searchRefDATA,
    addUserToItem,
    getOneWithCandidates,
}
//TODO When ready to delete unnecessary 