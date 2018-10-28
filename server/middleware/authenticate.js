var {User} = require('./../db/models/user');

var authenticate = async (req,res,next)=>{
    var token = req.header('x-auth');
    if(!token){
        return next();
    }
    let user  = await User.findByToken(token);

    if(!user){
        return Promise.reject();
    }

    req.user = user;
    req.token = token;
    next();
}

module.exports={
    authenticate
}