import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';
import Edit from './Edit';
import { Redirect } from 'react-router-dom';
import Axios from 'axios';
import { transformAuthInfo } from 'passport';
import * as AiIcons from 'react-icons/ai';




class Main extends Component {
  constructor(props){
    super(props);
    this.state = {
      redirect: null,
      registeredBudget: 0,
      remainingBudget: 0,
      additionalExpenses: 0,
      totalExpenses: '',
      enteredExpense: '',
      enteredDetail: '',
      enteredDate: '',
      enteredCategory: '',
      enteredMonth: '',
      history: [],
      expenseData:[],
      sidebar: false
    }
  };
    
    logout = async () => {
        const response = await Axios({
        method: 'POST',
        withCredentials: true,
        url: 'http://localhost:3001/logout'
      });
        console.log({ response })
        if(response.data === 'logged out'){
          this.setState({redirect: '/login'})
        }
    };

    addExpense = async () => {
      const response = await Axios({
        method: 'POST',
        data: {
          expense: this.state.enteredExpense,
          detail: this.state.enteredDetail,
          date: this.state.enteredDate
        },
        withCredentials: true,
        url: 'http://localhost:3001/expense-entered'
      });
      console.log({ response });
      if(this.state.enteredExpense === ''){
        alert('Please enter the expense')
      } else {
      this.setState({ additionalExpenses: response.data.addedExpense});
      this.setState({ remainingBudget: response.data.leftover});
      alert('Expense Successfully Entered!');
    }
  };

    extractExpense = async () => {
        const response = await Axios({
          method: 'POST',
          data: {
            category: this.state.enteredCategory,
            month: this.state.enteredMonth
          },
          withCredentials: true,
          url: 'http://localhost:3001/get-expenses'
        });
        console.log({ response });
        this.setState({ totalExpenses: response.data.total });
    };

    async auth(){
      const response = 
      await Axios({
        method: 'GET',
        withCredentials: true,
        url: 'http://localhost:3001/',
      });
        console.log({ response });
        if(response.data === 'not logged in'){
          this.setState({ redirect: '/login'});
      };
    };

    async registeredBudget() {
      try { 
        const response = await Axios({
        method: 'GET',
        withCredentials: true,
        url: 'http://localhost:3001/'
      });
      console.log({ response });
      this.setState({ registeredBudget: response.data.budget});
      this.setState({ remainingBudget: response.data.leftover});
      if(this.state.remainingBudget === 0){
        this.state.remainingBudget += this.state.registeredBudget;
      }

  } catch (e) {
    console.log(e)
  }
};

async getExpenseData() {
  const response = await Axios({
method: 'GET',
withCredentials: true,
url: 'http://localhost:3001/get-expense-data'
  });
  console.log({ response });
this.setState({ expenseData: response.data.expenseData})
}

async delete(id) {
 const response = await Axios({
    method:'DELETE',
    withCredentials: true,
    url: 'http://localhost:3001/delete',
    data: {
      docId: id
    }
  });

  // this.setState({ expenseData: response.data.expenseData })
  this.getExpenseData();
}

renderTableData() {
  return this.state.expenseData.filter((item)=>{ return item.expense !== null;}).map((record, index) => {
    const {_id, detail, expense, date} = record;
    
    return (
      <tr key={_id}>
        <td>{_id}</td>
        <td>{detail}</td>
        <td>${expense}</td>
        <td>{date}</td>
        <td><button className='deleteButton' onClick={() => this.delete(_id)}><img src="https://www.freeiconspng.com/uploads/blue-delete-button-png-29.png" alt="blue delete button png" style={{height: '25px', width: '25px'}}/></button></td>
      </tr>
    )
  })
};

showSidebar = () => {
  if(this.state.sidebar === false){
    this.setState({ sidebar: true});
  } else {
    this.setState({ sidebar: false});
  }
}





    componentDidMount(){
      this.auth();
      this.registeredBudget();
      this.getExpenseData();
    }
    

    render(){

    if(this.state.redirect){
      return <Redirect to={this.state.redirect} />
    } 
    return (
        <body id='page'>
<div className='parent'>
<p className='title'>BUDGET-IT</p>
<div className='tracker-dashboard'>
  <h3 className='budgetTitle'>This Month's Budget</h3>
  <div className='thisBudget'>
  <span id='budgetNum' className='font-roboto'>${this.state.registeredBudget}</span>
  </div>
  <h3 className='budgetTitle'>Remaining Budget</h3>
<div className='remainingBudget'>
  <span id='budgetNum' className='font-roboto'>${this.state.remainingBudget }</span>
  </div>
  <div className='dashboard'>

  <div id='menu'>
    <button className='sidebar'><AiIcons.AiOutlineBars onClick={this.showSidebar} /></button>
    </div>
    <nav className={this.state.sidebar === false ? 'nav-menu' : 'nav-menu active'}>
    <ul className='menuContent'>
      <li className='menuList'><Link to='/edit' className='edit'><AiIcons.AiOutlineEdit />New Budget</Link></li>
      <li className='menuList'><form className='logoutButton' onClick={this.logout}><AiIcons.AiOutlineLogout />logout</form></li>
    </ul>
    </nav>
 <div id='addExpense'>
<h3>Enter Your Expense</h3>
<select id='expense' placeholder='Type of expense' onChange={(e) => this.setState({enteredDetail: e.target.value })}>
<option value='' disabled selected hidden>Select a type of expense</option>
<option value='Grocery'>Grocery</option>
<option value='Restaurants'>Restaurants</option>
<option value='Housing'>Housing</option>
<option value='Gas'>Gas</option>
<option value='Miscellaneous'>Miscellaneous</option>
<option value='Business'>Business</option>
<option value='Investment'>Investment</option>
<option value='PersonalCare'>Personal Care</option>
<option value='Entertainment'>Entertainment</option>
</select>
<input type='text' id='amount' placeholder='Amount of expense' onChange={(e) => this.setState({enteredExpense: e.target.value})} />
<input type='text' id='time' placeholder='MM/DD/YYYY (optional)' onChange={(e) => this.setState({ enteredDate: e.target.value })} />
<button type='submit' className='button' onClick={this.addExpense}>Add Expense</button>
</div>
<div id='expenseList'>
<div>
<h3>Get Your Expense</h3>
<select id='category' placeholder='Category' onChange={(e) => this.setState({enteredCategory: e.target.value})}>
<option value='' disabled selected hidden>Category</option>
<option value='Grocery'>Grocery</option>
<option value='Restaurants'>Restaurants</option>
<option value='Housing'>Housing</option>
<option value='Gas'>Gas</option>
<option value='Miscellaneous'>Miscellaneous</option>
<option value='Business'>Business</option>
<option value='Investment'>Investment</option>
<option value='PersonalCare'>Personal Care</option>
<option value='Entertainment'>Entertainment</option>
<option value='All'>All</option>
</select>
<input type='text' id='monthSpent' placeholder='YYYY-MM (Optional)' onChange={(e) => this.setState({enteredMonth: e.target.value})} />
<button type='submit' className='button' onClick={this.extractExpense}>How much did I spend?</button>
<div id='totalSpent'>
  <br />
  <span>{ this.state.totalExpenses }</span>
</div>
  <div style={{backgroundColor: 'white', borderRadius: '10px', marginTop: '10px'}} className='table'>
    <table id='record'>
      <tbody>
        <tr>
          <th>ID</th>
          <th>Category</th>
          <th>Expense</th>
          <th>Date</th>
        </tr>
        {this.renderTableData()}
      </tbody>
      </table>
  </div>
</div>
</div>
</div>
</div>
</div>
</body>
    );
}
  }

export default Main;