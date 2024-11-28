// Declare variables to store scores for total, green button, and blue button
let totalScore = 0; // Holds the cumulative score for the game
let greenScore = 0; // Holds the score for the green button
let blueScore = 0; // Holds the score for the blue button

// Getter function for totalScore
// Returns the current total score in the game
export const getTotalScore = () => totalScore;

// Setter function for totalScore
// Updates the total score with a new value
// @param {number} newScore - The new total score to be set
export const setTotalScore = (newScore) => {
  totalScore = newScore;
};

// Getter function for greenScore
// Returns the current score for the green button
export const getGreenScore = () => greenScore;

// Setter function for greenScore
// Updates the score for the green button with a new value
// @param {number} newGreenScore - The new score for the green button to be set
export const setGreenScore = (newGreenScore) => {
  greenScore = newGreenScore;
};

// Getter function for blueScore
// Returns the current score for the blue button
export const getBlueScore = () => blueScore;

// Setter function for blueScore
// Updates the score for the blue button with a new value
// @param {number} newBlueScore - The new score for the blue button to be set
export const setBlueScore = (newBlueScore) => {
  blueScore = newBlueScore;
};
