const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const middleware = require('body-parser')
const route1 = require('./Router/Route')
const route2 = require('./Router/Route2')
const route3 = require('./Router/Route3')
const path = require('path')
const app = express()
// ---------------------------------------------database connection------------------------------------------//
mongoose.connect(process.env.DB,{
          useNewUrlParser:true,
          
          useUnifiedTopology:true
}).then(()=>{
          console.log('connected')
}).catch((e)=>{
          console.log(e)
})

// -------------------------------------------------middleware------------------------------------------------//
app.use(middleware.urlencoded({ extended: false }));
app.use(middleware.json());
app.use('/user',route1)
app.use('/user/notes',route2)
app.use('/user/verification',route3)



app.use(express.static(path.join(__dirname, './client/build')))

app.use('*', function(req,res){
          res.sendFile(path.join(__dirname, './client/build/index.html'))
})






// --------------------------------------------------server setup--------------------------------------------//
app.listen(process.env.PORT,()=>{
          console.log(`port running at ${process.env.PORT}`)
})
 