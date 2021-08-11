const mongoose = require('mongoose');

const expenses =  mongoose.Schema({
    expense: Number,
    detail: String,
    date: String,
    memo: String
});

module.exports = mongoose.model("Expense", expenses);
