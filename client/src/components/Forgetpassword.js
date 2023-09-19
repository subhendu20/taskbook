import React, { useState } from 'react'
import axios from 'axios'
import './css/Forgetpass.css'
import { Link } from 'react-router-dom'
import $ from 'jquery'
import "jquery-ui-dist/jquery-ui";
function Forgetpassword() {
          const [formdata, setformdata] = useState({
                    email: '',
                    otp: '',
                    password: '',
                    repassword: ''
          })





          const [formStatus, setformStatus] = useState({
                    emailform: true,
                    otpform: false,
                    passchange: false,
                    complete: false

          })

          const change = (e) => {
                    setformdata({ ...formdata, [e.target.name]: e.target.value })
          }

          const submit_email = async (e) => {
                    e.preventDefault()
                    axios.post('/user/verification/sendverificationmail', { email: formdata.email }, {
                              withCredentials: true
                    }).then(() => {
                              setformStatus({
                                        emailform: false,
                                        otpform: true,
                                        passchange: false,
                                        complete: false

                              })
                    }).catch((e) => {
                              console.log(e)
                    })
          }




          const submit_otp = (e) => {
                    e.preventDefault()

                    setformStatus({
                              emailform: false,
                              otpform: false,
                              passchange: true,
                              complete: false

                    })

          }
          const submit_new_pass = (e) => {
                    e.preventDefault()
                    if (formdata.password === formdata.repassword) {
                              axios.patch('/user/verification/changepassword', {
                                        otp_code: formdata.otp,
                                        password: formdata.password
                              }, {
                                        withCredentials: true
                              }).then(() => {
                                        setformStatus({
                                                  emailform: false,
                                                  otpform: false,
                                                  passchange: false,
                                                  complete: true
                                        })

                              }).catch((e) => {
                                        alert(e)

                              })

                    }
                    else {
                              $('#warning-submit').toggleClass('none')
                    }



          }

          const hide_error_submit = () => {
                    $('#warning-submit').toggleClass('none')

          }
          return (
                    <section className='fg-pass'>


                              {(formStatus.emailform) && <form className='form' onSubmit={submit_email}>
                                        <p>Enter tour registered email address</p>
                                        <input type='email' required placeholder='Enter your email' name='email' onChange={change} />
                                        <button type='submit'>Send verification code</button>
                              </form>}
                              {(formStatus.otpform) && <form className='form' onSubmit={submit_otp}>
                                        <p>Enter verification code (otp) <br /> *An email with code has been sent to - <b>{formdata.email}</b> </p>
                                        <input type='text' required placeholder='Enter OTP' name='otp' onChange={change} />
                                        <button type='submit'>Submit</button>
                              </form>}



                              {(formStatus.passchange) && <form className='form' onSubmit={submit_new_pass}>
                                        <div id="warning-submit" className='none'>
                                                  <p>  Passwords are not same!</p><i class='bx bx-x' onClick={hide_error_submit}></i>
                                        </div>
                                        <p>Enter new password</p>
                                        <input type='password' required placeholder='Enter password' name='password' onChange={change} />
                                        <input type="password" required placeholder='Re-enter password' name='repassword' onChange={change} />
                                        <button type='submit'>Submit</button>
                              </form>}
                              {(formStatus.complete) && <form className='form'>
                                        <p><b>You've succsessfully changed your password!</b></p>
                                        <i class='bx bxs-like'></i>
                                        <p>Go to login page <Link to='/login'>Login</Link></p>


                              </form>}


                    </section>
          )
}

export default Forgetpassword
