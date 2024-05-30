import React, { useState, useEffect, useRef } from 'react';
import './SnakeGame.css';

const SnakeGame = () => {
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [direction, setDirection] = useState({ x: 0, y: -1 });
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [highScores, setHighScores] = useState([]);
    const [speed, setSpeed] = useState(200);
    const gameInterval = useRef(null);

    const handleKeyPress = (event) => {
        switch (event.key) {
            case 'ArrowUp':
                if (direction.y === 0) setDirection({ x: 0, y: -1 });
                break;
            case 'ArrowDown':
                if (direction.y === 0) setDirection({ x: 0, y: 1 });
                break;
            case 'ArrowLeft':
                if (direction.x === 0) setDirection({ x: -1, y: 0 });
                break;
            case 'ArrowRight':
                if (direction.x === 0) setDirection({ x: 1, y: 0 });
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [direction]);

    const checkCollision = (head) => {
        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
            return true;
        }
        for (let segment of snake) {
            if (segment.x === head.x && segment.y === head.y) {
                return true;
            }
        }
        return false;
    };

    useEffect(() => {
        const moveSnake = () => {
            setSnake((prevSnake) => {
                const newSnake = [...prevSnake];
                const head = {
                    x: newSnake[0].x + direction.x,
                    y: newSnake[0].y + direction.y,
                };

                if (checkCollision(head)) {
                    setIsGameOver(true);
                    setHighScores((prevScores) => {
                        const newScores = [...prevScores, score];
                        return [...new Set(newScores)].sort((a, b) => b - a).slice(0, 5);
                    });
                    clearInterval(gameInterval.current);
                    return prevSnake;
                }

                if (head.x === food.x && head.y === food.y) {
                    setFood({
                        x: Math.floor(Math.random() * 20),
                        y: Math.floor(Math.random() * 20),
                    });
                    setScore(score + 10);
                    setSpeed((prevSpeed) => Math.max(prevSpeed - 10, 50));
                } else {
                    newSnake.pop();
                }

                newSnake.unshift(head);
                return newSnake;
            });
        };

        if (!isGameOver) {
            clearInterval(gameInterval.current);
            gameInterval.current = setInterval(moveSnake, speed);
            return () => clearInterval(gameInterval.current);
        }
    }, [direction, food, score, isGameOver, speed]);

    const resetGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setDirection({ x: 0, y: -1 });
        setFood({ x: 15, y: 15 });
        setScore(0);
        setIsGameOver(false);
        setSpeed(200);
        clearInterval(gameInterval.current);
        gameInterval.current = setInterval(() => {
            setSnake((prevSnake) => {
                const newSnake = [...prevSnake];
                const head = {
                    x: newSnake[0].x + direction.x,
                    y: newSnake[0].y + direction.y,
                };

                if (checkCollision(head)) {
                    setIsGameOver(true);
                    setHighScores((prevScores) => {
                        const newScores = [...prevScores, score];
                        return [...new Set(newScores)].sort((a, b) => b - a).slice(0, 5);
                    });
                    clearInterval(gameInterval.current);
                    return prevSnake;
                }

                if (head.x === food.x && head.y === food.y) {
                    setFood({
                        x: Math.floor(Math.random() * 20),
                        y: Math.floor(Math.random() * 20),
                    });
                    setScore(score + 10);
                    setSpeed((prevSpeed) => Math.max(prevSpeed - 10, 50));
                } else {
                    newSnake.pop();
                }

                newSnake.unshift(head);
                return newSnake;
            });
        }, speed);
    };

    return (
        <div className="snake-game">
            {isGameOver && (
                <div className="game-over-modal">
                    <div className="game-over-content">
                        <h2>Game Over</h2>
                        <p>Your Score: {score}</p>
                        <button onClick={resetGame}>Play Again</button>
                        <h3>High Scores</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {highScores.map((highScore, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{highScore}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <div className="score">Score: {score}</div>
            <div className="board">
                {snake.map((segment, index) => (
                    <div
                        key={index}
                        className="snake-segment"
                        style={{ left: `${segment.x * 5}%`, top: `${segment.y * 5}%` }}
                    />
                ))}
                <div
                    className="food"
                    style={{ left: `${food.x * 5}%`, top: `${food.y * 5}%` }}
                />
            </div>
        </div>
    );
};

export default SnakeGame;
