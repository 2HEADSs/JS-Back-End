const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'q982hdeoaus0ajaa'

async function register(email, password, gender) {
    //check if username is already exist

    //collation to search case insensitive
    const existing = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });
    if (existing) {
        throw new Error('Username is already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        gender,
        hashedPassword
    });

    //TODO see assignment if registration creates user session or must render login    

    return createSession(user)
}

//check if username or email
async function login(email, password) {
    const user = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });
    if (!user) {
        throw new Error('Incorrect username or password!');
    }

    const hasMatch = await bcrypt.compare(password, user.hashedPassword)

    if (hasMatch == false) {
        throw new Error('Incorrect username or password!');
    }

    return createSession(user)

}

//method do sign(create) payload for cookie- will not be exports
//TODO check what to add to payload
function createSession({ _id, email, gender }) {
    const payload = {
        _id,
        email,
        gender
        //TODO SEE IF EXPIRES TIME FOR TOKEN
    }
    //return token
    return jwt.sign(payload, JWT_SECRET);


}

function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

async function updateUser(id, data) {
    const existing = await User.findById(id);
    existing.tripHistory.push(data)
    return existing.save()
}

async function getUserWithTrips(id) {
    return await User.findById(id).populate('tripHistory').lean()
}
module.exports = {
    register,
    login,
    verifyToken,
    updateUser,
    getUserWithTrips
}