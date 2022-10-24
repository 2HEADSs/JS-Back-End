const authController = require("../controllers/authController");
const cryptoController = require("../controllers/cryptoController");
const homeController = require("../controllers/homeController");
const searchController = require("../controllers/searchController");

module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/crypto', cryptoController)
    app.use('/search', searchController)
    app.use('*', (req,res)=> {
        res.render('404')   
    })


}
