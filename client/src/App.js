
import './App.css';

import { useEffect, useState } from 'react';
import Home from './components/Home';
import $ from 'jquery'
import "jquery-ui-dist/jquery-ui";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Signup from './components/Signup';
import Login from './components/Login';
import axios from 'axios'
import Cookies from 'universal-cookie'

import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useDispatch } from 'react-redux';
import { logout } from './actions';
import { login } from './actions'
import { useNavigate } from 'react-router-dom';
import logo from './kisspng-logo-5af77ccb84eeb0.3273250615261687795445.png'
import Forgetpassword from './components/Forgetpassword';





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


    window.addEventListener('resize', function () {
      if (window.innerHeight > 600) {
        vh = window.innerHeight * 0.01;

        document.documentElement.style.setProperty('--vh', `${vh}px`);


      }





    })





  }, [])


  useEffect(() => {
    $(window).scroll(function () {
      var scroll = $(window).scrollTop()
      if (scroll >= 100) {
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

  const view_signup = () => {
    $('#warning-logout').toggleClass('none')
  }



  const hide_signout_popup = () => {
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
          <span className="logo">
            Taskbook

          </span>
          <span className="menu">
            {(!logstate) ? <span ><Link to="/">Home</Link> <Link to='./login'>Sign in</Link>   <Link id='add-task' to="/signup">Add Your First task</Link></span>
              :
              <span >
                <Link to="/">Home</Link>

                <button onClick={view_signup}>Sign out</button></span>}



          </span>

        </nav>
      </header>
      <Routes className="route">
        <Route path='/' element={<Home />} />


        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/changepassword' element={<Forgetpassword/>}/>




      </Routes>
    </div>


  );
}

export default App;
