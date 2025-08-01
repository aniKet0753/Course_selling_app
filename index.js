require('dotenv').config()
const express = require('express');
const { usersRoute } = require("./routes/users")
const { createcourseRoute  }  = require("./routes/course");
const { adminRouters } = require('./routes/admin');
const { default: mongoose } = require('mongoose');
const app = express();
app.use(express.json())



app.use('/api/v1/users',usersRoute)//thiis tells us whatever that coming on /users it rouyed on {usersRoute} 
app.use('/api/v1/course',createcourseRoute)
app.use('/api/v1/admin',adminRouters)


async function main(){
 await mongoose.connect(process.env.MONGO_URL)
 port=3000;
  app.listen(port,function(){
    console.log("App is listening on port " + port)
  })

}
main()

// WAhiJPPoiIX4neMD