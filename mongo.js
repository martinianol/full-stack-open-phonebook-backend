const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const phoneNumber = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.yrs0y.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  phone: String
})

const Person = mongoose.model('Person', phonebookSchema)

if (!name) {
  return (
    Person.find({}).then(result => {
      console.log('phonebook:')
      result.forEach(person => {
        console.log(`${person.name} ${person.phone}`)
      })
      mongoose.connection.close()
    })
  )
}

const person = new Person({
  name: name,
  phone: phoneNumber,
})

person.save().then(result => {
  console.log(`added ${name} number ${phoneNumber} to phonebook`)
  mongoose.connection.close()
})

