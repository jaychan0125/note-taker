const express = require('express');
//const router = require('express').Router();
const api = require('./routes/api');
const html = require('./routes/html');

const PORT = 3001;
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", api);
app.use("/", html);

//require('./routes/api')(app);
//require('./routes/html')(app);

//GET ONE of the saved notes to display
// app.get('/api/notes/:note_id', (req, res) => {
//     console.log(`HTTP METHOD: ${req.method}`);
//     for (note of db) {
//         if (db.note_id === req.params.note_id) {
//             return res.json(note)
//         }
//     }
// });


app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
});