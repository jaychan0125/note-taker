const router = require('express').Router();
const path = require('path');
const { writeFile, readFile } = require('fs');
const { v1: uuidv1 } = require('uuid');
const db = require('../db/db.json')


//GET ALL the notes saved as objects in db.json file
router.get('/notes', (req, res) => {
    console.log(`HTTP METHOD: ${req.method}`);
    readFile('./db/db.json', 'utf-8', (err, data) => {  
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        } 
        return res.json(JSON.parse(data));
    });
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
            id: uuidv1(),
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

//DELETE a post matching the id chosen
router.delete('/notes/:id', (req, res) => {
    console.log(`HTTP METHOD: ${req.method}`);
    const noteId = req.params.id;
    console.log(`id param: ${noteId}`)
    readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        let notes = JSON.parse(data);
        // //findIndex, if no elements satisfy: -1,  otherwise will output the index number
        // const deleteNoteIndex = notes.findIndex(note => note.id === noteId);
        // if (deleteNoteIndex !== -1) {
        //     const deletedNote = notes[deleteNoteIndex];
        //     console.log(deletedNote);
        //     notes.splice(deleteNoteIndex, 1);
        //     console.log('Note was removed!');
        //     //save new notes db
        //     writeFile('./db/db.json', JSON.stringify(db), (err) =>
        //     err
        //       ? console.error(err)
        //       : console.log(
        //         `JSON file has been updated: '${deletedNote.title}' removed`
        //         ));
        // } else {
        //     console.log(`notes_id ${noteId} not found`);
        // }

        //filter OUT the object with the matching id; return array with rest of the objects
        notes = notes.filter((note) => note.id !== noteId);
        res.status(200).json(notes);
        writeFile('./db/db.json', JSON.stringify(notes), (err) =>
        err ? console.error(err) : console.log("removed"));
    })
})

module.exports = router;