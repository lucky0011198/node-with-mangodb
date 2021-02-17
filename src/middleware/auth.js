const jwt =require("jsonwebtoken");
const Data = require("../models/register");
const auth = async(req,res,next)=>{
    try{
       const token= req.cookies.jwt;
       const varifyuser =jwt.verify(token, process.env.SCRET_KEY);
       console.log(varifyuser);

       const user = await Data.findOne({_id:varifyuser._id});
       console.log(user.email);
       req.token =token;
       req.user= user;
       next();
    }catch(error){
        res.status(401).send(error);
    }

}
module.exports = auth;