const { Schema, model, Types } = require('mongoose');

const URL_PATTERN = /https?:\/\/./i
//TODO add User properties and validation according to assignment
const bookSchema = new Schema({
    title: { type: String, required: true, minlength: [2, 'Title must be at least 2 characters long!'] },
    author: { type: String, required: true, minlength: [5, 'Author must be at least 2 characters long!'] },
    imageUrl: {
        type: String,
        validate: {
            validator: (value) => URL_PATTERN.test(value),
            message: 'Invalid URL, must start with HTTP/HTTPS'
        }
    },
    genre: {
        type: String, required: true, minlength: [3, 'Genre must be at least 2 characters long!']
    },
    review: { type: String, required: true, minlength: [10, 'Review must be at least 10 characters long!'] },
    stars: {
        type: Number,
        required: true,
        enum: [1, 2, 3, 4, 5]
        // minValue: 1,
        // maxValue: 5,
    },
    wishingList: {
        type: [Types.ObjectId], ref: 'User', default: []
    },
    owner: {
        type: Types.ObjectId, ref: 'User'
    },
});


//index is not required; strength:2 - to be case insensitive 


const Book = model('Book', bookSchema);

module.exports = Book