var verifycookies = (req,res,next)=>{
    debugger;
    let cookies = JSON.parse(JSON.stringify(req.signedCookies));
    let verified = Object.values(cookies).every((value)=>value!==false);
    if(verified){
       next();
    }else{
        Promise.resolve().then(()=>{
            throw new Error('Cookies are not properly signed');
        }).catch(next).then(()=>res.redirect('/'));
    }
};

module.exports={
    verifycookies
};