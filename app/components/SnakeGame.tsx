'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 15;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 150;

interface Position {
  x: number;
  y: number;
}

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const directionRef = useRef(direction);
  const [touchStart, setTouchStart] = useState<Position | null>(null);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
  }, []);

  const checkCollision = useCallback((head: Position, snakeBody: Position[]) => {
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    for (let segment of snakeBody) {
      if (head.x === segment.x && head.y === segment.y) {
        return true;
      }
    }
    return false;
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y,
      };

      if (checkCollision(newHead, prevSnake)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((prev) => prev + 10);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [gameOver, food, generateFood, checkCollision]);

  useEffect(() => {
    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key;
    setDirection((prevDir) => {
      if (key === 'ArrowUp' && prevDir.y === 0) return { x: 0, y: -1 };
      if (key === 'ArrowDown' && prevDir.y === 0) return { x: 0, y: 1 };
      if (key === 'ArrowLeft' && prevDir.x === 0) return { x: -1, y: 0 };
      if (key === 'ArrowRight' && prevDir.x === 0) return { x: 1, y: 0 };
      return prevDir;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      setDirection((prevDir) => {
        if (deltaX > 0 && prevDir.x === 0) return { x: 1, y: 0 }; // Right
        if (deltaX < 0 && prevDir.x === 0) return { x: -1, y: 0 }; // Left
        return prevDir;
      });
    } else {
      // Vertical swipe
      setDirection((prevDir) => {
        if (deltaY > 0 && prevDir.y === 0) return { x: 0, y: 1 }; // Down
        if (deltaY < 0 && prevDir.y === 0) return { x: 0, y: -1 }; // Up
        return prevDir;
      });
    }
    
    setTouchStart(null);
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    generateFood();
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 md:p-4">
      <div className="mb-4 text-center">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
          🐍 Play Snake While We Fetch Your Leads!
        </h3>
        <p className="text-gray-600 text-sm mb-2">
          Use arrow keys or swipe to control
        </p>
        <div className="text-blue-600 text-xl font-bold">
          Score: {score}
        </div>
      </div>

      <div
        className="relative bg-gray-100 rounded-lg border-4 border-blue-500 shadow-xl"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Food */}
        <div
          className="absolute bg-red-500 rounded-full shadow-lg"
          style={{
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute rounded-sm ${
              index === 0 ? 'bg-blue-600' : 'bg-blue-500'
            }`}
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
            }}
          />
        ))}

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-white/95 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <p className="text-red-500 text-2xl font-bold mb-4">Game Over!</p>
              <p className="text-gray-800 text-xl mb-4">Score: {score}</p>
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-sky-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-sky-700 transition-all"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-gray-600 text-xs text-center max-w-sm">
        Your leads are being scraped in the background. This usually takes 10-30 seconds.
      </div>
    </div>
  );
}

