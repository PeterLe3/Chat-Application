import React,{useState} from 'react';
import {Link,useHistory} from 'react-router-dom';
import axios from 'axios';
import  './Join.css';
const Join = () => {
    const[name,setName] = useState('');
    const [room,setRoom] = useState('');

    const history = useHistory();
    const handleSubmitClick = (e) => {
    if(name && room) {
        const payload = {
            "roomName" : room
        }
        axios.post(`http://localhost:5000/api/JoinChat`,payload)
            .then(function(response) {
                console.log(response);
                history.push(`/chat?name=${name}&room=${room}`); 
                
        
              
            })
            .catch(function(errors){
          //  let error = errors.response.data.message;
          console.log(errors);
              //  setError(errors);
            })
     
    
    }
}
    return(
        <div className =  "joinOuterContainer">
            <div className = "joinInnerContainer">
                <h1 className = "heading">Join</h1>
                <div><input placeholder="Name" className = "joinInput mt-20" type = "text" onChange = {(e) => setName(e.target.value)}/></div>
                <div> <input placeholder="Room" className = "joinInput mt-20" type = "text" onChange = {(e) => setRoom(e.target.value)}/></div>
                <Link onClick = {handleSubmitClick}>
                    <button className ="button mt-20" type = "submit"> Join Room</button>
                </Link>
            </div>

        </div>
    )
}

export default Join;