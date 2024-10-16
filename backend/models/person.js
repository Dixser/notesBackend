require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose
  .connect(url)

  .then(console.log('connected to MongoDB'))
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The name is required'],
    minLength: [3, 'The name must be at least 3 characters long.'],
  },
  number: {
    type: String,
    required: true,
    minLength: [8, 'The phone number must be at least 8 characters long.'],
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d*$/.test(v)
      },
      message: (props) =>
        `The number ${props.value} is not a valid phone number! Must contain 8 characters long and 2 or 3 numbers, a dash then numbers again!`,
    },
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
