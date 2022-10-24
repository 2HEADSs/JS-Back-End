const authController = require("../controllers/authController")
const homeController = require("../controllers/homeController");
const hotelController = require("../controllers/hotelController");
const profileController = require("../controllers/profileController");
const { hasUser } = require("../middlewares/guard");

module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    //has user will check if there is no user will escape this route('/hotel')
    app.use('/hotel',hasUser(),  hotelController);
    app.use('/profile', profileController)
    


}



// //make error handler
// app.get('/error', (rq, res, next) => { 
//     next(new Error('propagating error'))
                //one of two 
// throw new Error('propagating error')
// })
// app.use((err, req, res, next) => {
//     console.log('Global error handling');
//     console.log(err.message);
//     res.redirect('/')
// })