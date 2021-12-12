const express = require('express')
const app = express()

app.use(express.json())

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
  response.status(200).send(notes)
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


const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)