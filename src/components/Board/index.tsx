import { useEffect, useMemo, useState } from "react";
import { useInterval, useKeyDown } from "../../helpers/hooks";
import { config, SnakeCellType } from "../../helpers";
import { Apple, SnakeCell } from "..";
import styles from "./index.module.scss";

const { width, height, widthCount, heightCount, tick, rightDir, leftDir, topDir, bottomDir } = config;

const Board = ({
    gameStatus,
    startGame,
    stopGame
}: {
    gameStatus: string;
    startGame: () => void;
    stopGame: () => void;
}) => {
    const initialDirection = topDir;
    const initialSnakeBody: SnakeCellType[] = useMemo(
        () => [
            { id: 0, y: 5, x: 0, dir: initialDirection },
            { id: 1, y: 5, x: 1, dir: initialDirection },
            { id: 2, y: 5, x: 2, dir: initialDirection },
            { id: 3, y: 5, x: 3, dir: initialDirection },
            { id: 4, y: 5, x: 4, dir: initialDirection },
            { id: 5, y: 5, x: 5, dir: initialDirection }
        ],
        [initialDirection]
    );

    const [snakeBody, setSnakeBody] = useState(initialSnakeBody);
    const [direction, setDirection] = useState(initialDirection);
    useKeyDown(direction, setDirection, startGame);

    const createApple = () => {
        const getRandomInteger = (min: number, max: number) => {
            return Math.round(min - 0.5 + Math.random() * (max - min + 1));
        };
        const randomX = getRandomInteger(0, widthCount - 1);
        const randomY = getRandomInteger(0, heightCount - 1);
        return { id: 999, y: randomY, x: randomX };
    };
    const [apple, setApple] = useState(createApple());

    const moveSnake = () => {
        if (gameStatus !== "stopped") {
            setSnakeBody((prevBody) => {
                let newBody = [...prevBody];

                if (direction === rightDir) {
                    newBody[0] = { ...prevBody[0], x: prevBody[0].x + 1 >= widthCount ? 0 : prevBody[0].x + 1 };
                }
                if (direction === leftDir) {
                    newBody[0] = { ...prevBody[0], x: prevBody[0].x - 1 < 0 ? widthCount - 1 : prevBody[0].x - 1 };
                }
                if (direction === bottomDir) {
                    newBody[0] = { ...prevBody[0], y: prevBody[0].y + 1 >= heightCount ? 0 : prevBody[0].y + 1 };
                }
                if (direction === topDir) {
                    newBody[0] = { ...prevBody[0], y: prevBody[0].y - 1 < 0 ? heightCount - 1 : prevBody[0].y - 1 };
                }
                newBody[0].dir = direction;
                for (let i = 1; i < prevBody.length; i++) {
                    newBody[i] = {
                        id: newBody[i].id,
                        x: prevBody[i - 1].x,
                        y: prevBody[i - 1].y,
                        dir: prevBody[i - 1].dir
                    };
                }

                checkIfSnakeEatHerself(newBody);

                return newBody;
            });
        }
    };

    const checkIfAppleWasEaten = () => {
        if (snakeBody[0].x === apple.x && snakeBody[0].y === apple.y) {
            setApple(createApple());
            growSnakeBody();
        }
    };

    const checkIfSnakeEatHerself = (currentBody: SnakeCellType[]) => {
        let collision = false;
        currentBody.forEach((particle) => {
            let hasTwoParticlesCollided = currentBody.find(
                (currentParticle) =>
                    currentParticle.x === particle.x &&
                    currentParticle.y === particle.y &&
                    currentParticle.id !== particle.id
            );
            if (hasTwoParticlesCollided) {
                collision = true;
            }
        });
        if (collision) stopGame();
    };

    const growSnakeBody = () => {
        setSnakeBody((prev) => {
            const tail = prev[prev.length - 1];
            let newX: number = tail.x,
                newY: number = tail.y;
            if (tail.dir === rightDir) newX--;
            if (tail.dir === leftDir) newX++;
            if (tail.dir === topDir) newY--;
            if (tail.dir === bottomDir) newY++;

            const newTail = { id: tail.id + 1, x: newX, y: newY, dir: tail.dir };
            return [...prev, newTail];
        });
    };

    const gameUpdate = () => {
        moveSnake();
        checkIfAppleWasEaten();
    };

    useInterval(() => {
        gameUpdate();
    }, tick);

    useEffect(() => {
        if (gameStatus === "playing") {
            setSnakeBody(initialSnakeBody);
            setDirection(initialDirection);
        }
    }, [gameStatus, initialSnakeBody, initialDirection]);

    return (
        <div style={{ width: width * widthCount, height: height * heightCount }} className={styles.board}>
            <div className={styles.inner}></div>
            <Apple apple={apple} />
            {snakeBody.map((particle) => (
                <SnakeCell particle={particle} key={particle.id} />
            ))}
        </div>
    );
};

export default Board;
