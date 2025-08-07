const mongoose = require("mongoose")

console.log("arguments", process.argv)

if (process.argv.length < 3) {
    console.log("give password as argument")
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://nikhil:${password}@cluster0.cfpq3ev.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set("strictQuery", false)

mongoose.connect(url)


const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean
})

const Note = mongoose.model("Note", noteSchema)

const note = new Note ({
    content: "HTML",
    important: true,
})

note.save().then(result => {
    console.log("note saved", result)
    mongoose.connection.close()
})