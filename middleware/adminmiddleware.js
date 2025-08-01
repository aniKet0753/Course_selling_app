const jwt = require('jsonwebtoken')
const { JWT_Admin_SECRET }= require('../config');

function Adminmiddleware(req,res,next){
  const token = req.headers.token
  const decode  = jwt.verify(token,JWT_Admin_SECRET)
  if(decode){
    req.userId= decode.id;
    next()
      }
  else{
     res.status(403).json({
      message:"you are not signed in"
    })
  }
}
module.exports={
  Adminmiddleware: Adminmiddleware
}