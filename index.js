
require("dotenv").config()

const express = require('express')
const Note = require("./models/note")


const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const app = express()

app.use(express.static("dist"))

let notes = [
  {
    id: '1',
    content: 'HTML is easy',
    important: true,
  },
  {
    id: '2',
    content: 'Browser can execute only JavaScript',
    important: false,
  },
  {
    id: '3',
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
  },
]

app.use(express.json())

app.get('/', (request, response, next) => {
  response.send('<h1>Hello World!</h1>')
})
  .catch(error => next(error))

app.get('/api/notes', (request, response, next) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
    .caatch(error => next(error))
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id).then(note => {
    if (note) {
      response.json(note)
    } else {
      response.status(500).end()
    }
  })
    .catch(error => next(error))
})

app.post('/api/notes', (request, response, nextno) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
    .catch(error => next(error))
})

/*app.put("/api/notes/:id", (request, response) => {
  const id = request.params.id
  const body = request.body

  const noteIndex = notes.findIndex(n => n.id === id)
  if (noteIndex === -1) {
    return request.status(404).json({ error: "note not found" })
  }

  const updatedNote = {
    ...notes[noteIndex],
    content: body.content,
    important: body.important
  }

  notes[noteIndex] = updatedNote

  response.json(updatedNote)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter((note) => note.id !== id)

  response.status(204).end()
})
*/

app.delete("/api/notes/:id", (request, response, next) => {
  Person.findByIdDelete(request.params.id)
    .then(result => {
      response.status(200).end()
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
