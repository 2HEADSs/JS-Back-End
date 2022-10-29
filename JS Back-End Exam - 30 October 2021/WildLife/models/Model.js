const { Schema, model, Types } = require('mongoose');

const URL_PATTERN = /https?:\/\/./i


const itemSchema = new Schema({
    title: { type: String, required: true, minlength: [6, 'Title must be at least 6 characters long!'] },
    keyword: { type: String, required: true, minlength: [6, 'Keyword must be at least 6 characters long!'] },
    location: { type: String, required: true, maxLength: [15, 'Location must be maximum 15 characters long!'] },
    date: { type: String, required: true, minlength: [10, 'Date must be exact 10 characters long!'],maxLength: [10, 'Date must be exact 10 characters long!'] },
    imageUrl: {
        type: String,
        validate: {
            validator: (value) => URL_PATTERN.test(value),
            message: 'Invalid URL, must start with HTTP/HTTPS'
        }
    },
    description: { type: String, required: true, minlength: [8, 'Description must be at least 8 characters long!'] },
    author: {
        type: Types.ObjectId, ref: 'User'
    },
    votes: {
        type: [Types.ObjectId], ref: 'User', default: []
    },
    raiting: { type: Number, required: true, default: 0 },
});


// itemSchema.path('payment').required(true, 'This payment is not allowed!')


const Item = model('Post', itemSchema);

module.exports = Item