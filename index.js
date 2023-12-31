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
app.get(`/api/persons/:id`, (request, response, next) => {
    const id = request.params.id;
    Person.findById(id)
    .then(result => {
        if (result) {
            response.json(result);
        }
        else{
            response.status(404).send({error: "404: No person found"});
        }
    })
    .catch(err => {
        next(err);
    })
})

// Delete phonebook entry
app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;
    Person.findByIdAndDelete(id)
    .then(result => {
        response.status(204).end();
    })
    .catch(err => {
        next(err);
    })
});

// Edit a phonebook entry
app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;
    const body = request.body;

    Person.findByIdAndUpdate(id, body, {new: true,  runValidators: true, context: "query"})
    .then(updatedPerson => {
        response.json(updatedPerson);
    })
    .catch(err =>{
        next(err);
    })
});

// Add new phonebook entry
app.post('/api/persons', (request, response, next) => {
    const body = request.body;

    Person.create({
        name: body.name,
        number: body.number
    }).then(result => {
        response.json(result);
    })
    .catch(err => {
        next(err);
    })
});

// Info
app.get(`/info`, (request, response) => {
    Person.find({}).then(result => {
        const nPeople = result.length;
        const currentTime = moment().format('LLLL');
        const data = `
            <p>Phonebook has info for ${nPeople} people</p>
            <p>${currentTime}</p>
        `;
        response.send(data);
    })
});  

// Add middleware to respond to unknown endpoints.
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'Unknown endpoint' });
}
app.use(unknownEndpoint);

// Add middleware for exception handling
const errorHandler = (error, request, response, next) => {
    console.error(error.message);
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'Malformatted ID '});
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message });
    }
    next(error);
}
app.use(errorHandler);
  

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server listening on port ${PORT}`);