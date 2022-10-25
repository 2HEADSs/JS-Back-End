//TO CHANGE WITH REAL ASSINGMENT


        //check if all fields are fulfilled
// if (Object.values(req.body).some(x => !x)) {
//     throw new Error('All fields are required!')
// }

const catalogController = require('express').Router()

//TODO replace with real controller by assignment
catalogController.get('/', (req, res) => {
    res.render('catalog', {
        //title is not nessaccery I made the templete with {{title}}
        title: 'Auction House',
        user: req.user
    })
})


module.exports = catalogController