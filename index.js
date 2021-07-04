const express = require('express')
const app=express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');

dotenv.config();

mongoose 
 .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,   })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));

//MIDDLEWARE
app.use(express.json());
app.use(helmet())
app.use(morgan("common"));
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/posts", postRoute)


// app.get("/",(rquest, response)=>{
//   response.send("Welcome to home")
// })

// app.get("/users",(rquest, response)=>{
//   response.send("Welcome to home")
// })


app.listen(8800,()=>{
  console.log("Backend server is running");
})

