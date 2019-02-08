const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')

let notes =
	[
		{
			id: 1,
			name: "Arto Hellas",
			number: "045-1236543"
		},
		{
			id: 2,
			name: "Arto Järvinen",
			number: "041-21423123"
		},
		{
			id: 3,
			name: "Lea Kutvonen",
			number: "040-4323234"
		},
		{
			id: 4,
			name: "Martti Tienari",
			number: "09-784232"
		}
	]
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(cors())

const generateId = () => {
	return Math.floor(Math.random() * 10000000000)
}

app.post('/api/persons', (request, response) => {
	const body = request.body
	if (body.name === undefined || body.number === undefined) {
		return response.status(400).json({
			error: 'content missing'
		})
	}

	if (notes.map(note => note.name).includes(body.name)) {
		return response.status(400).json({
			error: 'name must beings unique'
		})
	}

	const person = {
		id: generateId(),
		name: body.name,
		number: body.number,

	}

	notes = notes.concat(person)
	response.json(person)
})

app.get('/info', (req, res) => {
	res.send(`Puhelinluettelossa ${notes.length} henkilön tiedot <br>
	${new Date()}`)
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const note = notes.find(note => note.id === id)
	if (note) {
		response.json(note)
	} else {
		response.status(404).end()
	}
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	notes = notes.filter(note => note.id !== id)

	response.status(204).end()
})

app.get('/api/persons', (req, res) => {
	res.json(notes)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})