//middleware for trimming username and password 

///we can choose not to trim certain word
module.exports = (...excludedKeys) => (req, res, next) => {
    if (req.body) {
        for (let key in req.body) {
            if (excludedKeys.includes(key) == false) {

                req.body[key] = req.body[key].trim()
            }
        }
    };

    next()
}