import React from 'react';

import {BrowserRouter as Router, Route,Switch} from 'react-router-dom';


/**
 * When user lands on page, greeted with Join Component, data will be passed into login form and querstring, which goes into /chat
 * Once we have data, we render Chat component
 */

import Join from './components/Join/Join';
import Login from './components/Registration/Login';
import Register from './components/Registration/Register'

import Chat from './components/Chat/Chat';

const App = () => (
    <Router>


    
    <Switch>
        <Route path ="/" exact component = {Login}/>
        <Route path ="/Register" component= {Register}/>
        <Route path ="/Join" component= {Join}/>
        <Route path ="/chat" component = {Chat}/>
    </Switch>
    </Router>
);

export default App;