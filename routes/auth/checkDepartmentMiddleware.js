module.exports = department => {
    return (req, res, next) => {
        if (req.decodedJwt.department && req.decodedJwt.department === department) {
            next();
        }
        if (!req.decodedJwt.department || req.decodedJwt.department !== department) {
            res.status(403).json({success: false, message: "Invalid credentials"});
        }
    }
}
