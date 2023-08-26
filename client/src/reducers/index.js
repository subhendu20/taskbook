import changeStatus from './subreducer1'
import changeCount from './upd&delcntrl'
import { combineReducers } from 'redux'


const rootReducer = combineReducers({
          changeStatus,
          changeCount
})



export default rootReducer