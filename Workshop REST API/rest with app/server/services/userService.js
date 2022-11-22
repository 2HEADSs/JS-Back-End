const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/User');

const secret = 'q-asdaadfas12321kl'

async function register(email, password) {
    const existing = User.findOne({ email }).collation({ locale: 'en', strength: 2 });
    if (existing) {
        throw new Error('Email is taken')
    }

    const user = await User.create({
        email,
        hashedPassword: bcrypt.hash(password, 10)
    });

    return {
        _id: user._id,
        email: user.email,
        accessToken: createToken(user)
    }
};

async function login(email, password) {

};

async function logout(email, password) {

};

function createToken(user) {
    const payload = {
        _id: user._id,
        email: user.email
    };
    return jwt.sign(payload, secret)
}

function parseToken(token) {

};


module.exports = {
    register,
    login,
    logout,
    parseToken
}