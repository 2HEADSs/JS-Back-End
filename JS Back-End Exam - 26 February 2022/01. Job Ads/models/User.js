const { Schema, model, Types } = require('mongoose');


const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    description: {
        type: String, required: true, maxlength: [40, 'Description must be maximum 40 characters long!']
    },
    personalAds: {
        type: [Types.ObjectId], ref: 'Adds', default: []
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