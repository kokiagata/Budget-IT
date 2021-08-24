const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const path = require('path');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createServer({});
const User = require("./budget");
const Expense = require('./expense');
//const { findById } = require("./budget");
const ObjectId = require('mongodb').ObjectId;



mongoose.connect("mongodb+srv://kokiagata:Kokiagita0207!@puka.vonwo.mongodb.net/Puka?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:false});


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: 'Puka',
  resave: true,
  saveUninitialized: false,
}));
app.use(cookieParser('Puka'));
app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.options('*', cors())
app.post('/login', (req, res)=>{
  passport.authenticate('local', (err, user)=>{
    if(err) throw err;
    if(!user) {
      console.log('no user')
      res.send('No such user');
    }
    else {
      req.logIn(user, (err)=>{
        if(err) {
          console.log('wrong password')
          throw err;
        }
        console.log('success: ' + user._id);
        if(user.budget === 0 || user.budget === null){
          res.send('Success no budget')
        } else {
        res.send('Success');
        }
      })
    }
  })(req, res);
});


app.post('/register', (req, res)=>{
  User.findOne({username: req.body.username}, async (err, doc)=>{
    if(err) { throw err; }
    else if(req.body.username === '') { res.send('Empty Username');}
    else if(req.body.password === '') { res.send('Empty Password');}
    else if(req.body.email === '') { res.send('Empty Email');}
    else if(!req.body.email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    )) { res.send('Invalid Email Format')}
    else if(doc) { res.send('User already exists');}
    else if(!doc && req.body.username !== '' && req.body.password !== '' && req.body.email !== '') {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        budget: req.body.budget
      });
     await newUser.save();
     res.send('Successfully Registered');
    }
  });
});

// Thinking of a way to showcase the original budget and principle expenses somewhere for more UI friendly display //
app.get('/', checkAuthenticated, (req, res) => {
  User.findById(req.user._id, function(err, result){
    if(!err){
      let minus = result.log.filter((remainingBudget)=>{
        return remainingBudget.date.slice(0,7) ==  new Date().toISOString().slice(0,7)
      }).reduce((sub, val)=>{
        return sub + val.expense
      }, 0);

      let totalPrinciple = result.housing + result.savings + result.insurance + result.subscriptions;
      let remain = result.budget - totalPrinciple - Number(minus).toFixed(2);

      
      res.send({budget: result.budget, leftover: Number(remain).toFixed(2), principles: totalPrinciple});
      console.log(req.user._id);
    } else {
      console.log(err)
      onsole.log('Please login')
    }
  });
  });



app.post('/start', (req, res) => {

  User.findByIdAndUpdate(req.user._id, {budget: req.body.budget, housing: req.body.housing, savings: req.body.savings, insurance: req.body.insurance, subscriptions: req.body.subscriptions}, {new: true}, (err, result) => {
    if(!err && result.budget !== '' && result.budget !== null){
      console.log('Success');
      res.send('entered')
    } else {
      console.log('error')
    }
  });
});

  app.post('/logout', (req, res) => {
    req.logout();
    req.user = null;
    res.send('logged out');
  })

  app.post('/expense-entered', (req, res) => {
    let date;
    let note;

    if(req.body.date === ''){
      date = new Date();
    } else {
      date = req.body.date;
    };
    
    let newExpense;
    if(req.body.detail !== 'Other') {
      newExpense = new Expense({
      expense: req.body.expense,
      detail: req.body.detail,
      date: new Date(date).toISOString().slice(0,10),
      memo: req.body.memo
    });
  } else if(req.body.detail === 'Other' && req.body.other){
    newExpense = new Expense({
      expense: req.body.expense,
      detail: req.body.other,
      date: new Date(date).toISOString().slice(0, 10),
      memo: req.body.memo
    });
  } else if(req.body.detail === 'Other' && !req.body.other) {
    newExpense = new Expense({
      expense: req.body.expense,
      detail: req.body.detail,
      date: new Date(date).toISOString().slice(0, 10),
      memo: req.body.memo
    });
  }

if(req.body.expense !== '') {
 User.findByIdAndUpdate(req.user._id, {$push: {log: newExpense}}, {new: true, upsert: true}, function(err, result){
if(!err){
  //let remain = result.budget - minus;
  let minus = result.log.filter((remainingBudget)=>{
    return remainingBudget.date.slice(0,7) ==  new Date().toISOString().slice(0,7)
  }).reduce((sub, val)=>{
    return sub + val.expense
  }, 0);
  let principle = result.principle;
  let totalPrinciple = principle[0].Housing + principle[0].Savings + principle[0].Insurance + principle[0].Subscription;
  let remain = result.budget - totalPrinciple - Number(minus).toFixed(2);

  res.send({addedExpense: req.body.expense, leftover: Number(remain).toFixed(2)});
  console.log(result);
} else {
  console.log(err);
}
 });
} else {
  console.error('Expense needs to be entered')
  res.send('Error. Expense needs to be entered');
}
  });

  app.post('/get-expenses', (req, res) => {
    let date;
    if(req.body.month === ''){
      date = new Date().toISOString().slice(0,7);
    } else {
      date = req.body.month;
    }
    User.findById(req.user._id, function(err, extraction){
      if(!err){
      let byCategoryAndMonth = extraction.log.filter((month) => {
        return month.date.slice(0,7) === date;
      });
      let byCategory = byCategoryAndMonth.filter((category) => {
        if(req.body.category !== 'All' && req.body.category !== 'Other'){
        return category.detail === req.body.category;
        } else if(req.body.category === 'Other' && req.body.others) {
          return category.detail === req.body.others;
        } else if(req.body.category === 'Other' && !req.body.others) {
          return category.detail === req.body.category;
        }
      }).reduce((acc, val) => {
      return acc + val.expense;
    },0);

    if(!req.body.others) {
    console.log(req.body.category + ': $' + byCategory);
    res.send({total: req.body.category + ': $' + byCategory});
    } else {
      console.log(req.body.others + ': $' + byCategory);
      res.send({total: req.body.others + ': $' + byCategory})
    }
    } else {
      console.log(err);
    }
  })
});

app.post('/history', (req, res) => {
  User.findById(req.user._id, async function(err, result){
    let history = result.log;
    let arr = history.map(Object.values).map((noId) => {
      return noId.slice(1);
    });
    
    try {
    
       console.log(arr)
       res.send(arr)
  } catch(e) {
    console.log(e);
  }
  });
});

app.get('/get-expense-data', (req, res) => {
  User.findById(req.user._id, async function(err, result){
    let history = result.log;
    let chartData = history.filter((byMonth) => {
      return byMonth.date.slice(0,7) === new Date().toISOString().slice(0,7)
    });
    let dataset = [];
    let value = [];
    for(let i in chartData){
      if(!dataset.includes(chartData[i].detail)) {
        dataset.push(chartData[i].detail)
      } else {
        i += 1 ;
      }
    }
    for(let j = 0; j < dataset.length; j++) {
        value.push(chartData.filter((elem) => {
          return elem.detail === dataset[j]
        }).reduce((acc, val) => {
          return acc + val.expense;
        }, 0));
    }
    //history = history.filter((byMonth) => {
      //return byMonth.date.slice(0,7) === new Date().toISOString().slice(0,7)
    //});
    
    try {
      console.log(history);
      console.log(chartData)
      console.log(dataset)
      console.log(value)
      res.send({expenseData: history, chart: chartData, dataset: dataset, dataPoints: value});
    } catch(e) {
      console.log(e)
    }
});
});

app.delete('/delete', (req, res) => {
  User.findById(
    {_id: req.user._id},
    function (err, user) {
      if (err) {
        console.log(err);
      } else {
        let deletedRow = user.log.find(elem => elem._id && elem._id.toString() === req.body.docId);
        user.log = user.log.filter(elem => elem._id && elem._id.toString() !== req.body.docId);
        user.save(function (err, result) {
          if (err) {
            console.log(err);
          } else {
            let minus = result.log.filter((remainingBudget)=>{
              return remainingBudget.date.slice(0,7) ==  new Date().toISOString().slice(0,7)
            }).reduce((sub, val)=>{
              return sub + val.expense
            }, 0);
              let remain = result.budget - Number(minus).toFixed(2);
            res.send({expenseData: deletedRow, leftover: Number(remain).toFixed(2)});
          }
        });
      }
    }
  );  
});

app.put('/updateTable', (req, res) => {
console.log(req.body.newExpense)
if(req.body.newExpense) {
  User.findOneAndUpdate({_id: req.user._id, 'log._id': ObjectId(req.body.rowDataId)}, {$set: {'log.$.expense': parseFloat(req.body.newExpense)}}, (err, result) => {
  });
}
if(req.body.newDetail) {
  User.findOneAndUpdate({_id: req.user._id, 'log._id': ObjectId(req.body.rowDataId)}, {$set: {'log.$.detail': req.body.newDetail}}, (err, result) => {
  });
}
if(req.body.newDate) {
  User.findOneAndUpdate({_id: req.user._id, 'log._id': ObjectId(req.body.rowDataId)}, {$set: {'log.$.date': req.body.newDate}}, (err, result) => {
  });
}
if(req.body.newMemo) {
  User.findOneAndUpdate({_id: req.user._id, 'log._id': ObjectId(req.body.rowDataId)}, {$set: {'log.$.detail': req.body.newMemo}}, (err, result) => {
  });
}

User.findOne({_id: req.user._id}, (err, item) => {
  if(!err) {
  console.log(item.log);
  res.send({expenseData: item.log});
  } else {
    console.error(err);
  }
});
})




app.post('/edited-budget', (req, res) => {
  
  let newPrinciples = new Principle({
    Housing: req.body.newHousing,
    Savings: req.body.newSavings,
    Insurance: req.body.newInsurance,
    Subscription: req.body.newSubscription
  })
  User.findByIdAndUpdate(req.user._id, {budget: req.body.budget}, (err, result) => {
    if(!err) {
      console.log(result.budget);
      res.send('budget edited');
    } else {
      console.log(err);
    }
  });
});

function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  res.send('not logged in');
  console.log('not logged in')
}


app.listen(3001, () => {
  console.log('Server is listening on port 3001');
});
console.log(mongoose.connection.readyState)