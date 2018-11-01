var {User} = require('./../db/models/user');
var {Role} = require('./../db/models/role');

var cookieParser = require('cookie-parser');

var authenticate = async (req,res,next)=>{
    //already verified via verify cookies
    let cookies = JSON.parse(JSON.stringify(req.signedCookies));
    if(cookies.token && cookies.username){
        try{
            let user = await User.findByToken(cookies.token);
            if(user){
                if(user.enabled){
                    let role = await Role.findOne({rolename:user.role});
                    req.role = role;
                    req.user = user;
                    req.token = cookies.token;
                    next();
                }else{
                   res.redirect('/');
                }
            }else{
                next();
            }
        }catch(err){
            Promise.reject(err);
        }
    }else{
        next();
    }
};

module.exports={
    authenticate
}