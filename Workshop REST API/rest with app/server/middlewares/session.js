const { parseToken } = require("../services/userService");
const { parseError } = require("../util/parser");

module.exports = () => ((req, res, next) => {
    const token = req.headers['x-authorization'];

    if (token) {
        try {
            const payload = parseToken(token); 
        } catch (error) {
            parseError(error)
        }
    }
})