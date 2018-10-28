require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const _= require('lodash');
const hbs = require('hbs');
const port = process.env.PORT;

const {mongoose} = require('./db/mongoose');
const {User} = require('./db/models/user');
const {authenticate} = require('./middleware/authenticate');
const validator = require('validator');

var app = express();
var partialDir = __dirname + './../views/partials';
hbs.registerPartials(partialDir);
app.set('view engine','hbs');
app.use(express.static(__dirname + './../public'));
console.log(`Public dir: ${__dirname + './../public'}`);
app.use(bodyParser.json());


// process.on('unhandledRejection',(reason,p)=>{
//     let promise = JSON.stringify(p,undefined,2);
//     console.log(`Unhandled rejection at: ${promise} reason: ${reason}`);
// });

//todo check for auth token and redirect automatically
//login route
app.post('/users/login',authenticate,async(req,res)=>{
    if(req.user){
        res.set({'x-username':req.user.username});
        res.set({'x-_id':req.user._id});
        res.render('dashboard.hbs',{
            pageTitle:"PHIL v2.0 | Dashboard",
            username:req.user.username
        });
        return console.log('Logged in via token');
    }
    try{
        const body = (_.pick(req.body,["username","password"]));
        if(validator.isAlphanumeric(body.username)){
            const user = await User.findByCredentials(body.username,body.password);
            if(!user){
                throw new Error('Invalid credentials');
            }
            const token = await user.generateAuthToken();
            res.set({'x-auth': token});
            res.set({'x-username':user.username});
            res.set({'x-_id':user._id});
            res.render('dashboard.hbs',{
                pageTitle:"PHIL v2.0 | Dashboard",
                username:user.username
            });
            console.log('all good');
        }else{
            throw new Error('Username is not valid');
        }
    }catch(err){
        if(err.message){
            //TODO: send only errors which are not server informative
            console.log(`Sending: ${err.message}`);
            if(err.message==='Invalid credentials'){
                res.status(401).send({error:err.message});
            }else{
                res.status(401).send('An error occured');
            }

        }else{
            console.log(`Sending: ${err}`);
            // res.status(400).send({error:err});
            res.status(400).send();
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
app.get('/',(req,res)=>{
    res.render('home.hbs',{
        pageTitle:"PHIL v2.0 | Login"
    });
});

//dashboard
app.get('/dashboard',authenticate)



app.listen(port,()=>{
    console.log(`Server started on port: ${port}`);
});