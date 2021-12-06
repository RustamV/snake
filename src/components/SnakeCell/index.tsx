import { config, SnakeCellType } from "../../helpers";
import styles from "./index.module.scss";

const { width, height } = config;

const SnakeCell = ({ particle }: { particle: SnakeCellType }) => {
    return (
        <div
            key={particle.id}
            className={styles.cell}
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
