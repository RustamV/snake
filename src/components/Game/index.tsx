import { useState } from "react";
import { useInterval, useKeyDown } from "../../helpers/hooks";
import styles from "./index.module.scss";
import { config, SnakeCellType } from "../../helpers";
import { SnakeCell } from "..";

const { width, height, widthCount, heightCount, tick, rightDir, leftDir, topDir, bottomDir } = config;

const Game = () => {
    const initialDirection = topDir;
    const initialSnakeBody: SnakeCellType[] = [
        { id: 0, y: 5, x: 0, dir: initialDirection },
        { id: 1, y: 5, x: 1, dir: initialDirection },
        { id: 2, y: 5, x: 2, dir: initialDirection },
        { id: 3, y: 5, x: 3, dir: initialDirection },
        { id: 4, y: 5, x: 4, dir: initialDirection },
        { id: 5, y: 5, x: 5, dir: initialDirection }
    ];

    const [snakeBody, setSnakeBody] = useState(initialSnakeBody);
    const [direction, setDirection] = useState(initialDirection);
    const [gameStatus, setGameStatus] = useState("playing");
    useKeyDown(direction, setDirection, setGameStatus);

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
        if (collision) setGameStatus("stopped");
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

    return (
        <div className={styles.game}>
            <div style={{ width: width * widthCount, height: height * heightCount, position: "relative" }}>
                <div
                    style={{ width: "100%", height: "100%", position: "absolute", top: -1, left: -1, zIndex: 1 }}
                    className={styles.board}></div>
                <div
                    key={apple.id}
                    style={{
                        width: width,
                        height: height,
                        position: "absolute",
                        top: apple.y * height,
                        left: apple.x * width,
                        zIndex: 2,
                        backgroundColor: "tomato",
                        borderRadius: "50%"
                    }}></div>
                {snakeBody.map((particle) => (
                    <SnakeCell particle={particle} />
                ))}
            </div>
        </div>
    );
};

export default Game;
