
const Trip = require('../models/Model');


async function getAll() {
    return Trip.find({}).lean()
}

async function createTrip(trip) {
    return Trip.create(trip)
}

async function getByIdWithOwnerAndBuddies(id) {
    return Trip.findById(id).populate('owner').populate('buddies').lean()
}
async function getById(id) {
    return Trip.findById(id).lean()
}

async function deleteById(id) {
    return Trip.findByIdAndDelete(id)
}

async function editById(id, data) {
    const existing = await Trip.findById(id);
    existing.startPoint = data.startPoint,
        existing.endPoint = data.endPoint,
        existing.date = data.date,
        existing.time = data.time,
        existing.carImage = data.carImage,
        existing.carBrand = data.carBrand,
        existing.seats = data.seats,
        existing.price = data.price,
        existing.description = data.description


    return existing.save()
}
async function editSeats(id) {
    const existing = await Trip.findById(id);
    existing.seats--
    return existing.save()

}

async function joinTrip(tripId, userId) {
    const existing = await Trip.findById(tripId)
    existing.buddies.push(userId);
    return existing.save()
}

//TODO check
async function searchRefDATA(userId) {
    return Book.find({ wishingList: { $elemMatch: { $eq: userId } } }).lean()
}

// async function addUserToTrip(bookId, userId) {
//     const existing = await Book.findById(bookId)
//     existing.wishingList.push(userId)

//     return existing.save()
// }


//TODO When ready to delete unnecessary 

module.exports = {
    getAll,
    createTrip,
    getById,
    editById,
    deleteById,
    joinTrip,
    searchRefDATA,
    editSeats,
    getByIdWithOwnerAndBuddies
}
//TODO When ready to delete unnecessary 