const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    username:{
        required:true,
        minlength:1,
        type:String,
        trim:true,
        unique:true,
        validate:{
            validator:validator.isAlphanumeric,
            message:'{VALUE} is not alphanumeric'
        }
    },
    password:{
        type:String,
        require:true,
        minlength:8,
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
});

UserSchema.methods.generateAuthToken = function(){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(),access},process.env.JWT_SECRET).toString();

    user.tokens = user.tokens.concat([{access,token}]);

    return user.save().then(()=>{
        return token;
    });
}

UserSchema.pre('save',function(next){
    var user = this;
    if(user.isModified('password')){
        var password = user.password;
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password,salt,(err,hash)=>{
                user.password = hash;
                next();
            });
        });
    }else{
        next();
    }
});

var User = mongoose.model('User',UserSchema);

module.exports={
    User
}