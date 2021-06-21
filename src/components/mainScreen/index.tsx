import React, {useRef, useState} from "react";
import {useEffect} from "react";
import {drawGridLine, drawCube} from "./util/painter";
import {columnCount as WIDTH, rowCount as HEIGHT} from "../../data/shaderData";
import ShapeCreator from "./util/shapeCreator";
import "./index.less";
import {useLayoutEffect} from "react";

type CellData = (0 | 1)[][];

const MainScreen = (): JSX.Element => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [cellDatas, setCellDatas] = useState<CellData>([]);
    useLayoutEffect(() => {
        const data: CellData = [];
        for (let i = 0; i < HEIGHT; i++) {
            const rowData: 0 | 1[] = Array(WIDTH).fill(0);
            data.push(rowData);
        }

        // // test data
        // let index = 1;
        // for (let i = 0; i < data.length; i++) {
        //     for (let j = 0; j < data[i].length; j++) {
        //         data[i][j] = index % 2 as 0 | 1;
        //         index += 1;
        //     }
        // }
        setCellDatas(data);
    }, [WIDTH, HEIGHT]);

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
                const gl = canvas.getContext("webgl") as WebGLRenderingContext;
                drawGridLine(gl);
                drawCube(gl, cellDatas, [1, 1, 1], [0, 0.3, -1]);
            };
            resizeCanvas();
            window.addEventListener("resize", resizeCanvas);
            return () => {
                window.removeEventListener("resize", resizeCanvas);
            };
        }
    }, [canvasRef, cellDatas]);

    return (
        <>
            <canvas className="gameCanvas" ref={canvasRef} />
        </>
    );
};

export default MainScreen;
