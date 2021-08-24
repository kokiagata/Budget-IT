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
            newHousing: '',
            newSavings: '',
            newInsurance: '',
            newSubscription: '',
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
                budget: this.state.newBudget,
                newHousing: this.state.newHousing,
                newSavings: this.state.newSavings,
                newInsurance: this.state.newInsurance,
                newSubscription: this.state.newSubscription,
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
        <div className='tracker'>
        <p className='title'>BudgetIT</p>
        <div id='formField'>
            <h4>Please enter your new monthly budget!</h4>
            <input type='text' id='income' placeholder='Enter your new budget here' onmouseover='pointer' onChange={(e) => this.setState({ newBudget: e.target.value})} />

{/* Moved the principle expenses out of the array, so now it should be easier to make an edit page to edit principle expenses */}
            <h4>You can also change your principle expenses from here!</h4>
            <input placeholder='Housing (optional)' type='text' onChange={(e)=> this.setState({ newHousing: e.target.value })}/>
            <input placeholder='Savings (optional)' type='text' onChange={(e) => this.setState({ newSavings: e.target.value })}/>
            <input placeholder='Insurance (optional)' type='text' onChange={(e) => this.setState({ newInsurance: e.target.value })}/>
            <input placeholder='Subscription (optional)' type='text' onChange={(e) => this.setState({ newSubscription: e.target.value })}/>
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