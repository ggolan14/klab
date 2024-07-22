const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/dicegame', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define schema and model (example)
const gameResultSchema = new mongoose.Schema({
  userId: String,
  roundType: String,
  result: String,
});
const GameResult = mongoose.model('GameResult', gameResultSchema);

// Example API route to save game results
app.post('/api/game-results', async (req, res) => {
  const { userId, roundType, result } = req.body;

  try {
    const newResult = new GameResult({ userId, roundType, result });
    await newResult.save();
    res.status(201).json({ message: 'Game result saved.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save game result.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
