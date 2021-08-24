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
            oldBudget: '',
            oldHousing: '',
            oldSavings: '',
            oldInsurance: '',
            oldSubscriptions: '',
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

        principleData = async () => {
            const response = await Axios({
                method: 'GET',
                withCredentials: true,
                url: 'http://localhost:3001/get-principle-data'
            });
            console.log({ response });
            this.setState({ oldHousing: response.data.housing })
            this.setState({ oldSavings: response.data.savings })
            this.setState({ oldInsurance: response.data.insurance })
            this.setState({ oldSubscriptions: response.data.subscriptions })
            this.setState({ oldBudget: response.data.budget })
        } 

        componentDidMount() {
            this.principleData()
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
            <label for='income'>Budget:</label>
            <input type='text' id='income' placeholder={this.state.oldBudget} onmouseover='pointer' onChange={(e) => {e.target.value !== '' ? this.setState({ newBudget: e.target.value}) : this.setState({ newBudget: e.target.placeholder })}} />

{/* Trying to make the below input field so when empty, placeholder can be use */}
            <h4>You can also change your principle expenses from here!</h4>
            <label for='newHousing'>Housing:</label>
            <input id='newHousing'placeholder={this.state.oldHousing} type='text' onChange={(e)=> {e.target.value !== '' ? this.setState({ newHousing: e.target.value }) : this.setState({ newHousing: Number(e.target.placeholder) })}} />
            <label for='newSavings'>Savings:</label>
            <input id='newSavings'placeholder={this.state.oldSavings} type='text' onChange={(e) => {e.target.value !== '' ? this.setState({ newSavings: e.target.value }) : this.setState({ newSavings: Number(e.target.placeholder) })}} />
            <label for='newInsurance'>Insurance:</label>
            <input id='newInsurance'placeholder={this.state.oldInsurance} type='text' onChange={(e) => {e.target.value !== '' ? this.setState({ newInsurance: e.target.value }) : this.setState({ newInsurance: Number(e.target.placeholder) })}} />
            <label for='newSubscriptions'>Subscriptions:</label>
            <input id='newSubscriptions'placeholder={this.state.oldSubscriptions} type='text' onChange={(e) => {e.target.value !== '' ? this.setState({ newSubscription: e.target.value }) : this.setState({ newSubscription: Number(e.target.placeholder) })}} />
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