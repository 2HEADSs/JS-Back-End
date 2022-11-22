const express = require('express');
const { default: mongoose } = require('mongoose');
const cors = require('./middlewares/cors');

const connectionString = 'mongodb://127.0.0.1:27017/furniture2';


start();
async function start() {
    mongoose.connect(connectionString)
    const app = express();

    app.use(express.json());
    app.use(cors());


    app.get('/', (req, res) => {
        res.json({ message: 'Rest Service Operational' })
    });

    app.listen('3030', () => console.log('REST service started at 3030'));
}
