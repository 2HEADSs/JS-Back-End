const { Schema, model, Types } = require('mongoose');

const URL_PATTERN = /https?:\/\/./i

//TODO add User properties and validation according to assignment
//TODO change name of second model-data-base
const itemSchema = new Schema({
    name: { type: String, required: true, minlength: [2, 'Title must be at least 2 characters long!'] },
    price: { type: Number, required: true, min: [0, 'Price must be positive number!'] },
    imageUrl: {
        type: String,
        validate: {
            validator: (value) => URL_PATTERN.test(value),
            message: 'Invalid URL, must start with HTTP/HTTPS'
        }
    },
    description: { type: String, required: true, minlength: [10, 'Description must be at least 10 characters long!'] },
    payment: {
        type: String,
        required: true,
        enum: ['crypto-wallet', 'credit-card', 'debit-card', 'paypal'],
        // minValue: 1,
        // maxValue: 5,
    },
    buyer: {
        type: [Types.ObjectId], ref: 'User', default: []
    },
    owner: {
        type: Types.ObjectId, ref: 'User'
    },
});


itemSchema.path('payment').required(true, 'This payment is not allowed!')


const Item = model('Crypto', itemSchema);

module.exports = Item