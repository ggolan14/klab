let totalScore = 0;
let greenScore = 0;
let blueScore = 0;

export const getTotalScore = () => totalScore;
export const setTotalScore = (newScore) => {
  totalScore = newScore;
};

export const getGreenScore = () => greenScore;
export const setGreenScore = (newGreenScore) => {
  greenScore = newGreenScore;
};

export const getBlueScore = () => blueScore;
export const setBlueScore = (newBlueScore) => {
  blueScore = newBlueScore;
};