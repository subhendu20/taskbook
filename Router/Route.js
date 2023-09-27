const express = require('express')
const router = express.Router()
const cors = require('cors')
const user = require('../schema/user')
const auth = require('bcryptjs')
const dotenv = require('dotenv').config()
const JWT = require('jsonwebtoken')
const cookie = require('cookie-parser')
const jwttk = process.env.TOKEN




router.use(cookie())
router.use(cors({
          origin: 'http://localhost:3000',
          methods: ['POST', 'PUT', 'GET','DELETE','OPTIONS', 'HEAD'],
          credentials: true
}))

//-------------------------------------------sign up-------------------------------------------------------------//
router.post('/signup', async (req, res) => {

          try {
                    const { name, email, dob, mobile, password, confirmpassword } = req.body
                    console.log(hashed)
                    if (password == !confirmpassword) {
                              return res.status(400).send("invalid password")
                    }
                    else {
                              const newuser = await new user({
                                        name, email, dob, mobile, password: hashed, confirmpassword: hashed
                              })

                              newuser.save().then(() => {
                                        res.send(newuser)
                              }).catch((e) => {
                                        console.log(e)
                              })



                    }



          } catch (error) {
                    res.send(error)

          }



})

//------------------------------------fetch names----------------------------------------//

router.get('/getallnames',async(req,res)=>{
          try {
                    const getcookie = await req.cookies.signintoken
                    var names = []
                    if (!getcookie) {
                              return res.status(400).send([{}])
                    }
                    const check = await JWT.verify(getcookie, jwttk)
                    if (!check) {
                              return res.send("you are logged out")
                    }
                    const data = await user.find({})
                    const data2 = await user.findById(check)
                    console.log(data2.name)
                    await data.forEach(e => {
                              if(e.name!=data2.name){
                                        names.push(e.name)

                              }
                              
                              
                    });
                    console.log(names)
                    res.status(200).send(names)

          } catch (error) {
                    res.send(error)

          }
         

})
//----------------------------------------log in-------------------------------------------------------------//
router.post('/login', async (req, res) => {




          const { mobile, password } = req.body
          const a = await user.findOne({ mobile })




          if (!a) {
                    return res.status(400).send("invalid")
          }
          const passwordcheck = await auth.compare(password, a.password)

          if (!passwordcheck) {
                    return res.status(400).send("invalid pasword")
          }

          const cookie = await JWT.sign(a.id, jwttk)


          const cok = await res.cookie("signintoken", cookie).send("done")


          









})
router.delete('/logout', async (req, res) => {
          const getcookie = await req.cookies.signintoken
          if (!getcookie) {
                    console.log(getcookie)
                    return res.status(400).send("Logged out")
          }

          res.clearCookie('signintoken').send("logout")


})


























module.exports = router;