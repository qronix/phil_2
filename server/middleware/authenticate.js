var {User} = require('./../db/models/user');
var cookieParser = require('cookie-parser');

var authenticate = async (req,res,next)=>{
    //already verified via verify cookies
    let cookies = JSON.parse(JSON.stringify(req.signedCookies));
    if(cookies.token && cookies.token !== false){
        try{
            let user = await User.findByToken(cookies.token);
            req.user = user;
            req.token = cookies.token;
            return next();
        }catch(err){
            Promise.reject('User was not found');
        }
    }
};

module.exports={
    authenticate
}