const {Router} = require('express');
const User = require('../model/user');
const {setuser} = require('../services/authentication');
const router = Router()
router.post('/signup', async (req,res)=>{
    const {fullname,email,password} = req.body;
    
        const u = await User.findOne({email:email});
        console.log(u);
        if(u){
res.redirect('/user/signin');
        }
    else{
    await User.create({
        fullname,
        email,password
            })
             res.redirect('/');
        }
    
})
router.post('/signin',async (req,res)=>{
    const {email,password} = req.body;
    console.log('Problem Starts');
    const token = await User.matchpassword(email,password);
    if(token!=null){
        res.cookie('token', token).redirect('/');
    }
    else{
        res.render('signin', {b:true});
    }
    
 
    
})
router.get('/logout', async (req,res)=>{
    
  return  res.clearCookie("token").redirect('/user/signin');
})
router.get('/signin', (req,res)=>{
    res.render('signin', {b:false});
})
router.get('/signup', (req,res)=>{
    res.render('signup');
})
module.exports = router;