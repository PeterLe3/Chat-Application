import React from 'react';
import auth from '../Auth/Auth';

import {Route,Redirect} from 'react-router-dom';
export const ProtectedRoute = ({component:Component,...rest}) => {
    console.log(rest.path);
 
    return(
        <Route 
            {...rest} 
            render = {(props) => {
                    console.log("Auth is:", auth.isAuth());
                    if(rest.path =="/") {
                        if(auth.isAuth()) {
                            return<Redirect to={
                            {
                                pathname:"/Join",
                                state: {
                                    from: props.location
                                }
                            }
                            }/>

                        }
                        else {
                            return <Component{...props}/>;
                        }
                    }
                    else{
                    if(auth.isAuth()){
                        
                        return <Component{...props}/>;
                    }
                    else{
                        return<Redirect to={
                        {
                            pathname:"/",
                            state: {
                                from: props.location
                            }
                        }
                        }/>
                    }
                }
            }}
        />
    );
 };