const { Schema, model } = require('mongoose');


//TODO add User properties and validation according to assignment
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z0-9]+$/i, 'Username may contain only english letters and numbers']
    },
    hashedPassword: { type: String, required: true }
});


//index is not required; strength:2 - to be case insensitive 
userSchema.index({ username: 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
})

userSchema.index({ email: 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
})

const User = model('User', userSchema);

module.exports = User