const { verifyToken } = require("../services/userService");


module.exports = () => (req, res, next) => {
    const token = req.cookies.token
    if (token) {
        try {
            const userData = verifyToken(token);
            //take user from request
            req.user = userData;
            //add username property to response- everytime if there is username because
            //this is middleware
            res.locals.username = userData.username 
        } catch (error) {
            res.clearCookie('token');
            res.redirect('/auth/login');

            //return is necessary because catch will take error end will contoniue
            return;
        }
    }

    next()
}