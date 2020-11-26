const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
require('dotenv').config();

const url = process.env.MONGODB_URI;

console.log('Connecting to', url);

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
	.then(() => {
		console.log('Successfully connected to MongoDB');
	})
	.catch((error) => {
		console.log('Error connecting to MongoDB:', error.message);
	});


const contactSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		required: true,
		unique: true
	},
	number: {
		type: String,
		minlength: 8,
		required: true
	},
});

contactSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

contactSchema.plugin(uniqueValidator, { message: 'Name already exists in Phonebook.' });


const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;