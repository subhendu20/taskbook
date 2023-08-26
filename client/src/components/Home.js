import React from 'react'
import Noteitem from './Noteitem'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import $ from 'jquery'
import "jquery-ui-dist/jquery-ui";
import './css/Home.css'
import { useNavigate } from 'react-router-dom';
import { members } from '../Lib/Memberlist '
import { default as ReactSelect } from "react-select";
// import { useCallback } from 'react'
import { Select, MenuItem, OutlinedInput, Stack, Chip, FormControl, InputLabel } from '@mui/material';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useDispatch } from 'react-redux';
import { countDecrease } from '../actions/controldel&upd';
import { countIncrease } from '../actions/controldel&upd';


function Home() {
    const logstate = useSelector((state) => state.changeStatus)
    const countstate = useSelector((state) => state.changeCount)
    const dispatch = useDispatch()


    const navigate = useNavigate()
    const [api, setapi] = useState({ article: [], loading: true })
    const [names, setnames] = useState({ names: [] })
    const[error,seterror]=useState('Please fill all the details about your task')
    const [addNote, setaddNote] = useState(false)
    //--------------------------------------fetch name list----------------------------//
    const getnamelist = () => {

        axios.get('/user/getallnames', {
            withCredentials: true

        }).then(async (res) => {

            setnames({ names: res.data })
        }).catch((e) => {



        })
    }

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


    useEffect(() => {
        getapi()
    }, [addNote, countstate,logstate])


    useEffect(() => {
        getnamelist()
    }, [])


    const [data, setdata] = useState({ userid: "", title: "", date: "", description: "", member: [] })
    const change = async (e) => {
        await setdata({ ...data, [e.target.name]: e.target.value })


    }

    //------------------------------------------post note------------------------------------------------//
    const submit = async (e) => {
        e.preventDefault()

        setaddNote(true)

        if (data.title !== '' && data.description !== '' && data.member !== [] && data.date !== '') {
            const title = data.title
            const date = data.date
            const description = data.description
            const member = data.member
            const dataapi = { title, date, description, member }



            axios.post('/user/notes/postnote', dataapi, {
                withCredentials: true
            }).then((res) => {
                setdata({ userid: "", title: "", date: "", description: "", member: [] })
                setaddNote(false)
                $('.form-input').val('')


                


            }

            ).catch(async (e) => {
                if (e.response.status === 400) {
                    await seterror('You have to login to add your task!')
                    await $('#error-addnote').toggleClass('none')
                    seterror('Please fill all the details about your note')

                


                }
            })

        }
        else {
            $('#error-addnote').toggleClass('none')


        }




    }
    const hide_error_addnote = () => {
        $('#error-addnote').toggleClass('none')

    }

    return (
        <section className='App-home'>
            <div className="content">
                <div className="content-desc">
                    <p>Where great people maintain Harder tasks</p>
                    <a href='/dashboard'>Go to dashboard</a>



                </div>
                <form method="POST" className="form">
                    <span id='error-addnote' className='none'><p>{error}</p><i class='bx bx-x' onClick={hide_error_addnote}></i></span>

                    <span>Title :<input type="text" name='title' placeholder='Title' onChange={change} className='form-input' /></span>
                    <span>Due Date :<input type='date' name="date" placeholder='Date' value="2017-06-01" onChange={change} className='form-input' /></span>
                    <span>Description :<input type='text' name='description' placeholder='Description' onChange={change} className='form-input' /></span>
                    <span> Select members: <FormControl className='span-formcontrol' size='small' fullWidth id="standard-basic" color="primary"
                        autoComplete="off" >
                        <InputLabel>Select members</InputLabel>

                        <Select className='form-input2'
                            multiple
                            value={data.member}
                            onChange={(e) => setdata({ ...data, member: e.target.value })}
                            input={<OutlinedInput label="Multiple Select" />}
                            renderValue={(selected) => (
                                <Stack gap={1} direction="row" flexWrap="wrap" >
                                    {data.member.length !== 0 && data.member.map((value) => (
                                        <Chip key={value} label={value} className='form-input2' />
                                    ))}
                                </Stack>
                            )}
                        >
                            {names.names.length !== 0 && names.names.map((name) => (
                                <MenuItem key={name} value={name} className='form-input'>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    </span>

                    <span className='button'><button type='submit' onClick={submit}>Add Note</button></span>
                </form>


            </div>
            {(!api.loading && logstate) &&  <div className="notes">
                <div className="title"><b>Your tasks</b> </div>

                {
                    !api.loading && <div className="note-items">

                        {
                            api.article.map((e) => {
                                return <Noteitem note={e} key={e._id} />
                            })
                        }




                    </div>
                }



            </div>
            }

        </section>
    )
}

export default Home
