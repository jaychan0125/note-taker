const router = require('express').Router();
const path = require('path');
const { writeFile, readFile } = require('fs');
const { v1: uuidv1 } = require('uuid');
const db = require('../db/db.json')


//GET ALL the notes saved as objects in db.json file
router.get('/api/notes', (req, res) => {
    console.log(`HTTP METHOD: ${req.method}`);
    return res.status(200).json(db);
});

//CREATE new notes
router.post('/api/notes', (req, res) => {
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
        writeFile('/db/db.json', JSON.stringify(db), (err) =>
        err
          ? console.error(err)
          : console.log(
              `${newNote.title} has been written to JSON file`
            ));
    };
    res.json({ messsage: 'Data received' });
});

//HERE
router.delete('/api/notes/:note_id', (req, res) => {
    console.log(req.params.note_id)
    const noteId = req.params.note_id;
    readFile('/db/db.json', 'utf-8', (err, data) => {
        let notes = JSON.parse(data);
        //console.log(notes)
       // console.log(noteId);
       // console.log(notes.note_id)
        const deleteNote = notes.findIndex(notes => notes.note_id === noteId);
        //findIndex, if no elements satisfy: -1,  otherwise will output the index number
        console.log(deleteNote)
        notes.splice(deleteNote, 1);
        //save new notes db

    })
})

module.exports = router;