const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'q982hdeoaus0ajaa'

async function register(email, firstName, lastName, password) {
    //check if username is already exist

    //collation to search case insensitive
    const existingEmail = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });
    const existingFirstName = await User.findOne({ firstName }).collation({ locale: 'en', strength: 2 });
    const existingLastName = await User.findOne({ lastName }).collation({ locale: 'en', strength: 2 });
    if (existingEmail || existingFirstName || existingLastName) {
        throw new Error('Username is already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        firstName,
        lastName,
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
function createSession({ _id, email, firstName, lastName }) {
    const payload = {
        _id,
        email,
        firstName,
        lastName
    }

    //return token
    return jwt.sign(payload, JWT_SECRET);


}

function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = {
    register,
    login,
    verifyToken
}