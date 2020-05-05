import React from 'react';
import auth from '../Auth/Auth';

import {Route,Redirect} from 'react-router-dom';
export const ProtectedRoute = ({component:Component,...rest}) => {
    return(
        <Route 
            {...rest} 
            render = {(props) => {
                    console.log("Auth is:", auth.isAuth());
                    if(auth.isAuth()){
                       
                        setTimeout(3000);
                        return <Component{...props}/>;
                    }
                    else{
                        setTimeout(3000);
                        return<Redirect to={
                        {
                            pathname:"/",
                            state: {
                                from: props.location
                            }
                        }
                        }/>
                    }
            }}
        />
    );
 };