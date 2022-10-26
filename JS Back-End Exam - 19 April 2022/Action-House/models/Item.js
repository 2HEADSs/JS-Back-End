const { Schema, model, Types } = require('mongoose');

const URL_PATTERN = /https?:\/\/./i

//TODO add User properties and validation according to assignment
//TODO change name of second model-data-base
const itemSchema = new Schema({
    title: { type: String, required: true, minlength: [4, 'Title must be at least 4 characters long!'] },
    description: { type: String, required: true, maxLength: [200, 'Description must be maximum 200 characters long!'] },
    category: {
        type: String,
        required: true,
        enum: ['estate', 'vehicles', 'furniture', 'electronics', 'other'],
    },
    imageUrl: {
        type: String,
        validate: {
            validator: (value) => URL_PATTERN.test(value),
            message: 'Invalid URL, must start with HTTP/HTTPS'
        }
    },
    price: { type: Number, required: true, min: [0, 'Price must be positive number!'] },
    owner: {
        type: Types.ObjectId, ref: 'User'
    },
    bidders: {
        type: [Types.ObjectId], ref: 'User', default: []
    },
});


itemSchema.path('category').required(true, 'This category is not allowed!')


const Item = model('Item', itemSchema);

module.exports = Item