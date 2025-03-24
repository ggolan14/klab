import React, { useEffect, useRef, useState } from "react";
import "./GameBoard.css";

const GRID_SIZE = 200;
const CELL_SIZE = 5; // Size of each cell in pixels
const INITIAL_POSITION = { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) };
const INITIAL_DIRECTION = -90; // Facing upwards (degrees)
const SPEED = 1; // Movement speed (cells per frame)
const TRIAL_DURATION = 60000; // 5 seconds per trial
const TOTAL_TRIALS = 5;

const GameBoard = ({ stage, onTrainingComplete, onFinishGame }) => {
  const NUM_COINS = 10;
  const [coins, setCoins] = useState([]);
  console.log("---> stage=" + stage);
  const canvasRef = useRef(null);
  const [playerPosition, setPlayerPosition] = useState(INITIAL_POSITION);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isMoving, setIsMoving] = useState(false);
  const [visitedCells, setVisitedCells] = useState(new Set([`${INITIAL_POSITION.x},${INITIAL_POSITION.y}`]));
  const [currentTrial, setCurrentTrial] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (coins.length === 0) {
      const newCoins = [];
      const usedX = new Set();
      while (newCoins.length < NUM_COINS) {
        const x = Math.floor(Math.random() * GRID_SIZE);
        if (!usedX.has(x)) {
          usedX.add(x);
          newCoins.push({ x, y: 0, found: false });
        }
      }
      setCoins(newCoins);
    }



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
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      });
    };

    const drawCoins = () => {
      
      coins.forEach(({ x, y, found }) => {
        console.log("---> in drawCoins  x="+x +"  y="+y +"    found ="+found)
        ctx.fillStyle = found ? 'green' : 'gray';
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
      drawCoins();
      drawVisitedCells();
    };

    updateCanvas();
  }, [visitedCells]);

  useEffect(() => {
    let moveInterval;
    if (isMoving) {
      moveInterval = setInterval(() => {
        setPlayerPosition((prevPos) => {
          const radians = (direction * Math.PI) / 180;
          const newX = Math.max(0, Math.min(GRID_SIZE - 1, Math.round(prevPos.x + Math.cos(radians) * SPEED)));
          const newY = Math.max(0, Math.min(GRID_SIZE - 1, Math.round(prevPos.y + Math.sin(radians) * SPEED)));

          setVisitedCells((prev) => new Set(prev).add(`${newX},${newY}`));

          // Mark coin as found if player steps on one
          setCoins(prev => prev.map(c => (c.x === newX && c.y === newY ? { ...c, found: true } : c)));

          return { x: newX, y: newY };
        });
      }, 100);
    } else {
      clearInterval(moveInterval);
    }
    return () => clearInterval(moveInterval);
  }, [isMoving, direction]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "KeyI" && !isMoving) {
        setIsMoving(true);
        setTimeout(() => {
          setIsMoving(false);

          if (stage === 'training') {
            if (onTrainingComplete) onTrainingComplete();
          } else if (stage === 'mainTask') {
            if (currentTrial < TOTAL_TRIALS) {
              setCurrentTrial((prev) => prev + 1);
              setPlayerPosition(INITIAL_POSITION);
              setDirection(INITIAL_DIRECTION);
              setVisitedCells(new Set([`${INITIAL_POSITION.x},${INITIAL_POSITION.y}`]));
            } else {
              if (onFinishGame) onFinishGame();
            }
          }
        }, TRIAL_DURATION);
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
  }, [isMoving, currentTrial, stage, onTrainingComplete, coins]);

  return (
    <div>
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
    </div>
  );
};

export default GameBoard;
