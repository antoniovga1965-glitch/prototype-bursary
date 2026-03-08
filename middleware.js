const jwt  =require('jsonwebtoken');
require('dotenv').config();
const verifyjwt = (req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(402).json({message:"not token found"})
    }
    try {
         const auth = jwt.verify(token,process.env.SECRET_KEY);
        req.user = auth;
      next(); 
    } catch (error) {
        return res.status(402).json({message:"Invalid token"})
    }
      
}

module.exports=verifyjwt;
