const express = require('express');
const Router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieparse = require('cookie-parser');
const limit = require('express-rate-limit');
const prisma = require('../prisma/client');
const router = require('../helpers/sendemail');
const adminprotected = require('../adminmiddleware');
const  verifyjwt =require('../middleware')

const limitor = limit({
    windowMs:15*60*1000,
    max:10,
    message:{message:'Too many login attempts try again later'},
})




Router.post('/login',limitor,async(req,res)=>{
 const {EMAILLOGIN,PASSWORDLOGIN} =req.body;

 if(!EMAILLOGIN||!PASSWORDLOGIN){
    return res.status(422).json({message:'Please fill in the required fields'});
 }try {
    const response = await prisma.registered_users.findUnique({
        where:{REGISTEREMAIL:EMAILLOGIN}
    })
    if(!response){
        return res.status(422).json({message:'user not found'})
    }
    const match = await bcrypt.compare(PASSWORDLOGIN,response.REGPASS1);
    if(!match){
        return res.status(402).json({message:'Incorrect login credentials'})
    }
    const token = jwt.sign({id:response.id,email:response.REGISTEREMAIL,role:response.role},process.env.SECRET_KEY,{expiresIn:'1h'});
    res.cookie('token',token,{
        httpOnly:true,
        sameSite:'strict',
        secure: process.env.NODE_ENV === 'production'

    })
    return res.status(200).json({message:`${EMAILLOGIN} youve logged in succesfully wait for redirection`})
 } catch (error) {
      return res.status(500).json({message:`Something went wrong try again later`})
 }

    
})


Router.get('/me',verifyjwt,(req,res)=>{
    return res.status(200).json({role:req.user.role,email:req.user.email})
})
module.exports = Router;