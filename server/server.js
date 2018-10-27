require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const _= require('lodash');
const hbs = require('hbs');
const port = process.env.PORT;

const {mongoose} = require('./db/mongoose');
const {User} = require('./db/models/user');


var app = express();
var partialDir = __dirname + './../views/partials';
hbs.registerPartials(partialDir);
app.set('view engine','hbs');
app.use(express.static(__dirname + './../public'));
console.log(`Public dir: ${__dirname + './../public'}`);
app.use(bodyParser.json());








//login route

app.post('/users/login',async(req,res)=>{
    try{
        const body = (_.pick(req.body,["username","password"]));
        const user = await User.findByCredentials(body.username,body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth',token).send(user);
        res.status(200).send();
        res.render('dashboard.hbs',{
            pageTitle:"PHIL v2.0 | Dashboard"
        });
    }catch(err){
        res.status(400).send();
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




app.listen(port,()=>{
    console.log(`Server started on port: ${port}`);
});