require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieparser = require('cookie-parser');
const userRoute = require('./routes/user');
const Blog = require('./model/blog');
const blogRoute = require('./routes/blog');
const {setauth} = require('./middlewares/auth');
const app = express();
//middleware
app.use(cookieparser());
app.use(express.static(path.resolve('./public')))
mongoose.connect(process.env.MongoUrl).then(()=>{console.log('connected')});

const PORTs = process.env.PORT;
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views') )
app.use(express.urlencoded({extended:false}));
app.use('/user', userRoute);
app.get('/', setauth,  async (req,res)=>{
    if(!req.user){
      return res.render('signin', {b:false});
    }
const blog = await Blog.find({});
    console.log('Ok');
   res.render('homepage', {
        user:req.user,
        blogs:blog,
    });
})
app.use('/blog',setauth,blogRoute);
app.listen(PORTs,()=>{
    console.log(`server connected at ${PORTs}`);
})