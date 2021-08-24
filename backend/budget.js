const mongoose = require('mongoose');
const Expense = require('./expense');

const user = new mongoose.Schema({
    username: {type: String, unique: true},
    password: {type: String, require: true},
    email: {type: String, require: true},
    budget: Number,
    housing: Number,
    savings: Number,
    insurance: Number,
    subscriptions: Number,
    log: []
});

module.exports = mongoose.model("User", user);
