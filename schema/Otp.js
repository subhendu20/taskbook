const mongoose = require('mongoose')
const otp = new mongoose.Schema({
          email:{
                    type:String,
                    required:true
          },
          code:{
                    type:String,
                    required:true
          },
          expire:{
                    type:Number
          }


})

const userotp = new mongoose.model('otp',otp)
module.exports = userotp