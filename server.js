require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;
let db;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

MongoClient.connect(uri)
  .then(client => {
    db = client.db();
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch(console.error);

// Get tasks with optional filtering/search
app.get('/api/tasks', async (req, res) => {
  const { status, search } = req.query;
  const filter = {};
  if (status === 'active') filter.completed = false;
  if (status === 'completed') filter.completed = true;
  if (search) filter.text = { $regex: search, $options: 'i' };
  const tasks = await db.collection('tasks')
    .find(filter)
    .sort({ dueDate: 1, priority: -1 })
    .toArray();
  res.json(tasks);
});

// Create a new task
app.post('/api/tasks', async (req, res) => {
  const { text, dueDate, priority } = req.body;
  const task = { text, completed: false, dueDate, priority };
  const { insertedId } = await db.collection('tasks').insertOne(task);
  const newTask = await db.collection('tasks').findOne({ _id: insertedId });
  res.json(newTask);
});

// Update any field(s) on a task
app.put('/api/tasks/:id', async (req, res) => {
  const id = new ObjectId(req.params.id);
  await db.collection('tasks').updateOne({ _id: id }, { $set: req.body });
  res.json({ success: true });
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  const id = new ObjectId(req.params.id);
  await db.collection('tasks').deleteOne({ _id: id });
  res.json({ success: true });
});