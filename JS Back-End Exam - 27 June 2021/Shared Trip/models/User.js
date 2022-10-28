const { Schema, model, Types } = require('mongoose');


//TODO add User properties and validation according to assignment
const userSchema = new Schema({
    email: { type: String, required: true, unique: true, },
    gender: { type: String, required: true, },
    tripHistory: {
        type: [Types.ObjectId], ref: 'Trip', default: []
    },
    hashedPassword: { type: String, required: true }
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