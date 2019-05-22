const jwt = require("jsonwebtoken");
const handleRes = require("../tools/handleRes");

module.exports = function(req, res, next) {
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                handleRes(res, 401, {success: false, message: "Invalid credentials"});
            }    
            if (!err) {
                req.decodedJwt = decodedToken;
                next();
            }
        });
    }
    if (!token) {
        handleRes(res, 401, {success: false, message: "Invalid credentials"});
    }
}
