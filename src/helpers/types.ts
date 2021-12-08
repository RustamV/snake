type CellType = {
    id: number;
    y: number;
    x: number;
};

interface SnakeCellType extends CellType {
    dir: string;
}

export type { CellType, SnakeCellType };
