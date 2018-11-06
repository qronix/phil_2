require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const _= require('lodash');
const hbs = require('hbs');
const port = process.env.PORT;

const {mongoose} = require('./db/mongoose');
const {User} = require('./db/models/user');
const {Role} = require('./db/models/role');
const {authenticate} = require('./middleware/authenticate');
const validator = require('validator');
const signedCookieSecret = '!@@!#12vvF123424!@VV!124415142';
const {grabPromos} = require('./utils/grabpromos');
const {ObjectID} = require('mongodb'); 
// !@@!#12vvF123424!@VV!124415142

var app = express();
var partialDir = __dirname + './../views/partials';
hbs.registerPartials(partialDir);
app.set('view engine','hbs');
app.use(express.static(__dirname + './../public'));
console.log(`Public dir: ${__dirname + './../public'}`);
app.use(bodyParser.json());
app.use(cookieParser(signedCookieSecret)); //signed cookie secret

hbs.registerHelper('isRole',function (addingRole,userRole,stuff){
    return addingRole === userRole;
});

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
// TODO check if user role is valid
app.post('/users',async (req,res)=>{
    try{
        console.log(_.pick(req.body,["username","password"]));
        const user = new User(_.pick(req.body,["username","email","role","password","name"]));
        await user.save();
        const token = await user.generateAuthToken();
        res.header('x-auth',token).send(user);
    }catch(err){
        res.status(400).send(err);
    }
});

//POST /role

app.post('/role',authenticate,async(req,res)=>{
    try{
        if(req.user){
            const role = await Role.findOne({rolename:req.user.role});
            console.log(role);
            if(role.permissions.addrole){
                const role = new Role(_.pick(req.body,["rolename","permissions"]));
                await role.save();
                res.status(200).send('Successfully added role');
            }else{
                res.status(401).send('You do not have persmission to add this role');
            }
        }
    }catch(err){
        console.log(err);
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

//home -> redirect to dashboard
app.get('/home',async (req,res)=>{
    res.redirect('/dashboard');
});


app.get('/phones',authenticate,async (req,res)=>{
    try{
        if(req.user){
            res.render('phones.hbs',{
                pageTitle: "PHIL v2.0 | Phones",
                username:req.user.username
            });
        }else{
            res.redirect('/');
        }
    }catch(err){
        console.log(`Got err: ${err}`);
    }
});

//users
app.get('/users',authenticate,async (req,res)=>{
    try{
        if(req.user){
            let users = await User.find({}).select({"tokens":0,"password":0,"__v":0});
            res.render('users.hbs',{
                pageTitle: "PHIL v2.0 | Phones",
                username:req.user.username,
                users
            });
        }else{
            res.redirect('/');
        }
    }catch(err){
        console.log(`Got err: ${err}`);
    }
});

//users/:id
app.get('/users/:id',authenticate,async (req,res)=>{
    try{
        if(req.user){
            const id = req.params.id;
            //add id validation
            let editingUser = await User.findById(id);
            let roles = await Role.find().select({"rolename":1,"_id":0});
            res.render('useredit.hbs',{
                username:editingUser.username,
                email:editingUser.email,
                userid:editingUser._id,
                name:editingUser.name,
                enabled:editingUser.enabled,
                role:editingUser.role,
                roles
            });
        }
    }catch(err){
        console.log(`Got err: ${err}`);
        // res.redirect('/dashboard');
        res.send(`Cannot edit user`);
    }
});

//dashboard
app.get('/dashboard',authenticate, async (req,res)=>{
    try{
        if(req.user){
            let {viewphones,viewusers} = req.role.permissions;
            res.render('dashboard.hbs',{
                pageTitle:"PHIL v2.0 | Dashboard",
                username:req.user.username,
                viewphones,
                viewusers
            });
        }else{
            res.redirect('/');
        }
    }catch(err){
        console.log(`Got err: ${err}`);
    }
});

app.patch('/users/:id',authenticate, async (req,res)=>{
    try{
        if(req.user){
            let role = await Role.findOne({"rolename":req.user.role});
            if(role.permissions.edituser){
                if(!ObjectID.isValid(req.params.id)){
                    res.send('Invalid user id');
                }
                let data = req.body.data;
                let id = req.params.id;
                if(data.password === "" || data.confirmPassword === ""){
                    delete data.password;
                    delete data.confirmPassword;
                }
                await User.updateUser(id,data);
                res.send('User has been updated');
            }else{
                res.send('You do not have permission to do that')
            }
        }else{
            res.send('User was not found');
        }
    }catch(err){
        res.send('An error occurred');
    }
});

//logout
app.get('/signout',authenticate,async(req,res)=>{
    try{
        if(req.user){
            await req.user.removeToken(req.token);
            res.redirect('/');
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