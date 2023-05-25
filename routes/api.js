const router = require('express').Router();
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
    readFile('./db/db.json', 'utf-8', (err, data) => {
        const dbArray = JSON.parse(data);
        if (title && text) {
            const newNote = {
                title,
                text,
                id: uuidv1(),
            };

            //add newNote to the array in db.json
            dbArray.push(newNote);
            // res.status(200).json(db);

            //persist data into the db.json file
            writeFile('./db/db.json', JSON.stringify(dbArray), (err) =>
                err
                    ? console.error(err)
                    : console.log(
                        `${newNote.title} has been written to JSON file`
                    ));
        };
        res.json({ messsage: 'Data received' });
    })
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

        const notes = JSON.parse(data);
        //filter OUT the object with the matching id; return array with rest of the objects
        const noteDelete = notes.filter((note) => note.id !== noteId);
        res.status(200).json(noteDelete);
        writeFile('./db/db.json', JSON.stringify(noteDelete), (err) =>
            err ? console.error(err) : console.log("removed"));
    })
})

module.exports = router;