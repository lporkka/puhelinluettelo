const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('give password as argument')
	process.exit(1)
}

const password = process.argv[2]

const url =
	`mongodb+srv://Lauri:${password}@cluster0-vmtnd.mongodb.net/puhelinluettelo?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true })

const noteSchema = new mongoose.Schema({
	name: String,
	phone: String,
})

const Note = mongoose.model('Note', noteSchema)

if (process.argv.length === 3) {
	Note.find({}).then(result => {
		result.forEach(note => {
			console.log(note)
		})
		mongoose.connection.close()
	})
} else if (process.argv.length === 5) {

	const note = new Note({
		name: process.argv[3],
		phone: process.argv[4]
	})

	note.save().then(response => {
		console.log('note saved!');
		mongoose.connection.close();
	})
}