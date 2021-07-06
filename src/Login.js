import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Route, Link, Router, Switch} from 'react-router-dom';
import Axios from 'axios';
import { Redirect} from 'react-router-dom';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loginUsername: '',
            loginPassword: '',
            redirect: null
        }
    };

    login = async () => {
        try { 
            const response = await
        Axios({
          method: 'POST',
          data: {
              username: this.state.loginUsername,
              password: this.state.loginPassword,
          },
          withCredentials: true,
          url: 'http://localhost:3001/login',
      });
        console.log({ response });
        if (response.data === 'Success') {  
      		this.setState({redirect: '/'});
        } else if(response.data === 'Success no budget'){
            this.setState({redirect: '/start'});
        } else {
        	alert('Invalid credentials')
        }
    } catch (e) {
        console.log(e);
    }
  };


    render(){

        if(this.state.redirect){
            return <Redirect to={this.state.redirect} />
        } else {        
    return (
<div className='tracker'>
<p className='title'>BUDGET-IT</p>
<h1>Welcome!</h1>
<h2>Login to your account</h2>
<div id='formField'>
<div>
<ul>
</ul>
</div>
<div id='form'>
<label for='username'>Username</label>
<br />
<input type='text' id='username' placeholder='Username' onChange={(e) => {this.setState({loginUsername: e.target.value})}} />
<br />
<label for='password'>Password</label>
<br />
<input type='password' id='password' placeholder='Password' onChange={(e) => {this.setState({loginPassword: e.target.value})}} />
<br />
<button type='submit' value='Login' className='button' onClick={this.login}>Login</button>
<div>
<ul>
<li className='message'>Don't have an account yet?</li>
<li><Link to='/register'> Register here!</Link></li>
</ul>
</div>
</div>
</div>
</div>

    )
}
    }
}





export default Login;