require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/phonebook')

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

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})


app.get('/api/info', (request, response, next) => {

  Person.find({})
    .then(persons => {
      response.status(200).send(`
      <h1>Phonebook has info for ${persons.length} people </h1>
      <h2>${new Date()}</h2>
      `)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {

  const id = request.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findByIdAndRemove(id)
    .then(result => response.status(204).end())
    .catch(error => next(error))

})

app.post('/api/persons/', (request, response, next) => {
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

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(result => {
      console.log(`added ${person.name} number ${person.number} to phonebook`)
      response.json(result)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(id, person, { new: true, runValidators: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))

})

/**
 * Error Handler
 */

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).send(
      { error: error.message }
    )
  }



  if (error._message === "Person validation failed") {
    return response.status(409).send({
      error: error
    })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)