const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'q982hdeoaus0ajaa'

async function register(username, password) {
    
    //check if username is already exist
    //collation to search case insensitive
    const existing = await User.findOne({ username }).collation({ locale: 'en', strength: 2 });
    if (existing) {
        throw new Error('Username is already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        hashedPassword
    });

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
function createSession({ _id, username }) {
    const payload = {
        _id,
        username
        // SEE IF EXPIRES TIME FOR TOKEN
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