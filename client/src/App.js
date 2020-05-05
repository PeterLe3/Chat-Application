import React from 'react';
import Cookies from 'js-cookie';
import {BrowserRouter as Router, Route,Switch,Redirect} from 'react-router-dom';
import {ProtectedRoute} from './components/ProtectedRoute/ProtectedRoute';
import Auth from './components/Auth/Auth';


/**
 * When user lands on page, greeted with Join Component, data will be passed into login form and querstring, which goes into /chat
 * Once we have data, we render Chat component
 */

import Join from './components/Join/Join';
import Login from './components/Registration/Login';
import Register from './components/Registration/Register'

import Chat from './components/Chat/Chat';
var bool = true;


const App = () => (
    <Router>
    
    <Switch>
        <Route path ="/" exact component = {Login}/>
        <Route path ="/Register" component= {Register}/>
        <ProtectedRoute path ="/Join" component= {Join}/>
        <ProtectedRoute path ="/chat" component = {Chat}/>
    </Switch>
    </Router>
);

export default App;