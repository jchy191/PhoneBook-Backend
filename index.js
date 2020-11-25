const express = require('express');
const app = express();

let persons = [
    { 
        name: "Arto Hellas", 
        number: "040-123456",
        id: 1
      },
      { 
        name: "Ada Lovelace", 
        number: "39-44-5323523",
        id: 2
      },
      { 
        name: "Dan Abramov", 
        number: "12-43-234345",
        id: 3
      },
      { 
        name: "Mary Poppendieck", 
        number: "39-23-6423122",
        id: 4
      }
]

app.use(express.json());

app.get('/info', (req, res) => {
    const date = new Date()
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

app.get('/api/persons', (req, res) => {
    res.status(200).json(persons);
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    if (person) {
        res.status(200).json(person);
    } else {
        res.status(404).end();
    }
})

app.post('/api/persons', (req, res) => {

    if(!req.body.name || !req.body.number) {
        return res.status(400).json({error: 'Content missing.'})
    }

    const person = persons.find(person => person.name === req.body.name);
    if (person) {
        return res.status(400).json({error: 'Name already exists in phonebook.'})
    }
    const id = Math.floor(Math.random() * 1000);
    const newPerson = {...req.body, id};
    persons = [...persons, newPerson];
    res.status(201).json(newPerson);
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const personToDelete = persons.find(person => person.id === id);
    if (personToDelete) {
        persons = persons.filter(person => person.id !== id)
        res.status(204).end();
    } else {
        res.status(404).end();
    }
})


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})