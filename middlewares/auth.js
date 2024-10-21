const {getuser} = require('../services/authentication');
function setauth(req,res,next){
    const token = req.cookies?.token;
    if(!token){
      return  next();
    }
    const user = getuser(token);
    if(!user){
        return next();
        
    }
    req.user = user;
  return next();
}
module.exports = {setauth};