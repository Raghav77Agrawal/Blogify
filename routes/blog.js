const {Router} = require('express');
const multer = require('multer');
const Blog = require('../model/blog');
const path = require('path');
const Comment = require('../model/comment');
const Routers = Router();
//. to  be included whenever said for current directory inpath .resolve
// keep headers sent error msg in mind it means that you are sending two times
//JSON.stringify to convert json to string
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        return cb(null,path.resolve(`./public/uploads`));
    },
    filename:function(req,file,cb){
        return cb(null,`${Date.now()}-${file.originalname}`)
    }
})
const upload = multer({storage:storage});

Routers.get('/add-new',(req,res)=>{
res.render('addblog', {
    user:req.user,
});
})
Routers.post('/', upload.single('coverImage'),async (req,res)=>{
    const {title,body} = req.body;
  const blog =  await Blog.create({
title,body,
createdBy:req.user._id,
coverImageUrl:`/uploads/${req.file.filename}`,
    });
    res.redirect(`/blog/${blog._id}`);
})
//populate word basically includes information of types also
Routers.get('/:id', async (req,res)=>{
    const blog = await Blog.findById(req.params.id).populate('createdBy');
  const comment = await Comment.find({blogId:req.params.id}).populate('createdBy');
    res.render('blog', {
        user:req.user,
        myblog:blog,
        mycomment:comment
    })
})
Routers.post('/comment/:blogid', async (req,res)=>{

 await Comment.create({
content:req.body.content,
blogId:req.params.blogid,
createdBy:req.user._id,
})
return res.redirect(`/blog/${req.params.blogid}`);
})
module.exports = Routers;