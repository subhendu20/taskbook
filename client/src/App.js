
import './App.css';

import { useEffect, useState } from 'react';
import Home from './components/Home';
import $ from 'jquery'
import "jquery-ui-dist/jquery-ui";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Signup from './components/Signup';
import Login from './components/Login';
import axios from 'axios'
import Cookies from 'universal-cookie'
import Dashboard from './components/Dashboard';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useDispatch } from 'react-redux';
import { logout } from './actions';
import { login } from './actions'
import { useNavigate } from 'react-router-dom';
import logo from './kisspng-logo-5af77ccb84eeb0.3273250615261687795445.png'





function App() {
  const cookie = new Cookies()
  const navigate = useNavigate();
  const [css, setcss] = useState(false)
  const [log, setlog] = useState(false)


  const logstate = useSelector((state) => state.changeStatus)
  const dispatch = useDispatch()


  useEffect(() => {
    let vh = window.innerHeight * 0.01;

    document.documentElement.style.setProperty('--vh', `${vh}px`);
   
      window.addEventListener('orientationchange', function () {
        vh = window.innerHeight * 0.01;
    
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      })

  }, [])
  useEffect(() => {
    $(window).scroll(function () {
      var scroll = $(window).scrollTop()
      if (scroll >= 200) {
        $('nav').addClass('black')
      }
      else {
        $('nav').removeClass('black')
      }
    })
  })

  useEffect(() => {


    const check = cookie.get('signintoken')
    if (check !== undefined) {
      dispatch(login())

    }
  })



  const signout = async (e) => {


    await axios.delete('/user/logout', {
      withCredentials: true
    }).then(async (res) => {

      if (res.data === "logout") {
      
        await cookie.remove('signintoken')
        await localStorage.removeItem('signintoken')
        $('#warning-logout').toggleClass('none')

        dispatch(logout())
        navigate('/')
}
}).catch((e) => {


    })

  }

  const view_signup=()=>{
    $('#warning-logout').toggleClass('none')
  }



  const hide_signout_popup=()=>{
    $('#warning-logout').toggleClass('none')

  }



  return (
    
      <div className="App">
        <span id="warning-logout" className='none'>
          <p>Do you want to Sign out</p>
          <span className="buttons"><button onClick={signout}>Log out</button>
          <button onClick={hide_signout_popup}>Cancel</button></span>

        </span>
        <header>
        <nav className="nav">
          <div className="logo">
            <img src={logo} alt="logo" />

          </div>
          <div className="menu">
            {(logstate === false) ? <span ><a href="/signup" className='block'>Sign up</a></span> : <span onClick={view_signup}><p>Sign out</p></span>}


            <span><a href="/" className='menu-lite'><i class='bx bx-home'></i></a></span>
          </div>

        </nav>
        </header>
        <Routes className="route">
          <Route path='/' element={<Home />} />
          <Route path='/dashboard' element={<Dashboard />} />

          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />




        </Routes>
      </div>
    

  );
}

export default App;
