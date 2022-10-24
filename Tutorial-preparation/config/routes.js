const authController = require("../controllers/authController");
const courseController = require("../controllers/courseController");
const homeController = require("../controllers/homeController");
const { hasUser} = require("../middlewares/guard");

module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/course',hasUser() , courseController);
    


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