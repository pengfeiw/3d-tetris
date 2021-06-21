import React, {useRef, useState} from "react";
import {useEffect} from "react";
import {draw, gameRunData} from "./util/painter";
import {columnCount as WIDTH, rowCount as HEIGHT} from "../../data/shaderData";
import ShapeCreator from "./util/shapeCreator";
import Shape from "./util/shape";
import {GameStatus} from "../../tetris.interface";
import {vec3} from "gl-matrix";
import "./index.less";

type CellData = (0 | 1)[][];
interface MainScreenProps {
    gameStatus: GameStatus;
}

const getInitData = () => {
    const data: CellData = [];
    for (let i = 0; i < HEIGHT; i++) {
        const rowData: 0 | 1[] = Array(WIDTH).fill(0);
        data.push(rowData);
    }
    // // // test data
    // let index = 1;
    // for (let i = 0; i < data.length; i++) {
    //     for (let j = 0; j < data[i].length; j++) {
    //         data[i][j] = index % 2 as 0 | 1;
    //         index += 1;
    //     }
    // }
    return data;
};

/**
 * 获取网格中一个4x4的方块的值组成的数
 * @param coordLd 要获取的4x4区域的左下角
 */
const getCellValueByCoord = (cellDatas: CellData, coordLd: {x: number, y: number}) => {
    var binaryString = "";
    for (let i = coordLd.y + 3; i >= coordLd.y; i--) {
        if (i < 0) {
            binaryString += "1111";
        } else if (i >= cellDatas.length) {
            binaryString += "0000";
        } else {
            for (let j = coordLd.x; j < coordLd.x + 4; j++) {
                if (j >= 0 && j < cellDatas[i].length) {
                    binaryString += cellDatas[i][j]
                } else {
                    binaryString += "1";
                }
            }
        }
    }

    return parseInt(binaryString, 2);
};

/**
 * 使用一个4x4的方块区域值，更新cellDatas
 * @param cellDatas 要更新的CellData
 * @param coordLd 4x4方块区域的左下角坐标
 * @param value 需要更新的值
 */
const updateCellValueByCoord = (cellDatas: CellData, coordLd: {x: number, y: number}, value: number) => {
    var resultData: CellData = [];
    resultData = JSON.parse(JSON.stringify(cellDatas)) as CellData;

    for (let i = coordLd.y; i < coordLd.y + 4; i++) {
        if (i >= 0 && i < cellDatas.length) {
            for (let j = coordLd.x + 3; j >= coordLd.x; j--) {
                if (j >= 0 && j < cellDatas[i].length) {
                    const cellValue = value & 1;
                    if (cellValue === 1) {
                        resultData[i][j] = cellValue;
                    }
                }
                value >>= 1;
            }
        } else {
            value >>= 4;
        }
    }

    return resultData;
};

const MainScreen: React.FC<MainScreenProps> = (props) => {
    const {gameStatus} = props;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [cellDatas, setCellDatas] = useState<CellData>([]);
    const [activeShape, setActiveShape] = useState<Shape>();
    const [activeShapeCoord, setActiveShapeCoord] = useState<{x: number, y: number}>({x: 0, y: 0}); // 当前活动的shape左下角坐标
    const [activeShapeColor, setActiveShapeColor] = useState<vec3>([1, 1, 1]);
    const [speed, setSpeed] = useState<number>(5);

    /**
     * 设置随机block
     */
    const setRandomShape = () => {
        const shape = ShapeCreator.createRandomShape();
        setActiveShape(shape);

        const coordX = Math.round(Math.random() * (WIDTH - 4));
        setActiveShapeCoord({x: coordX, y: HEIGHT});

        const r = Math.random();
        const g = Math.random();
        const b = Math.random();
        setActiveShapeColor([r, g, b]);
    };

    // 添加键盘事件
    useEffect(() => {
        if (activeShape) {
            const keyHandle = (event: KeyboardEvent) => {
                switch (event.key) {
                    case "ArrowDown":
                        setActiveShapeCoord((coord) => ({x: coord.x, y: coord.y - 1}));
                        break;
                    case "ArrowLeft":
                        setActiveShapeCoord((coord) => {
                            const cellValue = getCellValueByCoord(cellDatas, {x: coord.x - 1, y: coord.y});
                            if ((cellValue & activeShape.data) === 0) {
                                return {
                                    x: coord.x - 1,
                                    y: coord.y
                                };
                            } else {
                                return coord;
                            }
                        });
                        break;
                    case "ArrowRight":
                        setActiveShapeCoord((coord) => {
                            const cellValue = getCellValueByCoord(cellDatas, {x: coord.x + 1, y: coord.y});
                            if ((cellValue & activeShape.data) === 0) {
                                return {
                                    x: coord.x + 1,
                                    y: coord.y
                                };
                            } else {
                                return coord;
                            }
                        });
                        break;
                    case "ArrowUp":
                        const shapeData = activeShape.getAfterOneRotate_Data();
                        const cellValue = getCellValueByCoord(cellDatas, activeShapeCoord);
                        if ((cellValue & shapeData) === 0) {
                            activeShape.rotate();
                        }
                        break;
                    default:
                        break;
                }
            };
            window.addEventListener("keydown", keyHandle);
            return () => {
                window.removeEventListener("keydown", keyHandle);
            }
        }
    }, [activeShape]);

    useEffect(() => {
        setRandomShape();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (gameStatus === GameStatus.RUNNING) {
                setActiveShapeCoord((coord) => ({x: coord.x, y: coord.y - 1}));
            }
        }, 1000 / speed);

        return () => {
            clearInterval(intervalId);
        }
    }, [speed, gameStatus]);


    useEffect(() => {
        if (gameStatus === GameStatus.UNSTART) {
            setCellDatas(getInitData())
        }
    }, [gameStatus]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const resizeCanvas = () => {
                const displayWidth = canvas.clientWidth;
                const displayHeight = canvas.clientHeight;

                if (canvas.width != displayWidth || canvas.height != displayHeight) {
                    canvas.width = displayWidth;
                    canvas.height = displayHeight;
                }
            };
            resizeCanvas();
            window.addEventListener("resize", resizeCanvas);
            return () => {
                window.removeEventListener("resize", resizeCanvas);
            };
        }
    }, [canvasRef]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const gl = canvas.getContext("webgl") as WebGLRenderingContext;
            draw(gl);
        }
    }, [canvasRef]);

    useEffect(() => {
        gameRunData.cellDatas = cellDatas;
    }, [cellDatas]);

    useEffect(() => {
        if (activeShape) {
            gameRunData.activeShape = activeShape;
        }
    }, [activeShape]);

    useEffect(() => {
        gameRunData.activeCubeColor = activeShapeColor;
    }, [activeShapeColor]);

    useEffect(() => {
        // 检测碰撞
        if (activeShape) {
            const areaValue = getCellValueByCoord(cellDatas, activeShapeCoord);
            const crash = activeShape.data & areaValue; // 是否存在碰撞
            console.log(crash);
            if (crash) {
                setRandomShape();
                // 更新cellDatas
                const shapeData = gameRunData.activeShape?.data as number;
                const shapePos = gameRunData.activeShapePos;
                const updateData = updateCellValueByCoord(cellDatas, shapePos, shapeData);
                setCellDatas(updateData);
            } else {
                gameRunData.activeShapePos = activeShapeCoord;
            }
        }

    }, [activeShapeCoord]);

    return (
        <>
            <canvas className="gameCanvas" ref={canvasRef} />
        </>
    );
};

export default MainScreen;
