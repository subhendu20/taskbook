const express = require('express')
const router = express.Router()
const cors = require('cors')
const user = require('../schema/user')
const note = require('../schema/note')
const auth = require('bcryptjs')
const dotenv = require('dotenv').config()
const JWT = require('jsonwebtoken')
const cookie = require('cookie-parser')
const jwttk = process.env.TOKEN

router.use(cookie())
router.use(cors({
          origin: 'http://localhost:3000',
          methods: ['POST', 'PUT', 'GET','OPTIONS', 'HEAD'],
          credentials: true
}))

function removeDuplicates(arr) {
          return arr.filter((item,
              index) => arr.indexOf(item) === index);
      }

// --------------------------------------------------------end points-----------------------------------------------------//


// ---------------------------------post note--------------------------------//
router.post('/postnote', async (req, res) => {
          try {
                    const { title, description, date} = req.body

                    const getcookie = await req.cookies.signintoken

                    if (!getcookie) {
                              return res.status(400).send("you have too logged in first")
                    }
                    
                    const check = await JWT.verify(getcookie, jwttk)
                    if (!check) {
                              return res.send("you are logged out")
                    }


                    const newnote = new note({
                              userid: check, title, description, date,status:"pending"
                    })
                    newnote.save().then(() => {
                              console.log(newnote)
                              res.send(newnote)
                              
                    }).catch((e) => {
                              console.log(e)
                    })



          } catch (error) {
                    res.send(error)

          }
        

})
// ----------------------------------fetch note-------------------------------//
router.get('/fetchnote', async (req, res) => {
          try {
                    const getcookie = await req.cookies.signintoken
                    if (!getcookie) {
                              return res.status(400).send([{}])
                    }
                    const check = await JWT.verify(getcookie, jwttk)
                    if (!check) {
                              return res.send("you are logged out")
                    }
                    const data = await note.find({ userid: check })

                    const formattedData = data.map((item) => ({
                        _id: item._id,
                        userid:item.userid,
                        status:item.status,
                        title: item.title,
                        date: item.date.toISOString().split('T')[0], 
                        description: item.description,
                        
                      }));



                    





                    res.status(200).send(formattedData)

          } catch (error) {
                    res.send(error)

          }
         
})
// --------------------------------update note-------------------------------//
router.put('/update/:id', async (req, res) => {
          try {
                    const { title, description, date } = req.body
                    const getcookie = await req.cookies.signintoken
                    if (!getcookie) {
                              return res.status(400).send("logged out")
                    }
                    const check = await JWT.verify(getcookie, jwttk)
                    if (!check) {
                              return res.send("you are logged out")
                    }
                    const find = await note.findById(req.params.id)
                    find.title = title
                    find.date=date
                    find.description= description
                    find.status = find.status
                    

                    find.save().then(() => {
                              res.send(find)
                    }).catch((e) => {
                              console.log(e)
                    })

                    
          } catch (error) {
                    console.log(error)
          }
})
//----------------------------------delete note------------------------------//

router.post('/delete/:id',async (req, res) => {
          try {
                    // const getcookie = await req.cookies.signintoken
                    // if (!getcookie) {
                    //           return res.send("you have too logged in first")
                    // }
                    // const check = await JWT.verify(getcookie, jwttk)
                    // if (!check) {
                    //           return res.send("invalid request")
                    // }
                    const del = await note.findByIdAndDelete(req.params.id)
                    const data = await note.find({})
                    console.log(del)
                    res.send(data)


          } catch (e) {
                    console.log("naaa")
          }
})

//------------------------------------------update status----------------------------------//
router.patch('/updatestatus/:id', async (req, res) => {
    
          try {


                
                    console.log(req.params.id)
                    const getcookie = await req.cookies.signintoken
                    if (!getcookie) {
                              return res.status(400).send("logged out")
                              console.log('find')
                    }
                    const check = await JWT.verify(getcookie, jwttk)
                    if (!check) {
                              return res.send("you are logged out")
                    }
                   console.log(check)
                    const find = await note.findById(req.params.id)
                    
                    find.status = 'done'
                  

                   

                    

                    find.save().then(() => {
                        console.log(find)
                              res.send(find)
                    }).catch((e) => {
                              console.log(`ye hai ${e}`)
                    })

                    
          } catch (error) {
                    console.log(`ye hai ${error}`)
          }
})
//----------------------------------------Status map---------------------------------//
router.get('/fetchstatus', async (req, res) => {
          try {
                    var done = 0
                    var pending = 0
                    const getcookie = await req.cookies.signintoken
                    if (!getcookie) {
                              return res.status(400).send([{}])
                    }
                    const check = await JWT.verify(getcookie, jwttk)
                    if (!check) {
                              return res.send("you are logged out")
                    }
                    const data = await note.find({ userid: check })
                    data.forEach(e => {
                              if(e.status=='pending'){
                                        pending++;
                              }
                              if(e.status=='done'){
                                        done++;

                              }
                    });
                    res.status(200).send({pending:pending,done:done})

          } catch (error) {
                    res.send(error)

          }
         
})

router.get('/fetchcompanion',async(req,res)=>{
          try {
                    var names = []
                    var finallist = []
                    const getcookie = await req.cookies.signintoken
                    if (!getcookie) {
                              return res.status(400).send([{}])
                    }
                    const check = await JWT.verify(getcookie, jwttk)
                    if (!check) {
                              return res.send("you are logged out")
                    }
                    const data = await note.find({ userid: check })
                    await data.forEach(async(e) => {
                             await e.members.forEach(async(x)=>{
                              await names.push(x)
                             })
                    });
                    console.log(names)

                    var namelist = await removeDuplicates(names)
                   

                    await namelist.forEach(async(e)=>{
                              var time = 0
                              await data.forEach(async(x)=>{
                                        if(x.members.indexOf(e)!==-1){
                                                  time++
                                        }
                              })

                              finallist.push({name:e,occurs:time})


                    })








                    res.status(200).send(finallist)

          } catch (error) {
                    res.send(error)

          }
         

})







module.exports = router


