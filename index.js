const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

morgan.token('data', (req, res) => {
    return JSON.stringify(req.body);
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('build'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));
let persons = [
{
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
},
{
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
},
{
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
},
{
    "name": "ionut",
    "number": "12345",
    "id": 5
}
];

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.post('/api/persons', (request, response) => {
    const generateId = () => {
        return Math.floor(Math.random() * 1000000);
    };

    const body = request.body;
    
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'conent missing'
        });
    }

    if (persons.find(p => p.name === body.name))
        return response.status(400).json({
            error: 'name must be unique'
        });

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    };

    persons = persons.concat(person);
    response.json(body);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);

    person ? res.json(person) : res.status(404).end();
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(p => p.id !== id);
    res.status(204).end();
});

app.get('/info', (req, res) => {
    res.send(`Phonebook has info for ${persons.length} people
    
    ${new Date()}`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});