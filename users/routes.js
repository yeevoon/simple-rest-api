const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

const User = require("./models/user.models");


router.post('/test', (req, res, next) => {
    res.status(200).json({
        message: 'Handling POST requests to /users'
    });
});

//Signup
router.post('/signup', (req,res) =>{
    //console.log(req.body)
    
    if (!req.body){
        res.status(500).send("Request body missing")
    }
    else{
        const user = new User(req.body)
        console.log('Successful signup!')
        user.save()
        .then(result => {
            if (!result || result.length === 0){
                return res.status(500).send(result)
            }
            console.log('result: ' + result);
            res.status(201).send({id: result._id});
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
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
        if(!req.body.email){
            return res.status(401).send('Auth Failed')
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
            if (err){
                return res.status(401).send('Auth Failed')
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
                return res.status(200).json({
                    message: "Authentication Successful!",
                    token: token
                }) 
            }
        }
        )
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

//editName
router.put('/user/editName/:id', verifyToken, (req,res,next) => {
    User.findByIdAndUpdate(req.params.id, {
        firstName: req.body.firstName,
        lastName: req.body.lastName
    }).then(update =>{
        res.json(update)
    }).catch(err => {
        res.status(500).json(err)
    })
})

//getDetails
router.get('/getDetails/:id', verifyToken, (req, res, next) => {
    User.findById(req.params.id)
    .exec()
    .then((err, userDet)=>{
        if (err){
            res.send(err)
        }
        return res.status(200).json(userDet)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })

})

function verifyToken(req, res, next) {
    const header = req.headers.authorization;
    if (typeof header !== 'undefined'){
        const token = header.split(" ")[1]
        console.log(token)
        const decoded = jwt.verify(token, 'secret');
    } else {
        return res.sendStatus(403)
    }
    
    next();
}

module.exports = router; 