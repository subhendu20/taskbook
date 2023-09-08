import React from 'react'
import './css/Signup.css'
import './css/Signup2.css'
import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import $ from 'jquery'
import "jquery-ui-dist/jquery-ui";


function Signup() {
          const navigate = useNavigate()

          const[formdata,setformdata]=useState({name:"",email:"",dob:"",mobile:"",password:"",confirmpassword:""})
          const change =(e)=>{
                    setformdata({...formdata,[e.target.name]:e.target.value})
          }

          const handlesubmit=(e)=>{
                    e.preventDefault()
                    try {

                              if(formdata.name!=='' && formdata.email!=='' && formdata.area!=='' && formdata.state!=='' && formdata.mobile!==null && formdata.password!=='' && formdata.confirmpassword!=='' && formdata.password===formdata.confirmpassword){
                                        const name = formdata.name
                                        const email = formdata.email
                                        const dob = formdata.dob
                                        const mobile = formdata.mobile
                                        const password = formdata.password
                                        const confirmpassword = formdata.confirmpassword
                    
                                        const data = {name,email,dob,mobile,password,confirmpassword}
                                        axios.post('/user/signup',data).then((res) => {
                                                  
                                                  navigate('/login')
                                                  
                    
                                        }
                    
                                        ).catch((e)=>{
                                                  
                                        })

                              }else{
                                        $('#error-signup').toggleClass('none')
                                        
                              }
                             
                  

                              
                    } catch (error) {
                              
                              
                              
                    }
                    



          }

          const hide_error=()=>{
                    $('#error-signup').toggleClass('none')

          }
          
          return (
                    <section className='main'>
                              <form className="form" onSubmit={handlesubmit}>
                                        <span id="error-signup" className='none'>
                                                  <p>Please fill the form correctly</p><i onClick={hide_error} class='bx bx-x'></i>
                                        </span>
                                        <span><label htmlFor="name">Name</label><input autocomplete="off" type="text" value={formdata.name} name="name" onChange={change} required minLength={5} /></span>
                                        <span><label htmlFor="email">Email</label><input autocomplete="off" type='email' value={formdata.email} name="email" onChange={change} /> </span>
                                        <span><label htmlFor="dob">D.O.B</label><input autocomplete="off" type="date" name="dob" value={formdata.dob} onChange={change} required/> </span>
                                        <span><label htmlFor="mobile">Mobile</label><input autocomplete="off" type="text" name="mobile" value={formdata.mobile} onChange={change} required minLength={10}/> </span>
                                        <span><label htmlFor="password">Password</label><input autocomplete="off" type="password" name="password" value={formdata.password} onChange={change} required minLength={5} maxLength={15} /> </span>
                                        <span><label htmlFor="confirmpassword">Confirm password</label><input autocomplete="off" type="password" value={formdata.confirmpassword} name="confirmpassword" onChange={change} required/> </span>
                                        <span className='button'><button type='submit' >Sign Up</button></span>
                                        <span className='message'>Have an Account <Link to="/login">Log In</Link></span>


                              </form>

                    </section>
          )
}

export default Signup
