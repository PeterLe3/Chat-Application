import React, {useState} from 'react';


const Alert = (props)=> {
    const[display,setDisplay] = useState('none');


    return (
        <div className = "text-danger">
            {props.error}
        </div>
    )
}

export default Alert;


