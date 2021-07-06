const mongoose = require('mongoose');

const expenses =  new mongoose.Schema({
    expense: Number,
    detail: String,
    date: String
});

module.exports = mongoose.model("Expense", expenses);
