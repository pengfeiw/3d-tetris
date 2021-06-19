import React, {useState} from "react";
import MainScreen from "./components/mainScreen";
import About from "./components/about";
import RealtimeInfo from "./components/realtimeInfo";
import GameStatusPanel from "./components/gameStatus";
import {GameStatus} from "./tetris.interface";
import "./app.less";

const Tetris = ():JSX.Element => {
    const [status, setStatus] = useState<GameStatus>(GameStatus.UNSTART);

    return (
        <div className="tetris">
            <MainScreen/>
            <About />
            <RealtimeInfo />
            <GameStatusPanel status={status} setStatus={setStatus} />
        </div>
    );
};

export default Tetris;
