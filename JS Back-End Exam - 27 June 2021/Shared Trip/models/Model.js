const { Schema, model, Types } = require('mongoose');

const URL_PATTERN = /https?:\/\/./i

const tripSchema = new Schema({
    startPoint: { type: String, required: true, minlength: [4, 'Start point must be at least 4 characters long!'] },
    endPoint: { type: String, required: true, minlength: [4, 'End point must be at least 4 characters long!'] },
    date: { type: String, required: true, },
    time: { type: String, required: true, },
    carImage: {
        type: String, validate: {
            validator: (value) => URL_PATTERN.test(value),
            message: 'Invalid URL, must start with HTTP/HTTPS'
        }
    },
    carBrand: { type: String, required: true, minlength: [4, 'Title must be at least 4 characters long!'] },
    seats: { type: Number, required: true, min: [0, 'Seats must be positive number!'], max: [4, 'Seats can not be more than 4!'] },
    price: { type: Number, required: true, min: [1, 'Price must be minimum 1!'], max: [50, 'Price can not be more than 50!'] },
    description: { type: String, required: true, minlength: [10, 'Description must be at least 10 characters long!'] },
    buddies: {
        type: [Types.ObjectId], ref: 'User', default: []
    },
    creator: {
        type: Types.ObjectId, ref: 'User'
    },
});



const Trip = model('Trip', tripSchema);

module.exports = Trip