const express = require('express');
const router = express.Router();
const db = require('../models');
const validator = require('../modules/validators');


/* GET home page. */
router.get('/', function (req, res) {
    if (req.session.user) {
        const {firstName, lastName} = req.session.user;
        res.render('portal', {
            "firstName": firstName,
            "lastName": lastName
        });
    } else {
        res.render('login', {title: 'login page'});
    }
})


router.post('/login', function (req, res) {
    let {email, password} = req.body;
    validator.TrimValues([email, password]);
    email = email.toLowerCase();
    db.User.findOne({where: {"email": email}})
        .then(async function (user) {
            if (user && await user.validPassword(password)) {
                req.session.user = user.dataValues;
                res.redirect('/');
            } else {
                res.status(400);
                res.end();
            }
        })
        .catch((err) => {

            return res.status(400).send(err);
        });
})

router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            res.status(400);
        } else {
            res.redirect('/');
        }
    });
});


router.get('/findall', (req, res) => {
    return db.User.findAll()
        .then((alldata) => {
            res.send(alldata)
        })
        .catch((err) => {
            return res.send({message: err})
        });
});

router.get('/findImages', (req, res) => {
    return db.MarsImage.findAll()
        .then((alldata) => {
            res.send(alldata)
        })
        .catch((err) => {

            return res.send({message: err})
        });
});

module.exports = router;
