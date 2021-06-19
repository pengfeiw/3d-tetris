import React, {useState, FC, useEffect} from "react";
import Paper from "@material-ui/core/Paper";
import PlayCircleFilledWhiteIcon from "@material-ui/icons/PlayCircleFilledWhite";
import RestartIcon from "@material-ui/icons/Refresh";
import {GameStatus as Status} from "../../tetris.interface";
import "./index.less";

interface GameStatusProps {
    status: Status;
    setStatus: React.Dispatch<React.SetStateAction<Status>>;
}

const getTitle = (status: Status) => {
    switch (status) {
        case Status.UNSTART:
            return "START";
        case Status.PAUSE:
            return "PAUSE";
        case Status.RUNNING:
            return "RUNNING";
        case Status.OVER:
            return "GAME OVER";
        default:
            return "";
    }
};

const GameStatus: FC<GameStatusProps> = (props) => {
    const {status, setStatus} = props;
    const [title, setTitle] = useState<string>("START");
    useEffect(() => {
        setTitle(getTitle(status));
    }, [status]);

    const onClick = () => {
        setStatus(Status.RUNNING);
    };

    return (
        <Paper className={status === Status.RUNNING ? "gameStatus none" : "gameStatus"}>
            <div className="title">
                {title}
            </div>
            <div className="icon" onClick={onClick}>
                {
                    status === Status.OVER ? <RestartIcon /> : <PlayCircleFilledWhiteIcon />
                }
            </div>
        </Paper >
    );
};

export default GameStatus;
