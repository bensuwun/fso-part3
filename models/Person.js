const mongoose = require('mongoose');

// Create schema for phonebook person entry
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    number: {
        type: String,
        required: false
    }
});

// Create model
const Person = mongoose.model('Person', personSchema);

module.exports = Person;