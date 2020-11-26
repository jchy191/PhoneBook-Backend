require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Contact = require('./models/contacts.js');
const { response } = require('express');


const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan('dev'));
app.use(morgan(':body'));

app.get('/info', (req, res) => {
    const date = new Date()
    Contact.find({})
        .count((err, count) => {
            if (err) next(err)
            res.send(`<p>Phonebook has info for ${count} person(s)</p><p>${date}</p>`)
        })
})

app.get('/api/persons', (req, res, next) => {
    Contact.find({})
        .then(contacts => {
            res.status(200).json(contacts);
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    Contact.findById(req.params.id)
        .then(contact => {
            if (contact) {
                res.status(200).json(contact);
            } else {
                res.status(404).end();
            }
        })
        .catch(error => {
            error.message = "Malformatted id";
            error.status = 400;
            next(error);
        })
})

app.post('/api/persons', (req, res, next) => {

    const id = Math.floor(Math.random() * 1000);
    const contact = new Contact({
        name: req.body.name,
        number: req.body.number,
        id: id,
    });

    contact.save()
        .then(returnedContact => {
            return res.status(201).json(returnedContact);
        })
        .catch(error => next(error))

})

app.put('/api/persons/:id', (req, res, next) => {

    const contact = {
        number: req.body.number,
    };

    Contact.findByIdAndUpdate(req.params.id, contact, {new: true, runValidators: true})
        .then(updatedContact => {
            res.status(201).json(updatedContact);
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {

    Contact.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})


app.use((req, res) => {
    res.status(404).json({error: 'Unknown endpoint'})
});

app.use((err, req, res, next) => {
console.error(err.message);
if (err.name === 'ValidationError') {
    err.status = 400;
}
res.status(err.status || 500).json({error: err.message});
})


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})