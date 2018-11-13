const mongoose = require('mongoose');

var RoleSchema = new mongoose.Schema({
    rolename:{
        required:true,
        minlength:3,
        type: String,
        trim: true,
        unique:true,
    },
    permissions:{
        deleteuser:{
            type:Boolean,
            default:false
        },
        deletemod:{
            type:Boolean,
            default:false
        },
        deleteadmin:{
            type:Boolean,
            default:false
        },
        adduser:{
            type:Boolean,
            default:false
        },
        addmod:{
            type:Boolean,
            default:false
        },
        adduser:{
            type:Boolean,
            default:false
        },
        edituser:{
            type:Boolean,
            default:false
        },
        editmod:{
            type:Boolean,
            default:false
        },
        editadmin:{
            type:Boolean,
            default:false
        },
        edituserperms:{
            type:Boolean,
            default:false
        },
        editmodperms:{
            type:Boolean,
            default:false
        },
        editadminperms:{
            type:Boolean,
            default:false
        },
        viewusers:{
            type:Boolean,
            default:false
        },
        viewphones:{
            type:Boolean,
            default:false
        },
        addphone:{
            type:Boolean,
            default:false
        },
        editphone:{
            type:Boolean,
            default:false
        },
        deletephone:{
            type:Boolean,
            default:false
        },
        viewroles:{
            type:Boolean,
            default:false
        },
        addrole:{
            type:Boolean,
            default:false
        },
        editrole:{
            type:Boolean,
            default:false
        },
        deleterole:{
            type:Boolean,
            default:false
        },
    }
    // permissionlevel:{
    //     type:Number,
    //     required:true,
    //     default:0
    // }
});

var Role = mongoose.model('Role',RoleSchema);

module.exports={
    Role
};