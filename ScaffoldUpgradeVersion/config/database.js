const mongoose = require('mongoose')
const connectionsString = require('../connectionString')
//TODO change database according to assignment
const CONNECTION_STRING = connectionsString || 'mongodb://localhost:27017/examDataBase'


///async because we will use database
module.exports = async (app) => {
    try {
        await mongoose.connect(CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        //TODO change conected on
        console.log('Database connected on sceletonWithKostadinow');
    } catch (error) {
        console.error(error.message);
        //procces.exit(1) - stop application
        process.exit(1)
    }

}