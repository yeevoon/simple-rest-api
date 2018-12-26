const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs')

mongoose.connect('mongodb://localhost/User', { useNewUrlParser: true })

const userSchema = mongoose.Schema({
    firstName   : String,
    lastName    : String,
    email       : {
        type: String, 
        required: true, 
        unique: true},
    password    : {
        type: String,
        required: true},
    dob         : String
});

userSchema.methods.generate_hash = function(password) {

    try {

        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
        
    } catch (err) {
        logger.error(err);
        return false;
    }
};

userSchema.pre('save', function(next){

    if(!this.password) return next();

    try {

        this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8), null);
        return next();
        
    } catch (err) {
        logger.error(err);
        throw new Error('Password hashing failed');
    }

});

module.exports = mongoose.model('user', userSchema);  