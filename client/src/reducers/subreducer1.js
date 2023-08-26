const initialstate = false

const changeStatus=(state=initialstate,action)=>{
          switch(action.type){
                    case 'LOGGEDIN':return true;
                    case 'LOGGEDOUT':return false;
                    default:return state
          }

}

export default changeStatus;