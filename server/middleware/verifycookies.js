const cookieParser = require('cookie-parser');

const verifycookies = (req,res,next)=>{
    let signedCookies = JSON.parse(req.signedCookies);
};






// let signedCookies = JSON.stringify(req.signedCookies,undefined,2);
// let signedCookies = cookieParser.JSONCookies(JSON.stringify(req.signedCookies,undefined,2));
// let cookies = JSON.parse(signedCookies);
// let signedCookies = cookieParser.signedCookies(req.signedCookies,signedCookieSecret);
// console.log(`Signed cookies: ${signedCookies}`);
// console.log(`Username cookie:${cookies.username}`);
// console.log(`Signed Cookies: ${JSON.stringify(req.signedCookies,undefined,2)}`);