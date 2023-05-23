const express = require('express');
const path = require('path');
const { writeFile, readFile } = require('fs');
const { v1: uuidv1 } = require('uuid');

const PORT = 3001;
const app = express();

const db = require('./db/db.json')

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});

//GET ALL the notes saved as objects in db.json file
app.get('/api/notes', (req, res) => {
    console.log(`HTTP METHOD: ${req.method}`);
    return res.status(200).json(db);
});

//GET ONE of the saved notes to display
app.get('/api/notes/:note_id', (req, res) => {
    console.log(`HTTP METHOD: ${req.method}`);
    for (note of db) {
        if (db.note_id === req.params.note_id) {
            return res.json(note)
        }
    }
});

//CREATE new notes
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    console.log(`HTTP METHOD: ${req.method}`);
    //if the newNote has both a title and text:
    if (title && text) {
        const newNote = {
            title, 
            text,
            note_id: uuidv1(),
        };

        //add newNote to the array in db.json
        db.push(newNote);
        // res.status(200).json(db);

        //persist data into the db.json file
        writeFile('./db/db.json', JSON.stringify(db), (err) =>
        err
          ? console.error(err)
          : console.log(
              `${newNote.title} has been written to JSON file`
            ));
    };

    res.json({ messsage: 'Data received' });
});


app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
});