import React, {useRef, useState} from "react";
import {useEffect} from "react";
import {draw, gameRunData} from "./util/painter";
import {columnCount, columnCount as WIDTH, rowCount as HEIGHT} from "../../data/shaderData";
import ShapeCreator from "./util/shapeCreator";
import Shape from "./util/shape";
import {GameStatus} from "../../tetris.interface";
import {vec3} from "gl-matrix";
import "./index.less";
import RealtimeInfo from "../realtimeInfo";

type CellData = (0 | 1)[][];
interface MainScreenProps {
    gameStatus: GameStatus;
    setGameStatus: React.Dispatch<React.SetStateAction<GameStatus>>;
    score: number;
    setScore: React.Dispatch<React.SetStateAction<number>>;
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
            for (let j = coordLd.x; j < coordLd.x + 4; j++) {
                if (j < 0 || j >= columnCount) {
                    binaryString += "1";
                } else {
                    binaryString += "0";
                }
            }
        } else {
            for (let j = coordLd.x; j < coordLd.x + 4; j++) {
                if (j >= 0 && j < cellDatas[i].length) {
                    binaryString += cellDatas[i][j];
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

var flicker = false;

const MainScreen: React.FC<MainScreenProps> = (props) => {
    const {gameStatus, setGameStatus, score, setScore} = props;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [cellDatas, setCellDatas] = useState<CellData>([]);
    const [activeShape, setActiveShape] = useState<Shape>();
    const [activeShapeCoord, setActiveShapeCoord] = useState<{x: number, y: number}>({x: 0, y: 0}); // 当前活动的shape左下角坐标
    const [activeShapeColor, setActiveShapeColor] = useState<vec3>([1, 1, 1]);

    const [nextShape, setNextShape] = useState<Shape | undefined>(ShapeCreator.createRandomShape() as Shape);
    const [nextShapeColor, setNextShapeColor] = useState<vec3>([Math.random(), Math.random(), Math.random()]);

    const [speed, setSpeed] = useState<number>(1);
    const preStatusRef = useRef<GameStatus>(gameStatus); // 前一个状态

    /**
     * 设置随机block
     */
    const setNextRandomShape = () => {
        const shape = ShapeCreator.createRandomShape();
        setNextShape(shape as Shape);
        const r = Math.random();
        const g = Math.random();
        const b = Math.random();
        setNextShapeColor([r, g, b]);
        const coordX = Math.round(Math.random() * (WIDTH - 4));
        setActiveShapeCoord({x: coordX, y: HEIGHT});

        setActiveShape(nextShape);
        setActiveShapeColor(nextShapeColor);
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
                            if (coord.y >= HEIGHT) return coord;
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
                            if (coord.y >= HEIGHT) return coord;
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
    }, [activeShape, activeShapeCoord]);

    // 初始时，设置随机block
    useEffect(() => {
        // setRandomShape();
        setNextRandomShape();
    }, []);

    // block自动下落，下落速度由speed控制
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

    // 初始化cellDatas
    useEffect(() => {
        if ((preStatusRef.current === GameStatus.OVER || preStatusRef.current === GameStatus.UNSTART) && gameStatus === GameStatus.RUNNING) {
            setCellDatas(getInitData());
        }
        preStatusRef.current = gameStatus;
    }, [gameStatus]);

    // 监听窗口resize事件，改变canvas尺寸
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

    // 使用webgl绘制
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas && (gameStatus === GameStatus.RUNNING || gameStatus === GameStatus.UNSTART)) {
            const gl = canvas.getContext("webgl") as WebGLRenderingContext;
            draw(gl);
        }
    }, [canvasRef, GameStatus]);

    // 改变webgl绘制所需的数据：cellDatas
    useEffect(() => {
        gameRunData.cellDatas = cellDatas;
    }, [cellDatas]);

    // 改变webgl绘制所需的数据：活动的block类型
    useEffect(() => {
        if (activeShape) {
            gameRunData.activeShape = activeShape;
        }
    }, [activeShape]);

    // 改变webgl绘制所需的数据：活动的block的颜色
    useEffect(() => {
        gameRunData.activeCubeColor = activeShapeColor;
    }, [activeShapeColor]);

    // 检测碰撞，更新cellDatas
    useEffect(() => {
        // 检测碰撞
        if (activeShape) {
            const areaValue = getCellValueByCoord(cellDatas, activeShapeCoord);
            const crash = activeShape.data & areaValue; // 是否存在碰撞
            if (crash) {
                if (activeShapeCoord.y > HEIGHT - 4) {
                    setGameStatus(GameStatus.OVER);
                    return;
                }

                // setRandomShape();
                setNextRandomShape();
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

    // 消除满行，并加分
    useEffect(() => {
        if (!flicker) {
            const eliminateRowIndex: number[] = [];
            for (let i = 0; i < cellDatas.length; i++) {
                const curRow = cellDatas[i];
                const isEliminate = curRow.every((item) => item === 1);

                if (isEliminate) {
                    eliminateRowIndex.push(i);
                }
            }

            if (eliminateRowIndex.length > 0) {
                let isDraw = false;
                flicker = true;
                const intervalId = setInterval(() => {
                    const data: CellData = JSON.parse(JSON.stringify(cellDatas));
                    for (let i = 0; i < eliminateRowIndex.length; i++) {
                        const rowIndex = eliminateRowIndex[i];
                        data[rowIndex] = Array(WIDTH).fill(isDraw ? 1 : 0);
                    }
                    setCellDatas(data);
                    isDraw = !isDraw;
                }, 200);

                setTimeout(() => {
                    clearInterval(intervalId);
                    const data: CellData = JSON.parse(JSON.stringify(cellDatas));
                    for (let i = eliminateRowIndex.length - 1; i >= 0; i--) {
                        const delRowIndex = eliminateRowIndex[i];
                        data.splice(delRowIndex, 1);
                    }
                    for (let i = 0; i < eliminateRowIndex.length; i++) {
                        data.push(Array(WIDTH).fill(0));
                    }

                    setScore(score => score += (eliminateRowIndex.length * 10))
                    setCellDatas(data);
                    flicker = false;
                }, 1000);
            }
        }
    }, [cellDatas]);

    // 根据分数设置速度
    useEffect(() => {
        if (score <= 200) {
            setSpeed(1);
        } else {
            const speed = Math.ceil(score / 200);
            setSpeed(Math.min(speed, 11)); // 最大速度限制在11
        }
    }, [score]);

    return (
        <>
            <canvas className="gameCanvas" ref={canvasRef} />
            <RealtimeInfo
                status={gameStatus}
                setStatus={setGameStatus}
                nextShape={nextShape}
                score={score}
                nextShapeColor={nextShapeColor}
            />
        </>
    );
};

export default MainScreen;
