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


//todo check for auth token and redirect automatically
//login route
app.post('/users/login',async(req,res)=>{
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
                pageTitle:"PHIL v2.0 | Dashboard"
            });
            console.log('all good');
        }else{
            throw new Error('Username is not valid');
        }
    }catch(err){
        if(err.message){
            console.log(`Sending: ${err.message}`);
            res.status(400).send({error:err.message});
        }else{
            console.log(`Sending: ${err}`);
            res.status(400).send({error:err});
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