const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

morgan.token('body', (request, response) => JSON.stringify(request.body));

/**
 * Middlewares
 */
app.use(morgan(':method :url :status :req[content-length] - :response-time ms :body'));
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

let phonebook = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.status(200).send(phonebook)
})

app.get('/api/info', (request, response) => {
  response.status(200).send(`
  <h1>Phonebook has info for ${phonebook.length} people </h1>
  <h2>${new Date()}</h2>
  `)
})

app.get('/api/persons/:id', (request, response) => {

  const id = Number(request.params.id)
  const result = phonebook.find(person => person.id === id)

  if (result) {
    response.status(200).json(result)
  } else {
    response.status(404).send()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  phonebook = phonebook.filter(person => person.id !== id);

  response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
  const id = Math.floor(Math.random() * 999999999999999)
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  if (phonebook.some(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  newPerson = {
    id: id,
    name: body.name,
    number: body.number
  }

  phonebook = phonebook.concat(newPerson)

  response.json(phonebook)

})


const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)