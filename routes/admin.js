const { Router } = require('express')
const express =  require('express')
const { AdminModel } = require('../db')
const { JWT_Admin_SECRET } = require('../config')
const {CourseModel} = require('../db')


const bcrypt = require('bcrypt')
const adminRouters = Router()
const app = express();
app.use(express.json())
const {z} = require('zod')//zod is a library that lets me put checks on input crediAANCIAL DSO THAT WE CAN STRICT THE INPPUT and prevent our database from unnecessery things input
const jwt = require('jsonwebtoken')
const { Adminmiddleware } = require('../middleware/adminmiddleware')
const course = require('./course')


//middleware 

      //signup route
      adminRouters.post('/signup',async function(req,res){
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
          const existingUser= await AdminModel.findOne({email});
          if(existingUser){
            return res.status(409).send({
              message:"user already exixst with this email please signin."
            })
          }
          //hashing password
        const hasedpassword = await bcrypt.hash(password,5)
          AdminModel.create({
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

      adminRouters.post('/signin',async function(req,res){
        try{
        const email= req.body.email;
        const password= req.body.password;
        if(!email || !password){
            return res.status(400).json({
              message:"email ans password is required"
            })
          }
        const Admin= await AdminModel.findOne({
          email:email
        })
        if(!Admin){
          return res.status(401).json({
            message:"Invalid cresentials "
          })
        }
          console.log(Admin)
            const matchpassword= await bcrypt.compare(password, Admin.password)
            if(!matchpassword){
              return res.status(401).json({
                message:"invalid credentials"
              })
                   }
              console.log(Admin._id)
              const token= jwt.sign({
               id: Admin._id
              },JWT_Admin_SECRET);
              return res.json({
                token: token
              })
            }catch(error){
                console.error("Signin error:", error);
               return res.status(500).json({ message: "Authentication failed" });
      }
      })

      adminRouters.post('/creation',Adminmiddleware,async function(req,res){
        const adminId = req.userId;
        const {title,description,imageUrl,price}=req.body;

        const course = await CourseModel.create({
          title: title,
          description:description,
          imageUrl:imageUrl,
          price:price,          
          creatorId: adminId
        })
        const courseId= course._id;
         console.log(courseId);
        res.status(200).json({
          message:"course created",
          courseId:courseId
          
        })
                 

       
})

      adminRouters.put('/courses',Adminmiddleware,async function(req,res){//changing course

        const adminId = req.userId;
        const { title, description, imageUrl, price ,courseId} = req.body;

        // Basic validation


        const result = await CourseModel.findOneAndUpdate(
            {
                _id: courseId,
                creatorId: adminId
            },
            {
                title:title,
                description:description,
                imageUrl:imageUrl,
                price:price
            },{
              new:true
            }
        );
         res.status(200).json({
          message:"updated sucesfully",
          result

        })
        console.log("Updating course:", {
  courseId: req.params.courseId, // or req.body.courseId if using body
  adminId: req.userId,
  updateData: {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    imageUrl: req.body.imageUrl
  }
});
      })

    adminRouters.get('/getcources', async function(req,res){
      const adminId= req.userId
  
      const courses= await CourseModel.find({
          courseId:adminId
      })
      return res.status(200).send({
        message:"your all cources ",
        courses
      })
    })
module.exports={
  adminRouters:adminRouters
}