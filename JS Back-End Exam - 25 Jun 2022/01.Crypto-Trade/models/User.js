const { Schema, model } = require('mongoose');


//TODO add User properties and validation according to assignment
const userSchema = new Schema({
    username: { type: String, required: true, unique: true, minlength: [3, 'Username must be at least 3 characters long!'] },
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