import React, { useEffect, useRef, useState } from "react";
import "./GameBoard.css";

const GRID_SIZE = 200;
const CELL_SIZE = 4;
const INITIAL_POSITION = { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) };
const INITIAL_DIRECTION = -90;
const SPEED = 1;
const TRIAL_DURATION = 120000; // 2 minutes
const TOTAL_TRIALS = 5;
let showPath;

const GameBoard = ({ stage, GameCondition, onTrainingComplete, onFinishGame,gameSettings }) => {
  const [coins, setCoins] = useState([]);
  const canvasRef = useRef(null);
  const [playerPosition, setPlayerPosition] = useState(INITIAL_POSITION);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isMoving, setIsMoving] = useState(false);
  const [visitedCells, setVisitedCells] = useState(new Set([`${INITIAL_POSITION.x},${INITIAL_POSITION.y}`]));
  const [currentTrial, setCurrentTrial] = useState(1);
  const [timeLeft, setTimeLeft] = useState(TRIAL_DURATION / 1000);
  const [trialStarted, setTrialStarted] = useState(false);
  showPath = gameSettings.game.show_path=="true" ? true : false
  
  useEffect(() => {
    const loadCoinsFromCSV = async () => {
      const fileName = GameCondition === 'clustered' ? 'clustered_resources.csv' : 'diffuse_resources.csv';
      try {
        const response = await fetch(`/${fileName}`);
        const text = await response.text();
        const rows = text.trim().split('\n').slice(1);
        const parsed = rows.map(row => {
          const [x, y] = row.split(',').map(Number);
          return { x, y, found: false };
        });
        setCoins(parsed);
      } catch (error) {
        console.error('Error loading CSV:', error);
      }
    };

    loadCoinsFromCSV();
  }, [GameCondition, currentTrial]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawGrid = () => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
        ctx.stroke();
      }
    };

    const drawVisitedCells = () => {
      
      ctx.fillStyle = "blue";
      visitedCells.forEach((cell) => {
        const [x, y] = cell.split(",").map(Number);
        if(showPath)
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      });
      
    };

    const drawCoins = () => {
      coins.forEach(({ x, y, found }) => {
        
        if(found){
          console.log("===> coin that was found x="+x+"  y="+y+" found="+found)
          ctx.fillStyle = 'red';
        }
        else{
        ctx.fillStyle = 'grey';
      }
        ctx.beginPath();
        ctx.arc(
          x * CELL_SIZE + CELL_SIZE / 2,
          y * CELL_SIZE + CELL_SIZE / 2,
          CELL_SIZE / 2,
          0,
          2 * Math.PI
        );
        ctx.fill();
      });
    };

    const updateCanvas = () => {
      drawGrid();
      drawVisitedCells();
      drawCoins();
      
    };

    updateCanvas();
  }, [visitedCells, coins]);

  useEffect(() => {
    let moveInterval;
    if (isMoving) {
      moveInterval = setInterval(() => {
        setPlayerPosition((prevPos) => {
          const radians = (direction * Math.PI) / 180;
          let newX = (Math.round(prevPos.x + Math.cos(radians) * SPEED) + GRID_SIZE) % GRID_SIZE;
          let newY = (Math.round(prevPos.y + Math.sin(radians) * SPEED) + GRID_SIZE) % GRID_SIZE;

          setVisitedCells((prev) => new Set(prev).add(`${newX},${newY}`));
          setCoins(prev => {
            let updated = false;
            const newCoins = prev.map(c => {
              if (c.x === newX && c.y === newY && !c.found) {
                console.log(`Coin found at (${newX}, ${newY})`);
                updated = true;
                return { ...c, found: true };
              }
              return c;
            });
            return updated ? [...newCoins] : prev;
          });

          return { x: newX, y: newY };
        });
      }, 100);
    } else {
      clearInterval(moveInterval);
    }
    return () => clearInterval(moveInterval);
  }, [isMoving, direction]);

  useEffect(() => {
    if (!trialStarted) return;

    let current = timeLeft;
    setTimeLeft(current);

    const timer = setInterval(() => {
      current -= 1;
      setTimeLeft(current);
      if (current <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [trialStarted, currentTrial]);

  useEffect(() => {
    const clock = document.getElementById("clock");
    if (!clock) return;
    const ctx = clock.getContext("2d");
    const radius = clock.height / 2;
    ctx.clearRect(0, 0, clock.width, clock.height);
    ctx.save();
    ctx.translate(radius, radius);
    ctx.scale(-1, 1);

    ctx.beginPath();
    ctx.arc(0, 0, radius - 2, 0, 2 * Math.PI);
    ctx.fillStyle = "lightgray";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();

    const elapsedRatio = (TRIAL_DURATION / 1000 - timeLeft) / (TRIAL_DURATION / 1000);
    const angle = 2 * Math.PI * elapsedRatio;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius - 2, -Math.PI / 2, -Math.PI / 2 - angle, true);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.restore();
  }, [timeLeft]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "KeyI") {
        if (!trialStarted) {
          setTrialStarted(true);
          setIsMoving(true);
          setTimeout(() => {
            setIsMoving(false);
            if (stage === 'training') {
              if (onTrainingComplete) onTrainingComplete();
            } else if (stage === 'mainTask') {
              if (currentTrial < TOTAL_TRIALS) {
                setCurrentTrial((prev) => prev + 1);
                setTimeLeft(TRIAL_DURATION / 1000);
                setTrialStarted(false);
                setPlayerPosition(INITIAL_POSITION);
                setDirection(INITIAL_DIRECTION);
                setVisitedCells(new Set([`${INITIAL_POSITION.x},${INITIAL_POSITION.y}`]));
              } else {
                if (onFinishGame) onFinishGame();
              }
            }
          }, TRIAL_DURATION);
        } else {
          setIsMoving(true);
        }
      } else if (event.code === "KeyK") {
        setIsMoving(false);
      } else if (event.code === "KeyJ") {
        setDirection((prevDir) => prevDir - 35);
      } else if (event.code === "KeyL") {
        setDirection((prevDir) => prevDir + 35);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMoving, currentTrial, stage, onTrainingComplete, coins, trialStarted]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      {stage === 'mainTask' ? (
        <h2 style={{ textAlign: "center" }}>Trial {currentTrial} out of {TOTAL_TRIALS}</h2>
      ) : (
        <h2 style={{ textAlign: "center", color: "red" }}>Training round</h2>
      )}
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        className="game-canvas"
      />
      {trialStarted && (
        <canvas
          id="clock"
          width="60"
          height="60"
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            borderRadius: "50%",
            backgroundColor: "white",
            border: "2px solid black",
          }}
        />
      )}
    </div>
  );
};

export default GameBoard;
