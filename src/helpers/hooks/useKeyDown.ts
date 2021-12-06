import { useEffect, Dispatch, SetStateAction } from "react";
import { config } from "../index";

const { spaceKeyCode, leftKeyCode, topKeyCode, rightKeyCode, bottomKeyCode, rightDir, leftDir, topDir, bottomDir } =
    config;

const useKeyDown = (
    direction: string,
    setDirection: Dispatch<SetStateAction<string>>,
    setGameStatus: Dispatch<SetStateAction<string>>
) => {
    useEffect(() => {
        const onKeyDown = (event: any) => {
            const { keyCode } = event;

            if (keyCode === spaceKeyCode) {
                setGameStatus((prev) => (prev === "stopped" ? "playing" : "stopped"));
            }
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

        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [direction, setDirection]);
};

export default useKeyDown;
