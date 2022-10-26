const mongoose = require('mongoose')
const connectionsString = require('../connectionString')
const CONNECTION_STRING = connectionsString || 'mongodb://localhost:27017/examDataBase'


///async because we will use database
module.exports = async (app) => {
    try {
        await mongoose.connect(CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Database connected on JOB_ADS');
    } catch (error) {
        console.error(error.message);
        //procces.exit(1) - stop application
        process.exit(1)
    }

}