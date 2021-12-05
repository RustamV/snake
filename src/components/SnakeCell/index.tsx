import { config, SnakeCellType } from "../../helpers";

const { width, height } = config;

const SnakeCell = ({ particle }: { particle: SnakeCellType }) => {
    return (
        <div
            key={particle.id}
            style={{
                width: width,
                height: height,
                position: "absolute",
                top: particle.y * height,
                left: particle.x * width,
                zIndex: 3,
                backgroundColor: "lightseagreen"
            }}></div>
    );
};

export default SnakeCell;
