const express = require('express')
const router = express.Router()
const cors = require('cors')
const user = require('../schema/user')
const otp = require('../schema/Otp')
const auth = require('bcryptjs')
const dotenv = require('dotenv').config()
const JWT = require('jsonwebtoken')
const cookie = require('cookie-parser')
const jwttk = process.env.TOKEN


router.use(cors({
          origin: 'http://localhost:3000',
          methods: ['POST', 'PUT', 'GET','OPTIONS','PATCH','HEAD'],
          credentials: true
}))
// ------------------------------------------nodemailer------------------------------------------------------//

const sendmail = (email, otp) => {
          const nodemailer = require("nodemailer");

          const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false,
                    auth: {
                              
                              user: process.env.EMAIL,
                              pass: process.env.PASSWORD
                    },
          });
          var mailoption = {
                    from : "ohumor2000@gmail.com",
                    to:email,
                    subject:"Veriication code",
                    text:`your one time password is ${otp}`
          }


          transporter.sendMail(mailoption,(error,info)=>{
                    if(error){
                              console.log(error)
                              return false
                    }
                    if(info){
                              console.log(info.response)
                              return
                    }
          })

}
//-------------------------------------------verify otp------------------------------------------------------//
const changePassword= async(otpcode,newpassword)=>{
          const findCred = await otp.find({code:otpcode})
          if(findCred.length > 0){
                    console.log(findCred)
                    const mail = await findCred[0].email
                    console.log(mail)
                    const userData = await user.findOne({email:mail})
                    console.log(userData)
                    const salt = await auth.genSaltSync(10)
                    const hashed = await auth.hashSync(newpassword, salt)
                    console.log(userData.password)
                    userData.password = hashed
                    userData.save().then((res)=>{
                              return 'Password changed successfull'

                    }).catch((e)=>{
                              return 'hoi ni'

                    })


          }
          else{
                    return  'invalid OTP!'

          }
          
         

}

// -----------------------------------------send verification mail-------------------------------------------//

router.post('/sendverificationmail', async (req, res) => {
          const { email } = req.body
          const data = await user.find({ email: email })
          if (data.length > 0) {
                    let otpcode = Math.floor((Math.random() * 10000) + 1);
                    let otpdata = new otp({
                              email: email,
                              code: otpcode,
                              expire: new Date().getTime() + 100 * 1000
                    })
                    otpdata.save()
                    sendmail(email,otpcode)
                    

                    return res.status(202).send(otpdata)
          }


          return res.status(404).send("does not exist")

})

// --------------------------------------------change password-----------------------------------------------//

router.patch('/changepassword', async(req, res) => {
          const {otp_code,password} = req.body
          var changePass = await changePassword(otp_code,password)


          return res.send(changePass)


})

module.exports = router