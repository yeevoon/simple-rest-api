const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const {check, validation} = require('express-validator/check');


const User = require("./models/user.models");
const signupValidation = require("../lib/signup-validation");
const editNameValidation = require("../lib/editName-validation");
const errorMsg = require("../lib/messages").error;
const successMsg = require("../lib/messages").success;


router.post('/test', (req, res, next) => {
    res.status(200).json({
        message: 'Handling POST requests to /users'
    });
});

//Signup
router.post('/signup', signupValidation, (req,res) =>{
    var errors = req.validationErrors();
    if (errors){
        return res.send(errors);
    } else{
        const user = new User(req.body)
        //console.log('Successful signup!')
        user.save()
        .then(result => {
            if (!result || result.length === 0){
                return res.status(500).json(errorMsg.internal)
            }
            console.log('result: ' + result);
            res.status(201).json(successMsg.signup_successful)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(errorMsg.internal); //when request body is empty 
        })
       // .then(user => res.json(user))        
    }


    
    /*
    res.status(201).json({
        message: 'New user sign up.'
    });*/
});

//user login
router.post('/login', (req,res,next) =>{
    User.find({ email: req.body.email})
    .exec()
    .then(user =>{
        if(user.length < 1){
            return res.status(401).json(errorMsg.login_failed); //wrong email
        } 
        bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
            if (err){
                return res.status(401).json(errorMsg.login_failed); //wrong password
            }
            if (result){
                const token = jwt.sign(
                    {
                        userID: user[0]._id,
                        password: user[0].password
                    },
                    "secret", 
                    {
                        expiresIn: "1h"
                    }
                );
                return res.status(200).json({token: token}) 
            } 
            return res.status(401).json(errorMsg.login_failed);    
            }
        )            
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(errorMsg.internal);
    })
})

//editName
router.put('/user/editName/:id', editNameValidation, verifyToken, (req,res,next) => {
    User.findByIdAndUpdate(req.params.id, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        runValidators: true
    }).then(update =>{
        console.log(update)
        return res.json(successMsg.update_successful)
    }).catch(err => {
        res.status(500).json(errorMsg.user_not_found)
    })
})

//getDetails
router.get('/getDetails/:id', verifyToken, (req, res, next) => {
    User.findById(req.params.id)
    .exec()
    .then(result =>{
        console.log(result)
        return res.status(200).json({
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
            dob: result.dob
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(errorMsg.internal);
    })

})

function verifyToken(req, res, next) {
    const header = req.headers.authorization;
    if (typeof header !== 'undefined'){
        const token = header.split(" ")[1]
        //console.log(token)
        const decoded = jwt.verify(token, 'secret');
    } else {
        return res.status(500).json(errorMsg.internal);
    }
    next();
}

module.exports = router; 