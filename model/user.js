const {Schema, model, default: mongoose} = require('mongoose');
const {randomBytes,createHmac} = require('crypto');
const { setuser } = require('../services/authentication');
const userSchema = new Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,

    },
    password:{
type:String,
required:true,
    },
    profileImageUrl:{
        type:String,
        
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:'USER',
    }
},{timestamps:true,});

userSchema.pre('save',async function (next){
    const user = this;
    if(!user.isModified('password')){
        return;
    }
   const salt = randomBytes(16).toString();
    const hashedpassword = createHmac('sha256',salt).update(user.password).digest('hex');
this.salt = salt;
this.password = hashedpassword;
})
userSchema.static('matchpassword',async function (email,password){
const user = await this.findOne({email:email});
if(!user){
    return null;
}
const hashedpass = user.password;
const salt = user.salt;
const hashedpassword = createHmac('sha256',salt).update(password).digest('hex');
if(hashedpass!=hashedpassword){
    return null;
}
const token = setuser(user);
return token;
})
const user = model('user', userSchema);
module.exports = user;