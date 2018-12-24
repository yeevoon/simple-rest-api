"use strict";
const errorMsg = require('./messages')

module.exports = (req, res, next) => {

    req.checkBody('firstName')
        .trim()
        .isAlpha().withMessage('First name can only be in letters.')
		.isLength({max: 250}).withMessage('Maximum 250 characters allowed.')
		.isLength({min:1}).withMessage("First Name is required.")
        .exists().withMessage("Request was missing the 'first_name' parameter.");

    req.checkBody('lastName')
        .trim()
        .isAlpha().withMessage('Last name can only be in letters.')
		.isLength({max: 250}).withMessage('Maximum 250 characters allowed.')
		.isLength({min:1}).withMessage("Last Name is required.")
        .exists().withMessage("Request was missing the 'last_name' parameter.");

    req.checkBody('email')
        .trim()
        .isEmail().withMessage("Email is invalid")
        .isLength({min:1}).withMessage("Email is required")
        .exists().withMessage("Request was missing the 'email' parameter.");

    req.checkBody('password')
        .trim()
        .isLength({min:5}).withMessage("Invalid password.")
        .exists().withMessage("Request was missing the 'password' parameter.");

    try{

        req.asyncValidationErrors().then(() => {

            next();

        }).catch(errors => {

            const param_errors = {}

            errors.forEach(error => {
                param_errors[error.param] = error.msg;
            });

            const response = Object.assign({}, errorMsg.validation_failed);
            response['errors'] = param_errors;

            res.status(400).send(response);
        });

    }catch(err){
        res.status(500).json(errorMsg.internal);
    }    
}


