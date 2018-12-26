const User = require("./models");
const errorMsg = require("./lib/messages").error;
const successMsg = require("./lib/messages").success;
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const secretKey = 'secret'
const expiration = '1h'

exports.sign_up = (req,res) => {
    var errors = req.validationErrors();
    if (errors){
        return res.json(errorMsg.validation_failed);
    } else{
        const userDetails = new User ({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            dob: req.body.dob
        });
        //console.log('Successful signup!')
        userDetails
        .save()
        .exec()
        .then(result => {
            if (!result || result.length === 0){
                return res.status(500).json(errorMsg.internal)
            }
            console.log(`result: ${result}`);
            res.status(201).json(successMsg.signup_successful)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(errorMsg.internal); //when request body is empty 
        })
       // .then(userDetails => res.json(userDetails))        
    }
};

exports.login = (req,res) =>{
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
                    secretKey, 
                    {
                        expiresIn: expiration
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
};

exports.edit_name = (req,res) => {
    User.findByIdAndUpdate(req.params.id, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        runValidators: true
    }).then(update =>{
        console.log(update)
        return res.json(successMsg.update_successful)
    }).catch(err => {
        console.log(err)
        res.status(500).json(errorMsg.user_not_found)
    })
};

exports.get_details = (req, res) => {
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

};

exports.verify_token = function(req, res, next) {
    const header = req.headers.authorization;
    if (typeof header !== 'undefined'){
        const token = header.split(" ")[1]
        //console.log(token)
        const decoded = jwt.verify(token, secretKey);
    } else {
        return res.status(500).json(errorMsg.internal);
    }
    next();
}