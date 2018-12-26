const express = require('express');
const router = express.Router();
const signupValidation = require("./lib/signup-validation");
const editNameValidation = require("./lib/edit-name-validation");
const userController = require("./controllers");

//Signup
router.post('/signup', signupValidation, userController.sign_up);

//user login
router.post('/login', userController.login);

//editName
router.put('/user/editName/:id', editNameValidation, userController.verify_token, userController.edit_name);

//getDetails
router.get('/getDetails/:id', userController.verify_token, userController.get_details);

module.exports = router; 