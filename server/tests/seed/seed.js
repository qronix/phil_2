const {ObjectID} = require('mongodb');
const {User} = require('./../../db/models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();

const users = [{
    _id:userOneId,
    username:'testuser',
    password:'testpassword',
    tokens:[{
        access:'auth',
        token: jwt.sign({_id:userOneId,access:'auth'},process.env.JWT_SECRET).toString()
    }]
}];

const populateUsers = (done)=>{
    User.remove({}).then(()=>{
        var userOne = new User(users[0]).save();

        return Promise.all([userOne]);
    }).then(()=>done());
}

module.exports = {
    populateUsers
};