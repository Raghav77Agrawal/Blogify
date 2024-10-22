const {Router} = require('express');
const User = require('../model/user');
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        return cb(null, path.resolve('./public/profileImage'));
    },
    filename:function(req,file,cb){
        return cb(null, `${Date.now()}-${file.originalname}`)
    }
})
const upload = multer({storage:storage});
const { setauth } = require('../middlewares/auth');
const router = Router()
router.post('/signup', upload.single('profileImageUrl'), async (req,res)=>{
    const {fullname,email,password} = req.body;
    
        const u = await User.findOne({email:email});
        console.log(u);
        if(u){
res.redirect('/user/signin');
        }
    else{
        if(req.file){
    await User.create({
        fullname,
        email,password,
        profileImageUrl: `/profileImage/${req.file.filename}`,
            })
        }
        else{
            await User.create({
                fullname,
                email,password,
                    })
        }
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
router.get('/profile', setauth, (req,res)=>{
    
res.render('profile', {user:req.user});
})
router.post('/profilechange/:id',upload.single('profileImageUrl'), async (req,res)=>{
    const ouruser = await User.findById(req.params.id);
    const profilephoto = req.file?`/profileImage/${req.file.filename}`:ouruser.profileImageUrl;
    const fullname = req.body.fullname.trim()==''?ouruser.fullname:req.body.fullname;
    const email = req.body.email.trim()==''?ouruser.email:req.body.email;
 const p = await User.findByIdAndUpdate(req.params.id, {fullname:fullname, email:email, profileImageUrl:profilephoto});
   res.redirect('/');
})
router.get('/signin', (req,res)=>{
    res.render('signin', {b:false});
})
router.get('/signup', (req,res)=>{
    res.render('signup');
})
module.exports = router;