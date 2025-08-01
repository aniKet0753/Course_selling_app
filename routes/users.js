const { Router } = require('express')//exprress gives you key called router 
const { UserModel, PurchaseModel, CourseModel } =require('../db')
const usersRoute = Router()

const express =  require('express')
const {z} = require('zod')
const app = express();
app.use(express.json())
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { JWT_user_SECRET } = require('../config')
const { usermiddleware } = require('../middleware/usermiddleware')


      usersRoute.post('/signup',async function(req,res){
        //checks on input credinacial:
        const requiredBody=z.object({//zod takes an object and contains all the function 
          firstName:z.string().max(30).min(3),
          lastName:z.string().max(30).min(3),
          password:z.string().max(30).min(8),
          email:z.string().min(3).max(100)
        })
        const parsedbwithsucess=requiredBody.safeParse(req.body)//zod returns a function called safeparse that we can parse the input checks inside the req body
        //and it cointains sucess and failear and error field
        if(!parsedbwithsucess.success){
          return res.status(402).send({
            message:"these are inviled formate of information ",
            error:parsedbwithsucess.error
          })
        }
        const firstName=req.body.firstName;
        const lastName= req.body.lastName;
        const password= req.body.password;
        const email= req.body.email;
        try{
          //checking if user already exixst in db or not 
          const existingUser= await UserModel.findOne({email});
          if(existingUser){
            return res.status(409).send({
              message:"user already exixst with this email please signin."
            })
          }
          //hashing password
        const hasedpassword = await bcrypt.hash(password,5)
          UserModel.create({
            firstName: firstName,
            lastName: lastName,
            password:hasedpassword,
            email:email
          })
          return res.status(200).send({
            message:"Signup successful"
          })
          //catching error
        }catch(e){
          console.log("sigup error", error)
          return res.status(500).send({
            message:"internal server error",
          })
        }
          })

      usersRoute.post('/signin',async function(req,res){
        try{
        const email= req.body.email;
        const password= req.body.password;
        if(!email || !password){
            return res.status(400).json({
              message:"email ans password is required"
            })
          }
        const user = await UserModel.findOne({
          email:email
        })
        if(!user){
          return res.status(401).json({
            message:"Invalid cresentials "
          })
        }
          console.log(user)
            const matchpassword= await bcrypt.compare(password, user.password)
            if(!matchpassword){
              return res.status(401).json({
                message:"invalid credentials"
              })
                   }
              console.log(user._id)
              const token= jwt.sign({
               id: user._id.toString()
              },JWT_user_SECRET);
              return res.json({
                token: token
              })
            }catch(error){
                console.error("Signin error:", error);
               return res.status(500).json({ message: "Authentication failed" });
      }
      })


      usersRoute.get('/perchase',usermiddleware,async function(req,res){//user perchased number of cources endpoint
        const userId= req.userId;
        const Purchases= await PurchaseModel.find({
          userId
        })
        const coursesData = await CourseModel.find({
          _id: {$in: Purchases.map(x=> x.courseId)}
        })
        res.json({
          Purchases,
          coursesData
        })
      })
 module.exports={                
  usersRoute:usersRoute                       
 }                       