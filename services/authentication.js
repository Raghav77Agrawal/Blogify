const jwt = require('jsonwebtoken');
const secret = 'ParamSundari';
 function setuser(user){
    const payloads = {
        _id:user._id,
        fullname:user.fullname,
        email:user.email,
        profileImageUrl:user.profileImageUrl,
        role:user.role,
    }
return jwt.sign(payloads,secret);
}
 function getuser(key){
    if(!key){
        return false;
    }
    return jwt.verify(key,secret);
}
module.exports = {setuser,getuser};