import React, {useRef, useState} from "react";
import {useEffect} from "react";
import {drawGridLine, drawCube} from "./util/painter";
import {columnCount as WIDTH, rowCount as HEIGHT} from "../../data/shaderData";
import ShapeCreator from "./util/shapeCreator";
import "./index.less";

const MainScreen = (): JSX.Element => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // const [cellDatas, setCellDatas] = useState<(0 | 1)[]>(Array(WIDTH * HEIGHT).fill(0));
    const [cellDatas, setCellDatas] = useState<(0 | 1)[]>(Array(WIDTH * HEIGHT).fill(0).map((value, index) => index % 2 === 0 ? 1 : 0));

    // // 任意数据
    // useEffect(() => {
    //     const data = Array(WIDTH * HEIGHT).fill(Math.round(Math.random()) as 0 | 1);
    //     setCellDatas(data);
    // }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const resizeCanvas = () => {
                const displayWidth = canvas.clientWidth;
                const displayHeight = canvas.clientHeight;

                if (canvas.width != displayWidth || canvas.height != displayHeight) {
                    canvas.width = displayWidth;
                    canvas.height = displayHeight;

                    console.log("width", canvas.width);
                    console.log("height", canvas.height);
                }
                const gl = canvas.getContext("webgl") as WebGLRenderingContext;
                drawGridLine(gl);
                drawCube(gl, cellDatas);
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
