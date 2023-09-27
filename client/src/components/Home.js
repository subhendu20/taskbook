import React from 'react'

import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import $ from 'jquery'
import "jquery-ui-dist/jquery-ui";
import './css/Home.css'
import { Link, useNavigate } from 'react-router-dom';

import { default as ReactSelect } from "react-select";
// import { useCallback } from 'react'

import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useDispatch } from 'react-redux';

import { countIncrease } from '../actions/controldel&upd';
import Note from './Note'


function Home() {
    const logstate = useSelector((state) => state.changeStatus)
    const countstate = useSelector((state) => state.changeCount)
    const dispatch = useDispatch()


    const navigate = useNavigate()
    //------------------------------------states---------------------------------------//
    const [api, setapi] = useState({ article: [], loading: true })
   
    const[error,seterror]=useState('Please fill all the details about your task')
    const [addNote, setaddNote] = useState(false)
    const[status,setstatus]=useState({pending:0,done:0})

    

    

    //--------------------------------------fetch tasks---------------------------------//
    const getapi = () => {

        axios.get('/user/notes/fetchnote', {
            withCredentials: true
        }).then(async (res) => {
            if (res.status === 200) {
                setapi({ article: res.data, loading: false })
            }
            if (res.status === 400) {
                setapi({ article: [], loading: true })
            }
        }).catch((e) => {
        })
    }


  


   

    const [data, setdata] = useState({ userid: "", title: "", date: "", description: ""})
    const change = (e) => {
        setdata({ ...data, [e.target.name]: e.target.value })


    }

    const change_date=(e)=>{
        setdata({
            ...data,
            date: e.target.value,
          });

    }

    //------------------------------------------post tasks------------------------------------------------//
    const submit_task = async (e) => {
        e.preventDefault()

        setaddNote(true)

        if (data.title !== '' && data.description !== ''&& data.date !== '') {
            const title = data.title
            const date = data.date
            const description = data.description
           
            const dataapi = { title, date, description}



            axios.post('/user/notes/postnote', dataapi, {
                withCredentials: true
            }).then(async(res) => {
                if(res.data==='you have too logged in first'){
                    await seterror('You have to login to add your task!')
                    $('#error-addnote').toggleClass('none')

                }
                else{
                    dispatch(countIncrease())
                    $('.form-input').val('')

                }
                


                


            }

            ).catch(async (e) => {
                
            })

        }
        else {
            await seterror('Please fill all the details about your task')
            $('#error-addnote').toggleClass('none')


        }




    }
    //----------------------------------------------fetch status--------------------------------------------//
    const getstatus =()=> {

        axios.get('/user/notes/fetchstatus', {
            withCredentials: true
        }).then(async (res) => {
            if (res.status === 200) {
                
                setstatus({ pending: res.data.pending, done: res.data.done })

            }
            if (res.status === 400) {
                setapi({ pending: 0,  done: 0 })

            }
        }).catch((e) => {
    

        })
    }
    //------------------------------------------- mount component-------------------------------------------//
    useEffect(() => {
        getapi()
        getstatus()
    }, [addNote, countstate,logstate])




    const hide_error_addnote = () => {
        $('#error-addnote').toggleClass('none')

    }

    return (
        <main className='App-home'>
            <section className="content">
                {!logstate && <div className="content-desc">
                    <h1>TaskBook</h1>
                    <h3>Add your Task and track your activity</h3>
                    <p>Streamline your daily tasks and enhance productivity with our intuitive task app. Effortlessly organize, prioritize, and track your to-do lists for a more efficient workflow</p>
                    
             <Link to='/login'>Add your first task <i class='bx bx-chevron-right'></i></Link>



                </div>
}
                {/* ------------------------------------add task form-------------------------------------------*/}

                {logstate && <section class='form-section'>
                    <h3>Add your task here</h3>
                    <form method="POST" className="form" onSubmit={submit_task}>
                    <span id='error-addnote' className='none'><p>{error}</p><i class='bx bx-x' onClick={hide_error_addnote}></i></span>

                    <span><label htmlFor="title">Title</label><input type="text" name='title' placeholder='Title' onChange={change} className='form-input' minLength={3} required/></span>
                    <span><label htmlFor="date">Due date</label><input type='date' name="date"  onChange={change_date} className='form-input' required /></span>
                    <span><label htmlFor="description">Description</label><input type='text' name='description' placeholder='Description' onChange={change} className='form-input' minLength={10} required/></span>
                    

                    <span className='button'><button type='submit'>Add Task</button></span>
                </form>
                <div className="track-tasks">
                              <span>
                              <i class='bx bxs-user-check'></i>
                              <p  className='count'>Done</p>
                              <p>{status.done}</p>

                              </span>

                              <span>
                              <i class='bx bx-loader-circle'></i>
                              <p className='count'>Pending</p>
                              <p>{status.pending}</p>

                              </span>

                    </div>
                </section>
               
                }

                {
                    (logstate ) && <div className="tasks">
                        {
                            !api.loading ? api.article.map((e) => {
                                return <Note note={e} key={e._id} />
                            }):<div className='tasks-msg'>No Task </div>
                        }

                    </div>
                }

            </section>
           

        </main>
    )
}

export default Home
