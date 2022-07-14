'use strict'
const fs = require('fs');
const path = require('path');
const db = require("../models");

module.exports = {
    TrimValues(values) {
        values.forEach((value) => value.trim())
    },
    isValuesEmpty(values) {
        return values.every((str) => {
            return str.length !== 0;
        })
    },
    async isEmailValid(str) {
        const v1 = /^[^A-Z]+([\.-]?[^A-Z]+)*@[^A-Z]+([\.-]?[^A-Z]+)*(\.[^A-Z]{2,3})+$/.test(str);
        const user = await db.User.findOne({where: {"email": str}});
        const v2 = user === null;
        return v1 && v2;
    },
    isNamesValid(values) {
        return values.every((str) => {
            return /^[A-Z][a-z]*$/.test(str);
        })
    },
    isValidPassword(str) {
        return str.length >= 8;
    },
    isPasswordsMatch(str1, str2) {
        return str1 === str2;
    }
}