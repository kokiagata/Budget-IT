import React, {Component} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';
import Axios from 'axios';
import { Redirect } from 'react-router-dom'

class Register extends Component {
  constructor(props){
    super(props);
    this.state = {
      registerUsername: '',
      registerPassword: '',
      registerEmail: '',
      registerBudget: 0,
      redirect: null,
    }
  };

   register = async () => {
     try {
    const response = await Axios({
        method: 'POST',
        data: {
            username: this.state.registerUsername,
            password: this.state.registerPassword,
            email: this.state.registerEmail,
            budget: this.state.registerBudget,
        },
        withCredentials: true,
        url: 'http://localhost:3001/register',
    });
      console.log({ response });
      if(response.data === 'Successfully Registered'){
         this.setState({redirect: '/login'});
      }  else if(response.data === 'Empty Username'){
        alert('Registration Failed. Empty Username')
      } else if(response.data === 'Empty Password'){
        alert('Registration Failed. Empty Password')
      } else if(response.data === 'Empty Email'){
        alert('Registration Failed. Empty Email');
      } else {
        alert('Registration Failed. User with this Username already exists');
      }
  } catch (e) {
    console.log(e)
  }
}

  render(){

  if(this.state.redirect){
    return <Redirect to={this.state.redirect} />
} else {
    return (
<div className='tracker'>
<p className='title'>Budget-IT</p>
<div id='formField'>
<div id='form'>
  <form onSubmit={this.register}>
<label for='username'>User Name</label>
<input type='text' id='newUser' placeholder='UserName' required onChange={(e) => this.setState({registerUsername: e.target.value})} />
<label for='password'>Password</label>
<input type='password' id='newPassword' placeholder='Password' required onChange={(e) => this.setState({registerPassword: e.target.value})} />
<label for='email'>Email</label>
<input type='email' id='email' placeholder='Email' required onChange={(e) => this.setState({registerEmail: e.target.value})} />
<button className='button' type='submit'>Submit</button>
</form>
</div>
<div>
<ul>
  <li className='message'>Already have an account?</li>
  <li><Link to='/login'> Login here!</Link></li>
  </ul>
  </div>
  </div>
  </div>
    );
};

}
}

export default Register;