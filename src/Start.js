import './App.css';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Axios from 'axios';

class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userBudget: '',
      userHousing: '',
      userSavings: '',
      userInsurance: '',
      userSubscription: '',
      redirect: null,
    };
  }

   budget = async () => {
    try {
      const response = await Axios({
        method: 'POST',
        data: {
          budget: this.state.userBudget,
          housing: this.state.userHousing,
          savings: this.state.userSavings,
          insurance: this.state.userInsurance,
          subscriptions: this.state.userSubscription
        },
        withCredentials: true,
        url: 'http://localhost:3001/start',
      });
      console.log({ response });
      if (response.data === 'entered') {
        this.setState({ redirect: '/' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    } else {
      return (
        <body id="page">
          <div className="tracker">
            <p className="title">BudgetIT</p>
            <div id="formField">
              <h4>First, Register Your Monthly Budget Here!</h4>
                <input
                  type="text"
                  id="income"
                  placeholder="Enter your budget here"
                  onmouseover="pointer"
                  onChange={(e) => {
                    this.setState({ userBudget: e.target.value });
                  }}
                />
                {/*creating principle inputs to subtract from the budget first */}
                <h4>Next, Register Your Principle Expenses!</h4>
                  <input placeholder='Housing' type='text' onChange={(e) => this.setState({ userHousing: e.target.value })} />
                  <input placeholder='Savings' type='text' onChange={(e) => this.setState({userSavings: e.target.value})} />
                  <input placeholder='Insurance' type='text' onChange={(e) => this.setState({userInsurance: e.target.value})} />
                  <input placeholder='Subscription' type='text' onChange={(e) => this.setState({userSubscription: e.target.value})} />
                <button
                  type="submit"
                  value="Register"
                  className="button"
                  onClick={this.budget}
                >
                  Submit
                </button>
            </div>
          </div>
          <br />
        </body>
      );
    }
  }
}

export default Start;
