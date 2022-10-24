const { Schema, model, Types } = require('mongoose');

const URL_PATTEERN = /^https?:\/\/.+$/i;


//TODO add User properties and validation according to assignment
const hotelSchema = new Schema({
    name: { type: String, required: true, unique: true, minlenght: [4, 'Hotel name must be at least 4 characters long'] },
    city: { type: String, required: true, minlenght: [3, 'City name must be at least 3 characters long'] },
    imageUrl: {
        type: String, required: true, validate: {
            validator: (value) => URL_PATTEERN.test(value),
            message: 'Image URL is not validate'
        }
    },
    rooms: {
        type: String, required: true,
        min: [1, 'Rooms must be between 1 and 100'], max: [100, 'Rooms must be between 1 and 100']
    },
    bookings: { type: [Types.ObjectId], ref: 'User', default: [] },
    owner: { type: Types.ObjectId, ref: 'User', required: true },

});

hotelSchema.index({ name: 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
})


const Hotel = model('Hotel', hotelSchema);

module.exports = Hotel