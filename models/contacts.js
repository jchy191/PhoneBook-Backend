const mongoose = require('mongoose');

const url =
    `mongodb+srv://fullstack:p8norSfkR9ngM0mx@cluster0.fsdmb.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

console.log('Connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {
        console.log('Successfully connected to MongoDB');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message)
    })

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;