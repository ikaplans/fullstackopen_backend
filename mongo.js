const mongoose = require('mongoose')
if (process.argv.length < 3) {
  console.log('please provide password as an argument')
  process.exit(1)
}
const password = process.argv[2]
const url = `mongodb+srv://fullstackopen:${password}@cluster0-vasxq.mongodb.net/phonebook-app?retryWrites=true&w=majority`
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    result.forEach((p) => {
      console.log(p)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const argName = process.argv[3]
  const argNumber = process.argv[4]

  const person = new Person({
    name: argName,
    number: argNumber,
  })

  person.save().then(() => {
    console.log(`added ${argName} number ${argNumber} to phonebook`)
    mongoose.connection.close()
  })
}
