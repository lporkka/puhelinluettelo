require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')
const Note = require('./models/note')

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(cors())

app.post('/api/persons', (request, response) => {
	const body = request.body
	if (body.name === undefined || body.phone === undefined) {
		return response.status(400).json({
			error: 'content missing'
		})
	}

	const note = new Note({
		name: body.name,
		phone: body.phone
	})
	Note.findOne({ name: body.name }).then(result => {
		if (!result) {
			note.save().then(savedNote => {
				response.json(savedNote.toJSON())
			})
		} else {
			return response.status(400).end()
		}
	})
})

app.get('/info', (req, res) => {
	res.send(`Puhelinluettelossa ${notes.length} henkilön tiedot <br>
	${new Date()}`)
})

app.get('/api/persons/:id', (request, response) => {
	Note.findById(request.params.id).then(note => {
		response.json(note.toJSON())
	}).catch(error => {
		console.log(error)
		response.status(404).end()
	})
})

app.delete('/api/persons/:id', (request, response) => {
	Note.findById(request.params.id).then(note => {
		Note.deleteOne(note).then(note => {
			response.status(200).end()
		})

	}).catch(error => {
		console.log(error)
		response.status(400).end()
	})
})

app.get('/api/persons', (req, res) => {
	Note.find({}).then(notes => {
		res.json(notes)
	}).catch(error => {
		res.send(error.message).status(404).end()
	})
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError' && error.kind == 'ObjectId') {
		return response.status(400).send({ error: 'malformatted id' })
	}

	next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})