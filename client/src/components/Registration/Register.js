import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import  './Login.css';

import Alert from '../Alert/Alert';
const Register = () => {

    const history = useHistory();
    const [room,setRoom] = useState('');

    const [register,setRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password,setPassword] = useState('');
    const[name,setName] = useState('');

    const[error,setError] = useState('');

    const validInput = (payload) => {
        let emailRegex =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var passRegex=  /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[#?!@$%^&*\-_]).{7,}$/;
        if(!(emailRegex.test(payload.email))) {
            setError("Invalid Email Format");
            return false;  
        }
        if(!(passRegex.test(payload.password))) {
            setError("Password needs to contain at least 7 characters, include at least 1 special character and 1 capital letter");
            return false;
        }
        return true;

    }

    const handleSubmitClick = (e) => {
        const payload = {
            "email" : email,
            "name":name,
            "password": password
        }
        if(validInput(payload)) {
          
        
        axios.post(`http://localhost:5000/api/register`,payload)
            .then(function(response) {
                console.log()
              setRegister(true);

            })
            .catch(function(errors){
                let error = errors.response.data.message;
                setError(error);
                
            })
        if({register}) {
            console.log('redirecting...');
            history.push("/"); 
        }
    }

    }
    return(
        <div className =  "joinOuterContainer">
            <div className = "joinInnerContainer">
                <h1 className = "heading">Register</h1>
                <div> Email <input placeholder="Enter Email" className = "joinInput mt-20" type = "text" onChange = {(e) => setEmail(e.target.value)}/></div>
                <div> Password <input placeholder="Enter Password" className = "joinInput mt-20" type = "password" onChange = {(e) => setPassword(e.target.value)}/></div>
                <div> Name <input placeholder="Enter Name" className = "joinInput mt-20" type = "text" onChange = {(e) => setName(e.target.value)}/></div>
              
                
                    <button className ="button mt-20" type = "submit" onClick = {handleSubmitClick}> Sign up</button>
                    <p> Already have an account? <Link to = "/"> Login </Link></p>

                   <Alert error ={error}/>
                    
            </div>

        </div>
        
    )
}

export default Register;