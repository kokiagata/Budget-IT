import React from 'react';

function tableDatas() {
    this.state.expenseData.filter((item)=>{ return item.expense !== null;}).filter((elem) => { return elem.date.slice(0,7) === new Date().toISOString().slice(0,7)}).map((record, index) => {
        const {_id, detail, expense, date, memo} = record;

        return (
            <tr key={_id} contenteditable={this.state.contenteditable}>
              <td className='nonEditable' contenteditable='false'>{_id}</td>
              <td className='editable'>{detail}</td>
              <td className='editable'>${expense}</td>
              <td className='editable'>{date}</td>
              <td className='editable' >{memo}</td>
              <td className='nonEditable' contenteditable='false'><button className='deleteButton' onClick={() => this.delete(_id)}><img src="https://www.freeiconspng.com/uploads/blue-delete-button-png-29.png" alt="blue delete button png" style={{height: '25px', width: '25px'}}/></button></td>
              <td><button onClick={() => this.editButton(_id)}>edit</button></td>
            </tr>
          )
        })
    }

    