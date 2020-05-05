import React, {useState, useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import  './Chat.css';

import Input from '../Input/Input';
import InfoBar from '../InfoBar/InfoBar';
import Messages from '../Messages/Messages'
import TextContainer from '../TextContainer/TextContainer'

let socket;

const Chat = ({location}) => {
    const[users, setUsers] = useState('');
    const [name,setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'localhost:5000';
    // useEffect is similar to ComponentMount and ComponentUpdate
    //specify useEFfect to be called only if values in ENDpoint or location.serach change
    useEffect(()=> {
        const {name, room} = queryString.parse(location.search);
        socket = io(ENDPOINT);
        setName(name);
        setRoom(room);
    
        // same thing as {name;name, room:room}
        // emit name and room to the join event
        //can have callback after an event occured
        socket.emit('join', {name,room}, ()=> {

        });
        //provide a return function similar to unmounting
        return () => {
            socket.emit('disconnect');
            //turns off that one instance of socket to off
            socket.off();

        }
      
    },[ENDPOINT,location.search]);
    // effect hook only gets called when messages list change
    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message])

        })
    },[messages])

    useEffect(() => {
        socket.on("roomData", ({ users }) => {
            setUsers(users);
          });

    },[]);
    //function for sending messages
    const sendMessage = (e) =>{
        e.preventDefault();
        if(message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
       
    }
 //   console.log(message, messages);
 //   console.log(usersInRoom);
       

    return(
        <div className = "outerContainer">
            <div className = "innerContainer">
                <InfoBar room = {room}/>
                <Messages messages = {messages} name = {name}/>
                <Input message = {message} setMessage = {setMessage} sendMessage = {sendMessage}/>
               
            </div>
            <TextContainer users={users}/>
        </div>
    )
}

export default Chat;