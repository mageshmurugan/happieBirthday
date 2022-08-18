const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const dateSchema = new Schema({
    names: String,
    email: String,
    date: String,
    year: String
});

module.exports = mongoose.model('Dates', dateSchema);