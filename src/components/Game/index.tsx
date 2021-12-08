import { useState } from "react";
import { Board } from "..";
import styles from "./index.module.scss";

const Game = () => {
    const [gameStatus, setGameStatus] = useState("playing");

    const startGame = () => {
        setGameStatus("playing");
    };

    const stopGame = () => {
        setGameStatus("stopped");
    };

    return (
        <div className={styles.game}>
            <header className={styles.header}>
                <span className={styles.title}>Snake Game</span>
                <button className={styles.button} onClick={gameStatus === "playing" ? stopGame : startGame}>
                    {gameStatus === "playing" ? "Stop" : "Start"}
                </button>
            </header>
            <Board gameStatus={gameStatus} startGame={startGame} stopGame={stopGame} />
        </div>
    );
};

export default Game;
