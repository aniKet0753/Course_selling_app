const mongoose = require('mongoose')
const course = require('./routes/course')


const schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId
///schema for users:
const userschema = new schema({
  email: {type: String, unique:true},
  password: String,
  firstName: String,
  lastName: String,
  })
//schema for coursees
const CourseSchema = new schema({
  prince: Number,
  title: String,
  description: String,
  imageUrl:String,
  creatorId: { type: ObjectId }
})
//schema for perchaseing course
const PurchaseSchema = new schema({
  userId: { type: ObjectId, ref: 'User' },//and user id refer to user schema
  // ref:"userDB",
  courseId:{ type: ObjectId, ref: 'Course' },//this course id refer to this course schema
  // ref:"CourseSchema" this is not alloweed
})
//admin schema
const AdminSchema = new schema({
  email: {type: String, unique:true},
  password: String,
  firstName: String,
  lastName: String,

})

const UserModel = mongoose.model('User', userschema);
const CourseModel = mongoose.model('Course', CourseSchema);
const AdminModel = mongoose.model('admins', AdminSchema);
const PurchaseModel = mongoose.model('Purchase', PurchaseSchema);

module.exports={
  UserModel,
  CourseModel,
  AdminModel,
  PurchaseModel
}