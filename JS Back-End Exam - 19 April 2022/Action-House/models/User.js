const { Schema, model } = require('mongoose');

const EMAIL_PATTERN = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-z]+$/i
//TODO add User properties and validation according to assignment
const userSchema = new Schema({
    email: {
        type: String, required: true, unique: true, validate: {
            validator: function (data) {
                return EMAIL_PATTERN.test(data)
            },
            message: 'Email isn\'t valid!'
        }
    },
    firstName: {
        type: String, required: true, unique: true, minlength: [1, 'First Name must be at least 1 characters long!']
    },
    lastName: {
        type: String, required: true, unique: true, minlength: [1, 'Last Name must be at least 1 characters long!']
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

const User = model('User', userSchema);

module.exports = User