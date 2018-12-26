const express = require('express');
const router = express.Router();
const signupValidation = require("./lib/signup-validation");
const editNameValidation = require("./lib/edit-name-validation");
const userController = require("./controllers");

//Signup
router.post('/signup', signupValidation, userController.signUp);

//user login
router.post('/login', userController.login);

//editName
router.put('/user/editName/:id', editNameValidation, userController.verifyToken, userController.editName);

//getDetails
router.get('/getDetails/:id', userController.verifyToken, userController.getDetails);

module.exports = router; 