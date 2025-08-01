const { Router } = require("express")
const {CourseModel, PurchaseModel} = require("../db")
const createcourseRoute =  Router()
const { usermiddleware } = require('../middleware/usermiddleware')


     createcourseRoute.post('/perchase', usermiddleware,async function(req,res){
      const userId =  req.userId;
      const courseId = req.courseId;
      await PurchaseModel.create({
        userId,
        courseId
      })
      res.json({
        message:"you have sucesfully brought this course"
      })
    })
  
     createcourseRoute.post('/coursespreview',async function(req,res){
      const course = await CourseModel.find({});
      res.json({
        course
      })
    })
module.exports={
  createcourseRoute:createcourseRoute
}