import { config, CellType } from "../../helpers";
import styles from "./index.module.scss";

const { width, height } = config;

const Apple = ({ apple }: { apple: CellType }) => {
    return (
        <div
            key={apple.id}
            className={styles.apple}
            style={{
                width: width,
                height: height,
                top: apple.y * height,
                left: apple.x * width
            }}></div>
    );
};

export default Apple;
