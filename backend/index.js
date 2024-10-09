require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const mongoose = require('mongoose')

const Person = require('./models/person')

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose
  .connect(url)
  .then((result) => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

app.get('/', (request, response) => {
  response.send('<h1>Phone Agenda</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then((person) => {
    response.json(person)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => {
      next(error)
    })
})

app.get('/api/info', (request, response) => {
  Person.find({}).then((person) => {
    response.send(
      `<p>Phonebook has info for ${
        person.length
      } people</p><p>${Date().toString()}</p>`
    )
  })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

const generateId = () => {
  return Math.floor(Math.random() * 1000)
}

app.post('/api/persons', morgan(':date :test'), (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing',
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'number missing',
    })
  }

  let found = false
  Person.find({ name: body.name }).then(
    console.log(`${body.name} found in database`),
    (found = true),
    response.status(400).end()
  )

  if (!found) {
    const person = new Person({
      name: body.name,
      number: body.number,
    })

    person
      .save()
      .then((savedPerson) => {
        response.json(savedPerson)
      })
      .catch((error) => next(error))
  }

  morgan.token('test', function (req, res) {
    return JSON.stringify(req.body)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)
