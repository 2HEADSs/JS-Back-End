const { Schema, model } = require('mongoose');


const regex = /^([a-zA-Z0-9]+\s[a-zA-Z0-9]+)$/i
//TODO add User properties and validation according to assignment
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minlength: [3, 'First name must be at least 3 characters long!'],
        match: [regex, 'Use something like: "Ivan Petrov"']
    },
    username: { type: String, required: true, minlength: [5, 'Username must be at least 5 characters long!'] },
    hashedPassword: { type: String, required: true }
});


//index is not required; strength:2 - to be case insensitive 
userSchema.index({ username: 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
})

const User = model('User', userSchema);

module.exports = User