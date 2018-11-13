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


app.get('/users/add',authenticate,async (req,res)=>{
    try{
        const canAddUser = req.role.permissions.adduser;
        if(canAddUser){
            const roles = await Role.find({});
            res.render('adduser.hbs',{
                pageTitle:'PHIL v2.0 | Add user',
                roles
            });
        }else{
            res.status(401).send('You do not have permission to do that');
        }
    }catch(err){
        res.status(400).send('An error occurred. Could not add user');
    }
});

//create user route
// TODO check if user role is valid
app.post('/users',authenticate, async (req,res)=>{
    try{
        if(req.role.permissions.adduser){
            const user = new User(_.pick(req.body.data,["username","email","role","password","name"]));
            console.log(`New user is ${JSON.stringify(user,undefined,2)}`);
            try{
                let createdUser = await user.save();
                if(createdUser.username){
                    res.status(200).send('User successfully created');
                }else{
                    res.status(400).send('User could not be created');
                }
            }catch(err){
                res.status(400).send(err);
            }
        }else{
            res.status(401).send('You do not have permission to do that');
        }
    }catch(err){
        res.status(400).send('User could not be created');
    }
});

//POST /role

app.post('/role',authenticate,async(req,res)=>{
    try{
        if(req.user){
            const userRole = await Role.findOne({rolename:req.user.role});
            console.log(userRole.permissions.addrole);
            if(userRole.permissions.addrole){
                const role = new Role(_.pick(req.body,["rolename","permissions"]));
                await role.save();
                res.status(200).send('Successfully added role');
            }else{
                res.status(401).send('You do not have persmission to add this role');
            }
        }
    }catch(err){
        res.status(400).send('Could not add role');
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
app.get('/users',authenticate, async (req,res)=>{
    try{
        if(req.user){
            let users = await User.find({}).select({"tokens":0,"password":0,"__v":0});
            let role = await Role.findOne({rolename:req.user.role});
            if(role.permissions.viewusers){
                res.render('users.hbs',{
                    pageTitle: "PHIL v2.0 | Phones",
                    username:req.user.username,
                    canedit:role.permissions.edituser,
                    canadduser:role.permissions.adduser,
                    users
                });
            }
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
                deleteuser:req.role.permissions.deleteuser,
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
            console.log(`Can view users: ${viewusers}`);
            res.render('dashboard.hbs',{
                pageTitle:"PHIL v2.0 | Dashboard",
                username:req.user.username,
                viewphones:viewphones,
                viewusers:viewusers
            });
        }else{
            res.redirect('/');
        }
    }catch(err){
        console.log(`Got err: ${err}`);
    }
});

app.delete('/users/:id',authenticate, async(req,res)=>{
    try{
        if(req.user){
            let role = await Role.findOne({"rolename":req.user.role});
            if(role.permissions.deleteuser){
                if(!ObjectID.isValid(req.params.id)){
                    return res.status(400).send('Invalid user id');
                }
                if(req.params.id!==req.user._id){
                    User.findByIdAndDelete(req.params.id).then((user)=>{
                        if(user){
                            res.status(200).send('User has been deleted');
                        }
                    })
                    .catch((err)=>{
                        throw new Error('Cannot delete user');
                    });
                }else{
                    res.status(401).send('Cannot delete your own account');
                }
            }else{
                res.status(401).send('You do not have permission for that');
            }
        }
    }catch(err){
        res.status(400).send('Cannot delete user');
    }
});


app.patch('/users/:id',authenticate, async (req,res)=>{
    try{
        if(req.user){
            let role = await Role.findOne({"rolename":req.user.role});
            console.log(`User role is: ${role.permissions.edituser}`);
            if(role.permissions.edituser){
                console.log('Editing user');
                if(!ObjectID.isValid(req.params.id)){
                    return res.status(400).send('Invalid user id');
                }
                let data = req.body.data;
                let id = req.params.id;
                if(!validator.isEmail(data.email)){
                    return res.status(400).send('Invalid email provided. User not updated');
                }
                for(let value in data){
                    if(value !== "password" && value !== "confirmPassword"){
                        if(data[value]==="" || data[value] === undefined){
                            return res.status(400).send(`An invalid value for ${value} was provided`);
                        }
                    }
                }
                if(data.password === "" || data.confirmPassword === ""){
                    delete data.password;
                    delete data.confirmPassword;
                }
                try{
                    let response = await User.updateUser(id,data);
                    console.log(`Got response ${response}`);
                    res.send('User has been updated');
                }catch(err){
                    console.log(`Got err as ${err}`);
                    return res.status(400).send(err);
                    console.log(`Got res as ${response}`);
                }
            }else{
                return res.status(401).redirect('/');
            }
        }else{
            return res.status(400).send('User was not found');
        }
    }catch(err){
        // return res.status(400).send(err.errmsg);
        return res.status(400).send('An error occurred. Could not update user.');
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