import React from 'react';

import './InfoBar.css';
import {useHistory} from 'react-router-dom';
import closeIcon from '../../icons/closeIcon.png';
import onlineIcon from '../../icons/onlineIcon.png';
import auth from '../Auth/Auth';

const InfoBar = ({room}) => {
    const history = useHistory();
    const handleLogout = () => {
        auth.logout(()=> {
            console.log('logging out...');
            history.push("/");


        })
    }
    
return(
<div className = "infoBar">
    <div className = "leftInnerContainer">
        <img className = "onlineIcon" src = {onlineIcon} alt = "online"/>
        <h3>{room} </h3>
    </div>   
    <div className = "rightInnerContainer">
        <a href ="/"> <img src = {closeIcon} alt = "close" onClick={handleLogout} /></a>

    </div>
</div>
)
}

export default InfoBar;