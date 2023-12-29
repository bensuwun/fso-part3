const moment = require('moment');
const express = require('express');
const morgan = require('morgan');
const { generateId } = require('./helpers/generateId.js');
const app = express();

let persons = require('./data/persons.json');

morgan.token('body', (request, response) => {
    const body = request.body;

    if (Object.keys(body).length !== 0 && request.method === "POST")
        return JSON.stringify(body);
    return undefined;
});

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
  

// Retrieve all persons
app.get(`/api/persons`, (request, response) => {
    response.json(persons);
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
    const id = parseInt(request.params.id);
    persons = persons.filter(person => person.id !== id);
    response.status(204).end();
});

// Add new phonebook entry
app.post('/api/persons', (request, response) => {
    const body = request.body;
    if (!body.name || !body.number)
        return response.status(400).send( { error: 'New entry must contain both name and number.' } );
    else if (persons.find(person => person.name.toLowerCase() === body.name.toLowerCase()))
        return response.status(400).send( { error: 'Name must be unique.' });

    const person = {
        id: generateId(persons),
        name: body.name,
        number: body.number
    };
    persons.push(person);

    response.json(person);
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

const PORT = 3001;
app.listen(PORT);
console.log(`Listening on port ${PORT}`);