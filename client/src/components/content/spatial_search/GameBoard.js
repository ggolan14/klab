import React, { useEffect, useRef, useState } from "react";
import "./GameBoard.css";
import { getTimeDate } from "../../../utils/app_utils";

const GRID_SIZE = 200;
const CELL_SIZE = 3;
const INITIAL_POSITION = { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) };
const INITIAL_DIRECTION = -90;
const SPEED = 1;
const TRIAL_DURATION = 120000;
const TOTAL_TRIALS = 3;
let showPath;
let showResources;

const GameBoard = ({ stage, GameCondition, onTrainingComplete, onFinishGame, gameSettings, insertGameLine, sendDataToDB }) => {
  const [coins, setCoins] = useState([]);
  const canvasRef = useRef(null);
  //const [playerPosition, setPlayerPosition] = useState(INITIAL_POSITION);
  const [playerPosition, setPlayerPosition] = useState({
    x: INITIAL_POSITION.x,
    y: INITIAL_POSITION.y,
    realX: INITIAL_POSITION.x,
    realY: INITIAL_POSITION.y
  });
  const playerPositionRef = useRef(playerPosition);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isMoving, setIsMoving] = useState(false);
  const [visitedCells, setVisitedCells] = useState(new Set([`${INITIAL_POSITION.x},${INITIAL_POSITION.y}`]));
  const [currentTrial, setCurrentTrial] = useState(1);
  const [timeLeft, setTimeLeft] = useState(TRIAL_DURATION / 1000);
  const [trialStarted, setTrialStarted] = useState(false);
  const [totalFoundCoins, setTotalFoundCoins] = useState(0);
  const totalFoundCoinsRef = useRef(0);
  const isOutsideGrid = useRef(false);
  showPath = gameSettings.game.show_path == "true" ? true : false;
  showResources = gameSettings.game.show_resources == "true" ? true : false;

  useEffect(() => {
    playerPositionRef.current = playerPosition;
  }, [playerPosition]);

  useEffect(() => {
    const loadCoinsFromCSV = async () => {
      const fileName = GameCondition === 'Clustered' ? 'clustered_resources.csv' : 'diffuse_resources.csv';
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
      ctx.strokeStyle = "grey";
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
        if (showPath) {
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      });

      ctx.fillStyle = "darkblue";
      const px = (playerPosition.realX ?? playerPosition.x) * CELL_SIZE;
      const py = (playerPosition.realY ?? playerPosition.y) * CELL_SIZE;
      
      ctx.beginPath();
      ctx.arc(px + CELL_SIZE / 2, py + CELL_SIZE / 2, CELL_SIZE / 2, 0, 2 * Math.PI);
      ctx.fill();
    };

    const drawCoins = () => {
      coins.forEach(({ x, y, found }) => {
        if (found) {
          ctx.fillStyle = 'red';
          ctx.beginPath();
          ctx.arc(
            x * CELL_SIZE + CELL_SIZE / 2,
            y * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE / 2,
            0,
            2 * Math.PI
          );
          ctx.fill();
        }
        else if (showResources) {
          ctx.fillStyle = 'grey';
          ctx.beginPath();
          ctx.arc(
            x * CELL_SIZE + CELL_SIZE / 2,
            y * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE / 2,
            0,
            2 * Math.PI
          );
          ctx.fill();
        }
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
          const deltaX = Math.cos(radians) * SPEED;
          const deltaY = Math.sin(radians) * SPEED;
        
          const prevRealX = prevPos.realX ?? prevPos.x;
          const prevRealY = prevPos.realY ?? prevPos.y;
        
          let realX = prevRealX + deltaX;
          let realY = prevRealY + deltaY;
        
          const center = GRID_SIZE / 2;
          let didExit = false;
        
          // Vertical wrapping (top <-> bottom)
          if (realY < 0) {
            didExit = true;
            realX = 2 * center - realX;
            realY = GRID_SIZE - 1;
          } else if (realY >= GRID_SIZE) {
            didExit = true;
            realX = 2 * center - realX;
            realY = 0;
          }
        
          // Horizontal wrapping (left <-> right)
          if (realX < 0) {
            didExit = true;
            realY = 2 * center - realY;
            realX = GRID_SIZE - 1;
          } else if (realX >= GRID_SIZE) {
            didExit = true;
            realY = 2 * center - realY;
            realX = 0;
          }
        
          // Convert to integer cell positions
          const newX = Math.floor(realX);
          const newY = Math.floor(realY);
        
          // Exit and entry logging
          if (didExit) {
            const exitAction = `Exited grid at (${prevPos.x}, ${prevPos.y}) Direction (${direction})`;
            console.log("---> exitAction =", exitAction);
            insertLine(exitAction);
        
            const entryAction = `Re-entered grid at (${newX}, ${newY}) Direction (${direction})`;
            console.log("---> entryAction =", entryAction);
            insertLine(entryAction);
          }
        
          // Track visited cells
          setVisitedCells((prev) => new Set(prev).add(`${newX},${newY}`));
        
          // Check for coin collection
          setCoins((prev) => {
            let updated = false;
            let newlyFound = 0;
            const newCoins = prev.map((c) => {
              if (c.x === newX && c.y === newY && !c.found) {
                const foundCoinAction = `Coin found at (${newX}, ${newY})`;
                console.log(foundCoinAction);
                insertLine(foundCoinAction);
                updated = true;
                newlyFound++;
                return { ...c, found: true };
              }
              return c;
            });
        
            if (newlyFound > 0) {
              setTotalFoundCoins((prevTotal) => {
                const updatedTotal = prevTotal + newlyFound;
                totalFoundCoinsRef.current = updatedTotal;
                console.log("[Updated totalFoundCoins]", updatedTotal);
                return updatedTotal;
              });
            }
        
            return updated ? [...newCoins] : prev;
          });
        
          return {
            x: newX,
            y: newY,
            realX,
            realY,
          };
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
    ctx.fillStyle = "lightgreen";
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
      let action = "Unknown"
      if (event.code === "KeyI") {
        action = "Go"
        if (!trialStarted) {
          setTimeLeft(TRIAL_DURATION / 1000);
          setTrialStarted(true);
          setIsMoving(true);
          setTimeout(() => {
            setIsMoving(false);
            if (stage === 'training') {
              if (onTrainingComplete) onTrainingComplete();
            } else if (stage === 'mainTask') {
              if (currentTrial < TOTAL_TRIALS) {
                setCurrentTrial((prev) => prev + 1);
                sendDataToDB(false);
                setTimeLeft(TRIAL_DURATION / 1000);
                setTrialStarted(false);
                setPlayerPosition(INITIAL_POSITION);
                setDirection(INITIAL_DIRECTION);
                setVisitedCells(new Set([`${INITIAL_POSITION.x},${INITIAL_POSITION.y}`]));
              } else {
                if (onFinishGame) {
                  console.log("[Final totalFoundCoins]", totalFoundCoinsRef.current);
                  onFinishGame(totalFoundCoinsRef.current);
                }
              }
            }
          }, TRIAL_DURATION);
        } else {
          setIsMoving(true);
        }
      } else if (event.code === "KeyK") {
        action = "Stop"
        setIsMoving(false);
      } else if (event.code === "KeyJ") {
        action = "Left";
        setDirection((prevDir) => {
          console.log("---->  playerPositionRef.current.y="+playerPositionRef.current.y+"   playerPosition.y="+playerPosition.y)
          const rotationStep = -35;
          const rawNewDir = prevDir + rotationStep;
          const newDir = normalize(rawNewDir);
      
          console.log(
            `Turning Left: Direction before = ${prevDir}, raw after = ${rawNewDir}, normalized after = ${newDir}, change = +${rotationStep}, position = (${playerPositionRef.current.x}, ${playerPositionRef.current.y})`
          );
      
          return newDir;
        });
      } else if (event.code === "KeyL") {
        action = "Right";
        console.log("--------> playerPosition.x= "+playerPosition.x+"   playerPosition.y= "+playerPosition.y+"  ")
        setDirection((prevDir) => {
          const rotationStep = 35;
          const rawNewDir = prevDir + rotationStep;
          const newDir = normalize(rawNewDir);
      
          console.log(
            `Turning Right: Direction before = ${prevDir}, raw after = ${rawNewDir}, normalized after = ${newDir}, change = ${rotationStep}, position = (${playerPositionRef.current.x}, ${playerPositionRef.current.y})`
          );
      
          return newDir;
        });
      }

      insertLine(action);

    };


    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMoving, currentTrial, stage, onTrainingComplete, coins, trialStarted]);

  const normalize = (angle) => ((angle % 360) + 360) % 360;


  const insertLine = (action) => {
    const db_row = {
      GameCondition: GameCondition,
      Trail: currentTrial,
      Action: action,
      Time: getTimeDate().time,
    };
    insertGameLine(db_row);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      {stage === 'mainTask' ? (
        <h2 style={{ textAlign: "center" }}>Trial {currentTrial} out of {TOTAL_TRIALS} | Found: {totalFoundCoins}</h2>
      ) : (
        <h2 style={{ textAlign: "center", color: "red" }}>Training round</h2>
      )}
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        className="game-canvas"
      />
      {stage === 'training' && (
        <div
          style={{
            position: 'absolute',
            bottom: 4,
            right: -150,
            fontWeight: 'bold',
            color: 'green',
            backgroundColor: 'yellow',
          }}
        >
          ==&gt; EXIT
        </div>
      )}
      {(stage === 'mainTask' || stage === 'training') && trialStarted && (
        <canvas
          id="clock"
          width="60"
          height="60"
          style={{
            position: "absolute",
            top: 100,
            right: -200,
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
