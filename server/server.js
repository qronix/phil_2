require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const _= require('lodash');
const hbs = require('hbs');
const port = process.env.PORT;

const {mongoose} = require('./db/mongoose');
const {User} = require('./db/models/user');
const {authenticate} = require('./middleware/authenticate');
const validator = require('validator');
const signedCookieSecret = '!@@!#12vvF123424!@VV!124415142';
const {grabPromos} = require('./utils/grabpromos');
// !@@!#12vvF123424!@VV!124415142

var app = express();
var partialDir = __dirname + './../views/partials';
hbs.registerPartials(partialDir);
app.set('view engine','hbs');
app.use(express.static(__dirname + './../public'));
console.log(`Public dir: ${__dirname + './../public'}`);
app.use(bodyParser.json());
app.use(cookieParser(signedCookieSecret)); //signed cookie secret


// hbs.registerHelper('getPromos',grabPromos());
// process.on('unhandledRejection',(reason,p)=>{
//     let promise = JSON.stringify(p,undefined,2);
//     console.log(`Unhandled rejection at: ${promise} reason: ${reason}`);
// });

//todo check for auth token and redirect automatically
//login route
app.post('/users/login',async(req,res)=>{
    try{
        const body = (_.pick(req.body,["username","password"]));
        if((userCheck=validator.isAlphanumeric(body.username)) && validator.isLength(body.password,1)){
            const user = await User.findByCredentials(body.username,body.password);
            if(!user){
                throw new Error('Invalid credentials');
            }
            const token = await user.generateAuthToken();
            res.cookie('username',user.username,{signed:true});
            res.cookie('token',token,{signed:true});

            res.redirect(`/dashboard`);

        }else{
            if(!userCheck && body.password.length < 1){
                throw new Error('Invalid credentials');
            }
            if(!userCheck){
                throw new Error('Username is invalid');
            }else{
                throw new Error('Password is invalid');
            }
        }
    }catch(err){
        if(err.message){
            //TODO: send only errors which are not server informative
            if(err.message==='Invalid credentials' || err.message==='Username is invalid' || 
                err.message === 'Password is invalid'){
                res.status(401).send({error:err.message});
            }else{
                res.status(401).send('An error occured');
            }
        }else{
            console.log(`Sending: ${err}`);
            if(err==='Invalid credentials'){
                res.status(400).send({error:err});
            }else{
                res.status(400).send();
            }
        }
    }
});



//create user route
app.post('/users',async (req,res)=>{
    try{
        console.log(_.pick(req.body,["username","password"]));
        const user = new User(_.pick(req.body,["username","password"]));
        await user.save();
        const token = await user.generateAuthToken();
        res.header('x-auth',token).send(user);
    }catch(err){
        res.status(400).send(err);
    }
});

//home page
app.get('/',authenticate,(req,res)=>{
    if(req.user){
        res.redirect('/dashboard');
        return console.log('Logged in via token');
    }else{
        res.render('home.hbs',{
            pageTitle:"PHIL v2.0 | Login"
        });
    }
});

//dashboard
app.get('/dashboard',authenticate, async (req,res)=>{
    try{
        if(req.user){
            res.render('dashboard.hbs',{
                pageTitle:"PHIL v2.0 | Dashboard",
                username:req.user.username
            });
        }else{
            res.redirect('/');
        }
    }catch(err){
        console.log(`Got err: ${err}`);
    }
});



app.listen(port,()=>{
    console.log(`Server started on port: ${port}`);
});

module.exports={
    app
};