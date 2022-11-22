const express = require('express');
const { mongoose } = require('mongoose');
const authController = require('./controllers/authController');
const dataController = require('./controllers/dataController');
const cors = require('./middlewares/cors');
const trimBody = require('./middlewares/trimBody');


const connectionString = 'mongodb://127.0.0.1:27017/furniture';


start();
async function start() {
    mongoose.connect(connectionString)
    const app = express();

    app.use(express.json());
    app.use(cors());
    app.use(trimBody());

    app.get('/', (req, res) => {
        res.json({ message: 'Rest Service Operational' })
    });


    app.use('/users', authController)
    app.use('/data/catalog', dataController)

    app.listen('3030', () => console.log('REST service started at 3030'));
}
