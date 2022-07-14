'use strict';
const db = require('../models');

exports.add_picture = async (req, res) => {
    const {img_src, pic_id, sol, earth_date, camera} = req.body;
    const email = req.session.user.email;
    const [pic, created] = await db.MarsImage.findOrCreate({
        where: {
            'email': email,
            'img_src': img_src,
            'pic_id': pic_id,
            'sol': sol,
            'earth_date': earth_date,
            'camera': camera
        }
    })
    res.status(created ? 201 : 226).end();
}

exports.get_pictures = async (req, res) => {
    const email = req.session.user.email;

    return db.MarsImage.findAll({
        where: {"email": email}
    })
        .then((pictures) => res.json(pictures))
        .catch((err) => {

            return res.status(400).send(err);
        })
}

exports.remove_picture = async (req, res) => {
    const pic_id = req.params.pic_id;
    const email = req.session.user.email;

    return db.MarsImage.findOne({
        where: {"pic_id": pic_id, "email": email,}
    })
        .then((pic) => {
            pic.destroy();
            res.status(200).end()
        })
        .catch((err) => {
            res.status(400).send(err);
        })
}
