const db = require('../models');

exports.email_exists = async (req, res) => {
    const email = req.body.email;
    return db.User.findOne({where: {email: email}})
        .then(exist => {
            res.send({"exist": !!exist})
            res.end();
        }).catch((err) => {

            return res.status(400).send(err)
        });
}

exports.user_exists = async (req, res) => {
    const {email, password} = req.body;
    return db.User.findOne({where: {"email": email}})
        .then(async function (user) {
            if (user && await user.validPassword(password)) {
                res.send({"exist": true});
                res.end();
            } else {
                res.send({"exist": false});
                res.end();
            }
        })
        .catch((err) => {

            return res.status(400).send(err);
        });
}