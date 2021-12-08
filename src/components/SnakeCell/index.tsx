import { config, SnakeCellType } from "../../helpers";
import styles from "./index.module.scss";
import cn from "classnames";

const { width, height, rightDir, leftDir } = config;

const SnakeCell = ({ particle }: { particle: SnakeCellType }) => {
    return (
        <div
            className={cn(styles.cell, {
                [styles.horizontal]: particle.dir === rightDir || particle.dir === leftDir
            })}
            style={{
                width: width,
                height: height,
                top: particle.y * height,
                left: particle.x * width
            }}>
            <span></span>
            <span></span>
            <span></span>
        </div>
    );
};

export default SnakeCell;
