const express = require('express')
const app = express()

app.use(express.json())

let notes = [
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
  response.status(200).send(notes)
})
app.get('/api/info', (request, response) => {
  response.status(200).send(`
  <h1>Phonebook has info for ${notes.length} people </h1>
  <h2>${new Date()}</h2>
  `)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)