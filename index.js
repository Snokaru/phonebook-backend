require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

morgan.token('data', (req, res) => {
    return JSON.stringify(req.body);
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('build'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => res.json(persons));
});

app.post('/api/persons', (req, res) => {
    const body = req.body;
    
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'conent missing'
        });
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person.save().then(person => res.json(person));
});

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person)
                res.json(person);
            else {
                res.status(404).end();
            }
        })
        .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => res.status(204).end())
    .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body;

    const person = {
        number: body.number,
    };

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedNote => res.json(updatedNote))
        .catch(error => next(error));
});

const errorHandler = (error, request, response, next) => {
    
    if (error.name == 'CastError') 
        return response.status(400).send({ error: 'malformatted id' });

    next(error);
};

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});