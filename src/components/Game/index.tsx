import { useEffect, useState } from "react";
import { useInterval } from "../../helpers/hooks";
import styles from "./index.module.scss";
import { config } from "../../helpers";

const {
    width,
    height,
    widthCount,
    heightCount,
    leftKeyCode,
    topKeyCode,
    rightKeyCode,
    bottomKeyCode,
    tick,
    rightDir,
    leftDir,
    topDir,
    bottomDir
} = config;

type snakeCell = {
    id: number;
    y: number;
    x: number;
};

const body: snakeCell[] = [
    { id: 0, y: 0, x: 0 },
    { id: 1, y: 0, x: 1 },
    { id: 2, y: 0, x: 2 },
    { id: 3, y: 0, x: 3 },
    { id: 4, y: 0, x: 4 },
    { id: 5, y: 0, x: 5 }
];

const Game = () => {
    const [snakeBody, setSnakeBody] = useState(body);
    const [direction, setDirection] = useState(leftDir);

    const moveSnake = () => {
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

            for (let i = 1; i < prevBody.length; i++) {
                newBody[i] = { id: newBody[i].id, x: prevBody[i - 1].x, y: prevBody[i - 1].y };
            }

            return newBody;
        });
    };

    const gameUpdate = () => {
        setTimeout(() => {
            moveSnake();
        }, tick);
    };

    useInterval(() => {
        gameUpdate();
    }, tick);

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [direction]);

    const onKeyDown = (event: any) => {
        const { keyCode } = event;

        if (keyCode === rightKeyCode && direction !== rightDir && direction !== leftDir) {
            setDirection(rightDir);
        }
        if (keyCode === leftKeyCode && direction !== rightDir && direction !== leftDir) {
            setDirection(leftDir);
        }
        if (keyCode === topKeyCode && direction !== topDir && direction !== bottomDir) {
            setDirection(topDir);
        }
        if (keyCode === bottomKeyCode && direction !== topDir && direction !== bottomDir) {
            setDirection(bottomDir);
        }
    };

    return (
        <div className={styles.game}>
            <div style={{ width: width * widthCount, height: height * heightCount, position: "relative" }}>
                <div
                    style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, zIndex: 1 }}
                    className={styles.board}></div>
                {snakeBody.map((particle) => {
                    return (
                        <div
                            key={particle.id}
                            style={{
                                width: width,
                                height: height,
                                position: "absolute",
                                top: particle.y * height,
                                left: particle.x * width,
                                zIndex: 2,
                                backgroundColor: "lightseagreen"
                            }}></div>
                    );
                })}
            </div>
        </div>
    );
};

export default Game;
