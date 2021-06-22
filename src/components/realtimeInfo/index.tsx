import {vec3} from "gl-matrix";
import React, {FC} from "react";
import {useEffect} from "react";
import {useRef} from "react";
import Button from "@material-ui/core/Button";
import Shape from "../mainScreen/util/shape";
import "./index.less";
import {GameStatus} from "../../tetris.interface";

interface RealtimeInfoProps {
    nextShape?: Shape;
    nextShapeColor: vec3;
    score: number;
    status: GameStatus;
    setStatus: React.Dispatch<React.SetStateAction<GameStatus>>;
}

const RealtimeInfo: FC<RealtimeInfoProps> = (props) => {
    const {nextShape, score, nextShapeColor, status, setStatus} = props;
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;

            const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
            if (nextShape) {
                ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

                let shapeData = nextShape.data;
                ctx.fillStyle = `rgb(${Math.round(255 * nextShapeColor[0])}, ${Math.round(255 * nextShapeColor[1])}, ${Math.round(255 * nextShapeColor[2])})`;
                const cellW = canvas.clientWidth / 4;
                const cellH = canvas.clientHeight / 4;
                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < 4; j++) {
                        const res = shapeData & 0x8000;
                        if (res !== 0) {
                            ctx.fillRect(cellW * j, cellH * i, cellW, cellH);
                        }

                        shapeData <<= 1;
                    }
                }
            }
        }
    }, [canvasRef, nextShape]);

    const btn1Click = () => {
        setStatus(GameStatus.RUNNING);
    };

    const btn2Click = () => {
        if (status === GameStatus.RUNNING) {
            setStatus(GameStatus.PAUSE);
            return;
        }
        if (status === GameStatus.PAUSE) {
            setStatus(GameStatus.RUNNING);
            return;
        }
    };

    const btnLeftClick = () => {
        window.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowLeft"}));
    };
    const btnRightClick = () => {
        window.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowRight"}));
    };
    const btnSpeedClick = () => {
        window.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowDown"}));
    };
    const btnRotateClick = () => {
        window.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowUp"}));
    };

    const btn1Disabled = !(status === GameStatus.UNSTART || status === GameStatus.OVER);
    const btn2Disabled = !btn1Disabled;
    const operateBtnDisabled = !(status === GameStatus.RUNNING);

    return (
        <div className="realtimeInfo">
            <canvas className="preview-canvas" ref={canvasRef} />
            <div className="info">
                <div className="info-item">
                    <span className="label">score: </span>
                    <span className="value">{score}</span>
                </div>
            </div>
            <div className="buttons">
                <div className="status-button">
                    <Button className="button" disabled={btn1Disabled} variant="contained" onClick={btn1Click}>{status === GameStatus.UNSTART ? "Start" : "Restart"}</Button>
                    <Button className="button" disabled={btn2Disabled} variant="contained" onClick={btn2Click}>{status === GameStatus.RUNNING ? "Pause" : "Continue"}</Button>
                </div>
                <div className="operate-button">
                    <div className="top">
                        <Button className="button" disabled={operateBtnDisabled} variant="contained" onClick={btnLeftClick}>Left</Button>
                        <Button className="button" disabled={operateBtnDisabled} variant="contained" onClick={btnRightClick}>Right</Button>
                    </div>
                    <div className="bottom">
                        <Button className="button" disabled={operateBtnDisabled} variant="contained" onClick={btnRotateClick}>Rotate</Button>
                        <Button className="button" disabled={operateBtnDisabled} variant="contained" onClick={btnSpeedClick}>Speed</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RealtimeInfo;
