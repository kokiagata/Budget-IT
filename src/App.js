import './App.css';
import React, { useState} from 'react';
import Login from './Login';
import Register from './Register';
import Main from './Main';
import Start from './Start';
import Edit from './Edit';
import { BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';
import Axios from 'axios';






function App () {
      return (
          <Router>
          <div className='App'>
              <Switch>
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          <Route path='/' exact component={Main} />
          <Route path='/start' component={Start} />
          <Route path='/edit' component={Edit} />
          </Switch>
          </div>
          </Router>

      );
}


export default App;

    
