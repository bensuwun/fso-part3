const mongoose = require('mongoose');
require('dotenv').config();

// Empty query fiters will return all documents
mongoose.set('strictQuery', true);

// Connect to DB
const url = process.env.MONGODB_URI;
console.log(`Connecting to: ${url}`);
mongoose.connect(url)
    .then(result => {
        console.log(`Connected to MongoDB Atlas.`);
    })
    .catch(err => {
        console.log('Error connecting to MongoDB Atlas. ', err.message);
    })

// Create schema for phonebook person entry
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: (v) => {
                return /^\d{2,3}-\d{1,}$/.test(v);
            }
        },
        minLength: 8,
    }
});

// Remove _id and _v from Person documents when converting JSON
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

// Create model
const Person = mongoose.model('Person', personSchema);

module.exports = Person;