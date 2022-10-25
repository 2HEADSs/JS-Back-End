const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'q982hdeoaus0ajaa'

//TODO USERNAME, EMAIL, BOTH
async function register(username, email, password) {
    //check if username is already exist

    //collation to search case insensitive
    //TODO check what to upload in token. find username or email
    const existingUserName = await User.findOne({ username }).collation({ locale: 'en', strength: 2 });
    const existingEmailName = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });
    if (existingUserName || existingEmailName) {
        throw new Error('Username is already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    //to check what to upload

    const user = await User.create({
        username,
        email,
        hashedPassword
    });

    //TODO see assignment if registration creates user session or must render login    

    return createSession(user)
}

async function login(username, password) {
    const user = await User.findOne({ username }).collation({ locale: 'en', strength: 2 });
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
function createSession({ _id, username, email }) {
    const payload = {
        _id,
        username,
        email
        //TODO SEE IF EXPIRES TIME FOR TOKEN
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