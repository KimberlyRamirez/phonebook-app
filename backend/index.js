/* eslint-disable no-unused-vars */
const express = require('express');
const { json } = require('stylelint/lib/formatters');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const Person = require('./models/numbers');

const port = process.env.PORT || 3001;

let persons = [
  {
    'id': 1,
    'name': 'Arto Hellas',
    'number': '040-123456'
  },
  {
    'id': 2,
    'name': 'Ada Lovelace',
    'number': '39-44-5323523'
  },
  {
    'id': 3,
    'name': 'Dan Abramov',
    'number': '12-43-234345'
  },
  {
    'id': 4,
    'name': 'Mary Poppendieck',
    'number': '39-23-6423122'
  }
];

app.use(cors());

app.use(express.json());

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

morgan.token('body', (req, res) => JSON.stringify(req.body || {}));

app.use(express.static('build'));

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
  res.end();
});

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => res.json(persons));
});

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date}</p>`);
  res.end();
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

function generateId() {
  return Math.floor(Math.random() * 20000000 - 1) + 1;
}

app.post('/api/persons', (req, res, next) => {
  let body = req.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save()
    .then(savedPerson => {
      res.json(savedPerson);
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  let body = req.body;

  let person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, {number:'', runValidators: true, context: 'query'})
    .then(updatedPerson => {
      res.json(updatedPerson);
    })
    .catch(error => next(error));
});

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: 'unknown endpoint' });
  next();
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({error: 'malformatted id'});
  } else if (error.name === 'ValidationError') {
    return res.status(400).send(error.message);
  }

  next(error);
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});