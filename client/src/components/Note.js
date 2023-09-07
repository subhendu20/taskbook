import React, { useState } from 'react'
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useDispatch } from 'react-redux';
import { countDecrease } from '../actions/controldel&upd';
import { countIncrease } from '../actions/controldel&upd';
import { useNavigate } from 'react-router-dom'
import './css/Note.css'
import axios from 'axios'

function Note(props) {
          const dispatch = useDispatch()


          const [updatevisiblity, setupdatevisiblity] = useState(false)
          const [formdata, setformdata] = useState({ title: "", date: "", description: "", status: "", member: "" })
          const [noteid, setnoteid] = useState(null)



          const { note } = props

          const deleteitem = async (id) => {
                    axios.post(`/user/notes/delete/${id}`, {
                              withCredentials: true
                    }).then((res) => {

                              dispatch(countDecrease())
                    }).catch((e) => {

                              window.alert("error in delete item")
                    })
          }



          const change = (e) => {
                    setformdata({ ...formdata, [e.target.name]: e.target.value })
          }


          const update = (e) => {
                    setupdatevisiblity(true)
                    setnoteid(e)
          }




          const setupdate = (e) => {
                    e.preventDefault()
                    axios.put(`/user/notes/update/${noteid}`, formdata, {
                              withCredentials: true
                    }).then((res) => {
                              setnoteid(null)


                              setupdatevisiblity(false)
                              dispatch(countIncrease())
                    }

                    ).catch(async (e) => {

                    })
          }




          return (
                    <div className='Note'>
                              <form method="POST" className={!updatevisiblity ? "formupdate none" : "formupdate flex"}>

                                        <span><label htmlFor="title">title</label><input type="text" name='title' placeholder='Title' onChange={change} /></span>
                                        <span><label htmlFor="date">Due date</label><input type='date' name="date" placeholder='Date' onChange={change} /></span>
                                        <span><label htmlFor="description">Description</label><input type='text' name='description' placeholder='Description' onChange={change} /></span>
                                        <span className='button'><button type='submit' onClick={setupdate}>Update</button></span>
                              </form>



                              <div className="title">
                              {note.title}

                              </div>
                              <div className="date" >Due date- {note.date.slice(0,10)}
                              </div>
                              <div className="description">
                              {note.description}
                                        

                              </div>
                              {note.status === 'pending' ? <div className='status'>Pending <input type="checkbox" /> </div> : <div className='status-done'>Done</div>}
                             
                              <div className="button" >
                                        <button onClick={() => update(note._id)}>update<i class='bx bx-edit-alt' ></i></button>
                                        <button className='delete-btn' onClick={() => deleteitem(note._id)} >delete <i class='bx bxs-trash-alt'></i></button>

                              </div>




                    </div>
          )
}

export default Note
