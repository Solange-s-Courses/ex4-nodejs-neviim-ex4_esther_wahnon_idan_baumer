'use strict';

const express = require('express');
const router = express.Router();
const db = require('../models');
const Cookies = require("cookies");
const keys = ['keyboard cat']; // ask solange about that
const validator = require("../modules/validators")

router.use(function (req, res, next) {
    if (req.session.user) {
        res.redirect('/');
    } else {
        const cookies = new Cookies(req, res, {keys: keys});
        const lastVisit = cookies.get('lastVisit', {signed: true});
        if (lastVisit)
            return next();
        else {
            cookies.set('lastVisit', new Date().toISOString(), {signed: true, maxAge: 60 * 1000});
            res.redirect('/register');
        }
    }
})

router.get('/', function (req, res) {
    res.render('register', {title: 'Register'});
});

router.post('/', function (req, res) {
    const {email, firstName, lastName} = req.session;
    req.session = null;
    let {password, password2} = req.body;
    validator.TrimValues([password, password2]);
    const v1 = validator.isPasswordsMatch(password, password2);
    const v2 = validator.isValidPassword(password);
    const v3 = validator.isPasswordsMatch(password, password2);
    const v = v1 && v2 && v3;
    if (!v) {
        res.sendStatus(401);
        res.end();
    }
    return db.User.create({email, firstName, lastName, password})
        .then(() => res.redirect('/'))
        .catch((err) => {
            return res.status(400).send(err)
        })
})

router.post('/choose_password', async function (req, res, next) {
    let {email, firstName, lastName} = req.body;
    validator.TrimValues([email, firstName, lastName]);
    email = email.toLowerCase();
    const v1 = validator.isValuesEmpty([email, firstName, lastName]);
    const v2 = await validator.isEmailValid(email);
    const v3 = validator.isNamesValid([firstName, lastName]);
    const v = v1 && v2 && v3;
    if (!v) {
        res.sendStatus(401);
        res.end();
    }
    req.session.email = email;
    req.session.firstName = firstName;
    req.session.lastName = lastName;
    res.render('choose_password', {title: 'Password'});
});


module.exports = router;