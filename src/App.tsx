import React, {useState, useEffect} from "react";
import MainScreen from "./components/mainScreen";
import Setting from "./components/setting";
import GameStatusPanel from "./components/gameStatus";
import {GameStatus} from "./tetris.interface";
import "./app.less";

const Tetris = ():JSX.Element => {
    const [status, setStatus] = useState<GameStatus>(GameStatus.UNSTART);
    const [score, setScore] = useState<number>(0); // 分数
    const [settingOpen, setSettingOpen] = useState<boolean>(true);

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

    useEffect(() => {
        if (status === GameStatus.RUNNING) {
            setSettingOpen(false);
        }
    }, [status]);

    const handleSettingOpen = (open: boolean) => {
        setSettingOpen(open);
        if (open && status === GameStatus.RUNNING) {
            setStatus(GameStatus.PAUSE);
        }
    };

    return (
        <div className="tetris">
            <MainScreen gameStatus={status} setGameStatus={setStatus} score={score} setScore={setScore} />
            <Setting open={settingOpen} setOpen={handleSettingOpen} />
            {
                settingOpen ? <></> :
                <GameStatusPanel status={status} setStatus={setStatus} />
            }
        </div>
    );
};

export default Tetris;
