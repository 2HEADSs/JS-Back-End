const Course = require("../models/Course");


async function getAllByDate(search) {
    const query = {}
    if (search) {
        query.title = new RegExp(search, 'i')
    } 
        // sort is automaticly , createdAt:1 - ascending(1,2,3....)
        return Course.find(query).sort({ createdAt: 1 }).lean()
    


}

async function getReacent() {
    return Course.find({}).sort({ userCount: -1 }).limit(3).lean()
}

async function createCourse(course) {
    return Course.create(course);
}

async function getById(id) {
    return Course.findById(id).lean()
}

async function deleteById(id) {
    return Course.findByIdAndDelete(id)
}

async function updateById(id, data) {
    const existing = await Course.findById(id);
    existing.title = data.title;
    existing.description = data.description;
    existing.imageUrl = data.imageUrl;
    existing.duration = data.duration;

    return existing.save();
}

async function enrollUser(courseId, userId) {
    const existing = await Course.findById(courseId);
    existing.users.push(userId);
    existing.userCount++;

    //return promise
    return existing.save();
}

module.exports = {
    getAllByDate,
    createCourse,
    getReacent,
    getById,
    deleteById,
    updateById,
    enrollUser
}