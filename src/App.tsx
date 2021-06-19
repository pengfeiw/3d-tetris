import React from "react";
import MainScreen from "./components/MainScreen";
import About from "./components/about";
import RealtimeInfo from "./components/realtimeInfo";
import GameStatus from "./components/gameStatus";
import "./app.less";

const Tetris = () => {
    return (
        <div className="tetris">
            <MainScreen/>
            <About />
            <RealtimeInfo />
            <GameStatus />
        </div>
    );
};

export default Tetris;
