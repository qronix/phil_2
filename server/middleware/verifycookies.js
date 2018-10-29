var verifycookies = (req,res,next)=>{
    // debugger;
    let cookies = JSON.parse(JSON.stringify(req.signedCookies));
    if(cookies.token && cookies.username){
        next();
    }else{
        next();
    }
};

module.exports={
    verifycookies
};