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
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:'{VALUE} is not a valid email'
        }
    },
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    role:{
        type:String,
        required:true,
        trim:true,
        default:'user'
    },
    password:{
        type:String,
        require:true,
        minlength:4,
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

UserSchema.methods.toJSON = function(){
    var user = this;

    var userObject = user.toObject();

    return _.pick(userObject,['_id','username']);
}

UserSchema.methods.generateAuthToken = function(){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(),access},process.env.JWT_SECRET).toString();

    user.tokens = [{access,token}];

    return user.save().then(()=>{
        return token;
    });
};

UserSchema.statics.findByCredentials = async function(username,password){
    var User = this;
    let user = await User.findOne({username});

    if(!user){
        return Promise.reject('Invalid credentials');
    }

    return new Promise((resolve,reject)=>{
        bcrypt.compare(password,user.password,(err,result)=>{
            if(result){
                resolve(user);
            }else{
                reject('Invalid credentials');
            }
        });
    });
};

// UserSchema.methods.removeToken = function(token){
//     var user = this;
//     console.log(`Removing token: ${token}`);
//     return user.update({
//         $pull:{
//             token:{
//                 token
//             }
//         }
//     });
// };

UserSchema.methods.removeToken = function(token){
    var user = this;
    return user.update({
        $pull:{
            tokens:{
                token
            }
        }
    });
};

UserSchema.statics.findByToken = function(token){
    var User = this;
    var decoded;

    try{
        decoded = jwt.verify(token,process.env.JWT_SECRET);
    }catch(err){
        return Promise.reject();
    }
    return User.findOne({
        '_id':decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    });
};

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
};