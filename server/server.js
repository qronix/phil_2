require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const _= require('lodash');
const hbs = require('hbs');
const port = process.env.PORT;

var app = express();
var partialDir = __dirname + './../views/partials';
hbs.registerPartials(partialDir);
app.set('view engine','hbs');
app.use(express.static(__dirname + './../public'));
app.use(bodyParser.json());








//login route

//create user route

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