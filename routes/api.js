const path = require('path');
var express = require('express');
var router = express.Router();

const apiUserController = require('../controllers/user_api');
const apiMarsImageController = require('../controllers/mars_image_api');

router.use('/portal', function (req, res, next) {
    if (req.session.user) {
        return next();
    } else res.sendStatus(401);
})
router.post('/portal/add_pic', apiMarsImageController.add_picture);
router.get('/portal/get_pics', apiMarsImageController.get_pictures);
router.delete('/portal/remove_pic/:pic_id', apiMarsImageController.remove_picture);
router.use('/login', function (req, res, next) {
    if (!req.session.user) {
        return next();
    } else
        res.sendStatus(401);
})
router.post('/login/email', apiUserController.email_exists);
router.post('/login/user', apiUserController.user_exists);
module.exports = router;