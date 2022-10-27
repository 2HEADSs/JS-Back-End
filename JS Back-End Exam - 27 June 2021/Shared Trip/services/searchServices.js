// async function getAllBySearch(search, payment) {
//     console.log('----------------');

//     console.log(search);


//     const searchResult = new RegExp(search, 'i');
//     const paymentResult = new RegExp(payment, 'i');

//     if (search && payment) {
//         return Crypto.find().and([{ 'name': { $regex: searchResult } }, { 'paymentMethod': { $regex: paymentResult } }]).lean();
//     } else if (!search && payment) {
//         console.log('!search && payment');
//         return Crypto.find({ 'paymentMethod': { $regex: paymentResult } }).lean();
//     }
//     else {

//         return Crypto.find({}).lean();
//     }
// }


// const Crypto = require('../models/Crypto');


// async function getBySearch(cryptoName, paymentMethod) {
//     return await Crypto.find({ name: { $regex: cryptoName, $options: 'i' }, payment: { $regex: paymentMethod, $options: 'i' } }).lean()
// }


// module.exports = getBySearch