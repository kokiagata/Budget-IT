import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';

class Edit extends Component {
    constructor(props){
        super(props);
        this.state = {
            newBudget: '',
            redirect: null
        };
    }

     editBudget = async () => {
        try { 
            const response = await Axios({
            method: 'POST',
            withCredentials: true,
            url: 'http://localhost:3001/edited-budget',
            data: {
                budget: this.state.newBudget
            }
        });
        console.log({ response });
        if(response.data === 'budget edited'){
            this.setState({ redirect: '/'});
        }
    } catch(e) {
        console.log(e);
    }
        }



    render(){

        if(this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        } else {
    return (
        <body id='page'>
        <script>
        alert('You are about to change your monthly budget')
        </script>
        <div className='tracker'>
        <p className='title'>BudgetIT</p>
        <div id='formField'>
            <h4>Please enter your new monthly budget!</h4>
            <input type='text' id='income' placeholder='Enter your new budget here' onmouseover='pointer' onChange={(e) => this.setState({ newBudget: e.target.value})} />
            <button type='submit' className='button' onClick={this.editBudget}>Edit</button>
            </div>
            </div>
<br />           
        </body> 
    );
}
    }
}

export default Edit;