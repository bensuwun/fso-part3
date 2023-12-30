const moment = require('moment');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { generateId } = require('./helpers/generateId.js');
const app = express();
const Person = require('./models/Person');
require('dotenv').config();

// #region Middleware
morgan.token('body', (request, response) => {
    const body = request.body;

    if (Object.keys(body).length !== 0 && request.method === "POST")
        return JSON.stringify(body);
    return undefined;
});

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());
app.use(express.static('dist'));
// #endregion

// Retrieve all persons
app.get(`/api/persons`, (request, response) => {
    Person.find({}).then(result => {
        response.json(result);
    })
})

// Retrieve single person
app.get(`/api/persons/:id`, (request, response) => {
    const id = parseInt(request.params.id);
    const person = persons.find(person => person.id === id);
    if (person)
        response.json(person);
    else{
        response.status(404).send({ error: "Missing Person" });
    }
})

// Delete phonebook entry
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    Person.deleteOne({_id: id})
    .then(result => {
        response.status(204).end();
    })
});

// Add new phonebook entry
app.post('/api/persons', (request, response) => {
    const body = request.body;
    if (!body.name || !body.number)
        return response.status(400).send( { error: 'New entry must contain both name and number.' } );

    Person.create({
        name: body.name,
        number: body.number
    }).then(result => {
        response.json(result.toJSON());
    })
});

// Info
app.get(`/info`, (request, response) => {
    const nPeople = persons.length;
    const currentTime = moment().format('LLLL');
    const result = `
        <p>Phonebook has info for ${nPeople} people</p>
        <p>${currentTime}</p>
    `;
    response.send(result);
});  

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server listening on port ${PORT}`);