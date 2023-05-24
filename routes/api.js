const router = require('express').Router();
const path = require('path');
const { writeFile, readFile } = require('fs');
const { v1: uuidv1 } = require('uuid');
const db = require('../db/db.json')


//GET ALL the notes saved as objects in db.json file
router.get('/notes', (req, res) => {
    console.log(`HTTP METHOD: ${req.method}`);
    return res.status(200).json(db);
});

//CREATE new notes
router.post('/notes', (req, res) => {
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

//HERE
router.delete('/notes/:note_id', (req, res) => {
    console.log(`HTTP METHOD: ${req.method}`);
    const noteId = req.params.note_id;
    console.log(`id param: ${noteId}`)
    readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        let notes = JSON.parse(data);
        //findIndex, if no elements satisfy: -1,  otherwise will output the index number
        const deleteNoteIndex = notes.findIndex(note => note.note_id === noteId);
        if (deleteNoteIndex !== -1) {
            notes.splice(deleteNoteIndex, 1);
        } else {
            console.log(`notes_id ${noteId} not found`);
        }
        const deletedNote = notes[deleteNoteIndex];
        //save new notes db
        writeFile('./db/db.json', JSON.stringify(db), (err) =>
        err
          ? console.error(err)
          : console.log(
            `JSON file has been updated: '${deletedNote.title}' removed`
            ));
    })
})

module.exports = router;