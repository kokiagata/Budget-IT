import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';
import Edit from './Edit';
import { Redirect } from 'react-router-dom';
import Axios from 'axios';
import { transformAuthInfo } from 'passport';
import * as AiIcons from 'react-icons/ai';
import editableRows from './components/editableRow';
import tableDatas from './components/tableData';
import { Pie } from 'react-chartjs-2';





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
      enteredOther: '',
      enteredCategory: '',
      enteredOthers: '',
      enteredMonth: '',
      note: 'N/A',
      history: [],
      expenseData:[],
      sidebar: false,
      showBtn: false,
      contenteditable: 'false',
      rowId: '',
      updatedExpense: null,
      updatedDetail: '',
      updatedDate: '',
      updatedMemo: '',
      dataPoints: [],
      chartLabel: [],
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

//I am trying to figure out how to save user input tp be used for the next entry for 'Other'
    
    addExpense = async () => {
      const response = await Axios({
        method: 'POST',
        data: {
          expense: this.state.enteredExpense,
          detail: this.state.enteredDetail,
          other: this.state.enteredOther,
          date: this.state.enteredDate,
          memo: this.state.note
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
      this.setState({ enteredDetail: '' });
      this.setState({ enteredOther: ''});
      this.setState({ enteredExpense: '' });
      this.setState({ enteredDate: '' });
      this.setState({ note: 'N/A' });
      this.getExpenseData();
      document.getElementById('expense').value = '';
      document.getElementById('amount').value = '';
      document.getElementById('time').value = '';
      document.getElementById('note').value = '';
      document.getElementById('otherCategory').value = '';

      alert('Expense Successfully Entered!');
    }
  };


    extractExpense = async () => {
        const response = await Axios({
          method: 'POST',
          data: {
            category: this.state.enteredCategory,
            others: this.state.enteredOthers,
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
          this.getExpenseData()
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
this.setState({ dataPoints: response.data.dataPoints })
this.setState({ chartLabel: response.data.dataset })

console.log(this.state.dataPoints)
console.log(this.state.chartLabel)

}

 createChart() {
  const data =  {
    labels: this.state.chartLabel,
    datasets: [
      {
        label: 'Expense',
        data: this.state.dataPoints,
        backgroundColor: [
        '#F5B7B1',
        '#D2B4DE',
        '#AED6F1',
        '#A2D9CE',
        '#FAD7A0',
        '#E5E7E9', 
        '#154360', 
        '#1D8348',
        '#CD6155'],
      },],
        options: {
          tooltip: {
            callbacks: {
              title: function(tooltipItem, data) {
                return;
              }
            },
            },
          },
      }
  

  return (
  <div>
    <Pie data={data} />
  </div>
  )
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
console.log({ response });
this.setState({ remainingBudget: response.data.leftover });
  // this.setState({ expenseData: response.data.expenseData })
  this.getExpenseData();
}


showButton = () => {
  if(this.state.showBtn === false){
  this.setState({ showBtn: true})
  } else {
    this.setState({ showBtn: false})
  }
}

showButtonText() {
  if(this.state.showBtn === false){
    return 'Show More';
  } else {
    return 'Show Less'
  }
}

editButton = (row) => {
  this.setState({ rowId: row})
  console.log(this.state.rowId);
}

cancelButton = () => {
  this.setState({ rowId: ''});
}

saveButton = async (id) => {
try {
 
  const response = await Axios({
    method: 'PUT',
    url: 'http://localhost:3001/updateTable',
    withCredentials: true,
    data: {
      rowDataId: id,
      newExpense: this.state.updatedExpense,
      newDetail: this.state.updatedDetail,
      newDate: this.state.updatedDate,
      newMemo: this.state.updatedMemo
    }
  });
  console.log({ response });
  this.setState({ rowId: ''});
  this.setState({ updatedExpense: ''});
  this.setState({ updatedDetail: ''});
  this.setState({ updatedDate: ''});
  this.setState({ updatedMemo: ''});
  this.getExpenseData();
  this.registeredBudget();
  
} catch(e) {
  console.log(e);
}
}

renderTableData() {
  return this.state.expenseData.filter((item)=>{ return item.expense !== null;}).filter((elem) => { return elem.date.slice(0,7) === new Date().toISOString().slice(0,7)}).map((record, index) => {
    const {_id, detail, expense, date, memo} = record;
    
    return (
      <tr key={_id}>
        <td>{_id}</td>
        <td>{record._id === this.state.rowId ? <input id='detailUpdate' placeholder={detail} onChange={(e) => { this.setState({ updatedDetail: e.target.value})}} /> : detail}</td>
        <td>${record._id === this.state.rowId ? <input id='expenseUpdate' placeholder={expense} onChange={(e) => {e.target.value !== '' ? this.setState({ updatedExpense: e.target.value}) : this.setState({ updatedExpense: e.target.placeholder})}} /> : expense}</td>
        <td>{record._id === this.state.rowId ? <input id='dateUpdate' placeholder={date} onChange={(e) => {e.target.value !== '' ? this.setState({ updatedDate: e.target.value}) : this.setState({ updatedDate: e.target.placeholder})}} /> : date}</td>
        <td>{record._id === this.state.rowId ? <input id='memoUpdate' placeholder={memo} onChange={(e) => {e.target.value !== '' ? this.setState({ updatedMemo: e.target.value}) : this.setState({ updatedMemo: e.target.placeholder})}} /> : memo}</td>
        <td><button className='deleteButton' onClick={() => this.delete(_id)}><img src="https://www.freeiconspng.com/uploads/blue-delete-button-png-29.png" alt="blue delete button png" style={{height: '25px', width: '25px'}}/></button></td>
        <td>{record._id === this.state.rowId ? <span><button className='editSaveBtn' onClick={() => this.saveButton(_id)}>Save</button> / <button className='editSaveBtn' onClick={this.cancelButton}>Cancel</button></span> : <button onClick={() => this.editButton(_id)} className='editSaveBtn'>edit</button>}</td>
        </tr>
    )
    
 })
};


renderTableAllData() {
  return this.state.expenseData.filter((item)=>{ return item.expense !== null;}).map((record, index) => {
    const {_id, detail, expense, date, memo} = record;
    
    return (
      <tr key={_id}>
        <td>{_id}</td>
        <td>{record._id === this.state.rowId ? <input id='detailUpdate' placeholder={detail} onChange={(e) => { this.setState({ updatedDetail: e.target.value})}} /> : detail}</td>
        <td>${record._id === this.state.rowId ? <input id='expenseUpdate' placeholder={expense} onChange={(e) => {e.target.value !== '' ? this.setState({ updatedExpense: e.target.value}) : this.setState({ updatedExpense: e.target.placeholder})}} /> : expense}</td>
        <td>{record._id === this.state.rowId ? <input id='dateUpdate' placeholder={date} onChange={(e) => {e.target.value !== '' ? this.setState({ updatedDate: e.target.value}) : this.setState({ updatedDate: e.target.placeholder})}} /> : date}</td>
        <td>{record._id === this.state.rowId ? <input id='memoUpdate' placeholder={memo} onChange={(e) => {e.target.value !== '' ? this.setState({ updatedMemo: e.target.value}) : this.setState({ updatedMemo: e.target.placeholder})}} /> : memo}</td>
        <td><button className='deleteButton' onClick={() => this.delete(_id)}><img src="https://www.freeiconspng.com/uploads/blue-delete-button-png-29.png" alt="blue delete button png" style={{height: '25px', width: '25px'}}/></button></td>
        <td>{record._id === this.state.rowId ? <span><button className='editSaveBtn' onClick={() => this.saveButton(_id)}>Save</button> / <button className='editSaveBtn' onClick={this.cancelButton}>Cancel</button></span> : <button onClick={() => this.editButton(_id)} className='editSaveBtn'>edit</button>}</td>
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
<div className={this.state.remainingBudget >= 0 ? 'remainingBudget' : 'remainingBudgetNeg'}>
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
<option value='Other'>Other</option>
</select>
<input type='text' id='otherCategory' placeholder='Add your own category' onChange={(e) => this.setState({ enteredOther: e.target.value })} style={{display: this.state.enteredDetail === 'Other' ? 'block' : 'none'}} />
<input type='text' id='amount' placeholder='Amount of expense' onChange={(e) => this.setState({enteredExpense: e.target.value})} />
<input type='text' id='time' placeholder='MM/DD/YYYY (optional)' onChange={(e) => this.setState({ enteredDate: e.target.value })} />
<input type='text' id='note' placeholder='Write some note here...(optional)' onChange={(e) => this.setState({note: e.target.value })} />
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
<option value='Other'>Other</option>
<option value='All'>All</option>
</select>
<input type='text' id='others' placeholder='Enter your category' onChange={(e) => this.setState({ enteredOthers: e.target.value})} style={{display: this.state.enteredCategory === 'Other' ? 'block' : 'none'}} />
<input type='text' id='monthSpent' placeholder='YYYY-MM (Optional)' onChange={(e) => this.setState({enteredMonth: e.target.value})} />
<button type='submit' className='button' onClick={this.extractExpense}>How much did I spend?</button>
<div id='totalSpent'>
  <br />
  <span>{ this.state.totalExpenses }</span>
</div>
<div>
  {this.createChart()}
</div>
  <div style={{backgroundColor: 'white', borderRadius: '10px', marginTop: '10px'}} className='table'>
    <table id={this.state.contenteditable === 'false' ? 'record' : 'recordEditable'}>
      <tbody>
      <tr>
          <th>ID</th>
          <th>Category</th>
          <th>Expense</th>
          <th>Date</th>
          <th>Note</th>
          <th><button onClick={this.showButton} className='showBtn'>{this.showButtonText()}</button></th>
        </tr>
        {this.state.showBtn === false ? this.renderTableData() : this.renderTableAllData()}
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