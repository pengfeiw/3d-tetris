import React, {useState, useEffect} from "react";
import MainScreen from "./components/mainScreen";
import About from "./components/about";
import RealtimeInfo from "./components/realtimeInfo";
import GameStatusPanel from "./components/gameStatus";
import {GameStatus} from "./tetris.interface";
import "./app.less";

const Tetris = ():JSX.Element => {
    const [status, setStatus] = useState<GameStatus>(GameStatus.UNSTART);
    const [time, setTime] = useState<number>(0); // 时间
    const [score, setScore] = useState<number>(0); // 分数

    // 监听暂停或者开始事件
    useEffect(() => {
        const listener = (event: KeyboardEvent) => {
            if (event.key === " ") {
                setStatus(status => {
                    switch (status) {
                        case GameStatus.UNSTART:
                        case GameStatus.OVER:
                        case GameStatus.PAUSE:
                            return GameStatus.RUNNING;
                        case GameStatus.RUNNING:
                            return GameStatus.PAUSE;
                        default:
                            throw new Error(`unimplement game status: ${status}.`);
                    }
                });
            }
        };
        window.addEventListener("keydown", listener);

        return () => {
            window.removeEventListener("keydown", listener);
        }
    }, []);

    return (
        <div className="tetris">
            <MainScreen gameStatus={status} />
            {/* <About /> */}
            {/* <RealtimeInfo /> */}
            <GameStatusPanel status={status} setStatus={setStatus} />
        </div>
    );
};

export default Tetris;
