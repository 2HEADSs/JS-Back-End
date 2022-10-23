const mongoose = require('mongoose')

//need to set connection string 
const CONNECTION_STRING =  require('../connectionString')


///async because we will use database
module.exports = async (app) => {
    try {
        await mongoose.connect(CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Database connected on book-talk');
    } catch (error) {
        console.error(error.message);
        //procces.exit(1) - stop application
        process.exit(1)
    }

}