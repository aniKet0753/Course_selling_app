const jwt = require('jsonwebtoken')
const { JWT_user_SECRET }= require('../config');
const { model } = require('mongoose');

function usermiddleware(req,res,next){
  const token = req.headers.token
  try{
  const decode  = jwt.verify(token,JWT_user_SECRET)
    req.userId= decode.id;
    next()
  }catch(error){
    return res.status(403).send({
      message:"you are not signed in"
    })
  }
}
module.exports={
  usermiddleware: usermiddleware
}