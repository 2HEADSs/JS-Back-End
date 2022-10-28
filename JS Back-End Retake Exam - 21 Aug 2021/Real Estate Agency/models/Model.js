const { Schema, model, Types } = require('mongoose');

const URL_PATTERN = /https?:\/\/./i

const itemSchema = new Schema({
    name: { type: String, required: true, minlength: [6, 'Name must be at least 6 characters long!'] },
    type: {
        type: String,
        required: true,
        enum: {
            values: ['Apartment', 'Villa', 'House'],
            message: 'This type is not allowed'
        }
    },
    year: { type: Number, required: true, min: [1850, 'Year must be minimum 1850!'], max: [2021, 'Estate can not be from future!'] },
    city: { type: String, required: true, minlength: [4, 'City must be at least 4 characters long!'] },
    homeImage: {
        type: String, required: true, validate: {
            validator: (value) => URL_PATTERN.test(value),
            message: 'Invalid URL, must start with HTTP/HTTPS'
        }
    },
    description: { type: String, required: true, maxlength: [60, 'Description must be maximum 60 characters long!'] },
    availablePieces: { type: Number, required: true, min: [0, 'Pieces must be positive number!'], max: [50, 'Pieces can not be more than 10!'] },
    renters: {
        type: [Types.ObjectId], ref: 'User', default: []
    },
    owner: {
        type: Types.ObjectId, ref: 'User'
    },
});



const Estate = model('Estate', itemSchema);

module.exports = Estate