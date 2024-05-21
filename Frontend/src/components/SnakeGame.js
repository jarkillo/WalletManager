import React, { useState, useEffect } from 'react';
import './SnakeGame.css';

const SnakeGame = () => {
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [direction, setDirection] = useState({ x: 0, y: -1 });
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [score, setScore] = useState(0);

    useEffect(() => {
        const handleKeyPress = (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    setDirection({ x: 0, y: -1 });
                    break;
                case 'ArrowDown':
                    setDirection({ x: 0, y: 1 });
                    break;
                case 'ArrowLeft':
                    setDirection({ x: -1, y: 0 });
                    break;
                case 'ArrowRight':
                    setDirection({ x: 1, y: 0 });
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    useEffect(() => {
        const moveSnake = () => {
            setSnake((prevSnake) => {
                const newSnake = [...prevSnake];
                const head = {
                    x: newSnake[0].x + direction.x,
                    y: newSnake[0].y + direction.y,
                };

                if (head.x === food.x && head.y === food.y) {
                    setFood({
                        x: Math.floor(Math.random() * 20),
                        y: Math.floor(Math.random() * 20),
                    });
                    setScore(score + 10);
                } else {
                    newSnake.pop();
                }

                newSnake.unshift(head);
                return newSnake;
            });
        };

        const interval = setInterval(moveSnake, 200);
        return () => clearInterval(interval);
    }, [direction, food, score]);

    return (
        <div className="snake-game">
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
