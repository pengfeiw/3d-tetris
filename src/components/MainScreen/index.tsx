import React, {useRef} from "react";
import {useEffect} from "react";
import "./index.less";

const MainScreen = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
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

    return (
        <>
            <canvas className="gameCanvas" ref={canvasRef} />
        </>
    );
};

export default MainScreen;
