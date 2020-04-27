import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import {useHistory} from 'react-router-dom';
import  './Login.css';
import axios from 'axios';
import Alert from '../Alert/Alert';

const Login = () => {
    const history = useHistory();
    const[name,setName] = useState('');
    const [room,setRoom] = useState('');

    const [logIn,setLogIn] = useState(false);

    const[error,setError] = useState('');
    const [email, setEmail] = useState('');
    const [password,setPassword] = useState('');
    const handleSubmitClick = (e) => {
        const payload = {
            "email" : email,
            "password": password
        }
        axios.post(`http://localhost:5000/api/login`,payload)
            .then(function(response) {
                setLogIn(true);
            })
            .catch(function(errors){
                let error = errors.response.data.message;
                setError(error);
            })
        if({logIn}){
            console.log('redirecting...');
            history.push("/Join"); 
        }
    }
    return(
        <div className =  "joinOuterContainer">
            <div className = "joinInnerContainer">
                <h1 className = "heading">Login</h1>
                <div> Email <input placeholder="Enter Email" className = "joinInput mt-20" type = "text" onChange = {(e) => setEmail(e.target.value)}/></div>
                <div> Password <input placeholder="Enter Password" className = "joinInput mt-20" type = "password" onChange = {(e) => setPassword(e.target.value)}/></div>
                
                    <button className ="button mt-20" type = "submit" onClick = {handleSubmitClick}> Log In</button>
                   
                    <p> Don't have an account? <Link to = "/Register"> Register </Link></p>
                   <Alert error = {error}/>
                 
            
            </div>

        </div>
        
    )
}

export default Login;