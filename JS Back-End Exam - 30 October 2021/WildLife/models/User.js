const { Schema, model, Types } = require('mongoose');

const namePattern = /^[a-zA-Z0-9]+$/i
//TODO add User properties and validation according to assignment
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minlength: [3, 'First name must be at least 3 characters long!'],
        match: [namePattern, 'First name may contain only english letters and numbers']
    },
    lastName: { 
        type: String, 
        required: true, 
        minlength: [5, 'last Name must be at least 5 characters long!'],
        match: [namePattern, 'Last name may contain only english letters and numbers']
        
    },
    email: { type: String, required: true, },
    hashedPassword: { type: String, required: true },
    posts: { type: [Types.ObjectId], ref: 'User', default: [] },

});


//index is not required; strength:2 - to be case insensitive 
userSchema.index({ email: 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
})

const User = model('User', userSchema);

module.exports = User