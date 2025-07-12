"use strict";
/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCaptcha = exports.captchas = void 0;
const captcha_1 = require("../models/captcha");
function captchas() {
    return async (req, res) => {
        const captchaId = req.app.locals.captchaId++;
        const operators = ['*', '+', '-'];
        const firstTerm = Math.floor((Math.random() * 10) + 1);
        const secondTerm = Math.floor((Math.random() * 10) + 1);
        const thirdTerm = Math.floor((Math.random() * 10) + 1);
        const firstOperator = operators[Math.floor((Math.random() * 3))];
        const secondOperator = operators[Math.floor((Math.random() * 3))];
        const expression = firstTerm.toString() + firstOperator + secondTerm.toString() + secondOperator + thirdTerm.toString();
        const answer = eval(expression).toString(); // eslint-disable-line no-eval
        const captcha = {
            captchaId,
            captcha: expression,
            answer
        };
        const captchaInstance = captcha_1.CaptchaModel.build(captcha);
        await captchaInstance.save();
        res.json(captcha);
    };
}
exports.captchas = captchas;
const verifyCaptcha = () => (req, res, next) => {
    captcha_1.CaptchaModel.findOne({ where: { captchaId: req.body.captchaId } }).then((captcha) => {
        if ((captcha != null) && req.body.captcha === captcha.answer) {
            next();
        }
        else {
            res.status(401).send(res.__('Wrong answer to CAPTCHA. Please try again.'));
        }
    }).catch((error) => {
        next(error);
    });
};
exports.verifyCaptcha = verifyCaptcha;
//# sourceMappingURL=captcha.js.map