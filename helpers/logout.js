
const express = require('express');
const router = express.Router();
const verifyjwt = require('../middleware');

router.get('/logout',verifyjwt,(req,res)=>{
    res.clearCookie('token',{
        httpOnly:true,
        sameSite:'lax',
        secure:false,
    })
    return res.status(200).json({ message: 'Logged out successfully' });
})
module.exports =router;