const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phonebookSchema = new mongoose.Schema({
  name: String,
  phone: String
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', phonebookSchema);

/* if (!name) {
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
*/

module.exports = Person