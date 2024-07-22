// src/sendGameResult.js

import axios from 'axios';

const sendGameResult = async (userId, roundType, result) => {
  try {
    await axios.post('http://localhost:5000/api/game-results', {
      userId,
      roundType,
      result,
    });
    console.log('Game result saved successfully.');
  } catch (error) {
    console.error('Error saving game result:', error);
  }
};

export default sendGameResult;
