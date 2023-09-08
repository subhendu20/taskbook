import React from 'react'
import './css/Login.css'
import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie'
import { useSelector} from 'react-redux/es/hooks/useSelector';
import { useDispatch } from 'react-redux';
import { login } from '../actions';
import $ from 'jquery'
import "jquery-ui-dist/jquery-ui";


function Login() {
  
  const dispatch = useDispatch()
  
          const navigate = useNavigate()

          const [formdata, setformdata] = useState({mobile: "", password: ""})
          const change = (e) => {
                    setformdata({ ...formdata, [e.target.name]: e.target.value })
          }



          const submit = async(e) => {

                    e.preventDefault()
                   
                    const mobile = formdata.mobile
                    const password = formdata.password
                    

                    const data = { mobile, password}
                    await axios.post('/user/login', data,{
                              headers: {
                                'Content-Type': 'application/json'
                              },
                              withCredentials: true
                            }).then(async() => {
                              await navigate('/')
                              await localStorage.setItem('signintoken',`true`)
                              dispatch(login())
                              
                             
                              
                            })
                            .catch(err => {
                              
                              if(err.response.status===400){
                                        
                                        $('#error-login').toggleClass('none')

                              }
                            
                              
                    
                            });
          }

          const hide_error_logwarn=()=>{
            $('#error-login').toggleClass('none')

          }

          return (
                    <section className='main'>
                              <form className="form" onSubmit={submit}>
                                <span id='error-login' className='none'><p>Invalid details</p><i class='bx bx-x' onClick={hide_error_logwarn}></i></span>
                                        <span><label htmlFor="mobile">Mobile</label><input type="Number" autocomplete="off" value={formdata.mobile} placeholder="Enter Mobile Number" name="mobile" onChange={change} /></span>
                                        <span><label htmlFor="password">Password</label><input type="password" autocomplete="off" value={formdata.password}  placeholder="Enter password" name="password" onChange={change} /></span>
                                        <span className='button'><button type='submit'>Log in</button></span>
                                        <span className='signuplink'><p>Don't have an Account?</p><Link to="/signup">Sign up</Link></span>

                              </form>

                    </section>
          )
}


export default Login
