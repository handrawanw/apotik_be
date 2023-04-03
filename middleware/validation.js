const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            code: 400,
            message: "Invalid requests",
            errors: errors.array()
        });
    } else {
        next();
    }
}