const { Schema, model, Types } = require('mongoose');

const itemSchema = new Schema({
    headline: { type: String, required: true, minlength: [4, 'Headline must be at least 4 characters long!'] },
    location: { type: String, required: true, minlength: [8, 'Location must be at least 4 characters long!'] },
    companyName: { type: String, required: true, minlength: [3, 'Company name must be at least 3 characters long!'] },
    companyDescription: { type: String, required: true, maxlength: [40, 'Company description must be maximum 40 characters long!'] },
    applied: { type: [Types.ObjectId], ref: 'User', default: [] },
    owner: { type: Types.ObjectId, ref: 'User' },
});



const Ad = model('Adds', itemSchema);

module.exports = Ad