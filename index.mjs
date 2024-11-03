import express from 'express';
import { nanoid } from 'nanoid';
import cors from 'cors';
import logger from './loggerMiddleware.mjs';

const app = express();
app.use(cors()); // usar el middleware de cors
app.use(express.json()); // usar el modulo de json-parser

app.use(logger);

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
		important: false,
	},
];

app.get('/', (req, res) => {
	res.send('<h1>Notes</h1>');
});

app.get('/api/notes', (req, res) => {
	res.json(notes);
});

app.get('/api/notes/:id', (req, res) => {
	const id = req.params.id;
	const note = notes.find((note) => note.id === id);

	if (note) {
		res.status(200).json(note);
	} else {
		res.status(404).end();
	}
});

app.delete('/api/notes/:id', (req, res) => {
	const id = req.params.id;
	notes = notes.filter((note) => note.id !== id);

	res.status(204).end();
});

app.post('/api/notes', (req, res) => {
	const note = req.body;

	if (!note || !note.content) {
		return res.status(400).json({
			error: 'content is required',
		});
	}

	const newNote = {
		id: `${nanoid()}`,
		content: note.content,
		important: typeof note.important !== 'undefined' ? note.important : false,
		date: new Date().toISOString(),
	};
	notes = notes.concat(newNote);
	res.status(201).json(notes);
});

app.use((req, res) => {
	res.status(404).json({
		error: 'Not found',
	});
});

// desplegar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log('Server is running on port 3001');
});


export default app;