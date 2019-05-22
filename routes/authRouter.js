const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const handleRes = require("./tools/handleRes");

const Users = require("./model")("users");

router.post("/login", async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await Users.findBy({username});
        if (
            username && bcrypt.compareSync(
                password, 
                user.password
            )
        ) {

                const token = generateToken(user);
                handleRes(
                    res, 
                    200, 
                    {success: true}
                );
        }
        if (
            !username || !bcrypt.compareSync(
                    password,
                    user.password    
            )
        ) {
                handleRes(
                    res, 
                    401, 
                    {message: "Invalid Credentials"}
                );
        }
    } catch (error) {
        handleRes(res, 500, error);
    }
});

function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
        department: user.department
    };

    const options = {
        expiresIn: "1d"
    };

    return jwt.sign(payload, process.env.JWT_SECRET, options);
}

router.post("/registration", async (req, res) => {
    let user = req.body;
    
    // generate a hash from the user's password
    const hash = bcrypt.hashSync(user.password, 10);

    // overwrite the user.password with our hash
    user.password = hash;
    try {
        const saved = await Users.add(user);
        if (saved) {
            await handleRes(res, 200, {success: true})
        }
    } catch (error) {
        handleRes(res, 500, error)
    }
    
});

router.get("/logout", async (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if(err) {
                res.send("There was an error logging out.")
            }
            if (!err) {
                res.send("You have been logged out")
            }
        })
    }
    if(!req.session) {
        console.log("There was no session")
        res.end();
    }
});

module.exports = router;
