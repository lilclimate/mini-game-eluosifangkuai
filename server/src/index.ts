import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import Score from './models/Score';

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tetris');

app.get('/scores', async (_req, res) => {
  const scores = await Score.find().sort({ points: -1 }).limit(10);
  res.json(scores);
});

app.post('/scores', async (req, res) => {
  const { name, points } = req.body;
  const score = new Score({ name, points });
  await score.save();
  res.status(201).json(score);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
