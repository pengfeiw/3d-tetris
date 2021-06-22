import React, {FC, useState} from "react";
import Slider from "@material-ui/core/Slider";
import Drawer from "@material-ui/core/Drawer";
import SettingsIcon from "@material-ui/icons/Settings";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import SpaceBarIcon from "@material-ui/icons/SpaceBar";
import "./index.less";
import {useEffect} from "react";
import {gameSettings} from "../mainScreen/util/painter";

const settingValue = {
    distance: {
        min: 100,
        max: 500
    },
    rotate: {
        min: 0,
        max: 360
    }
};

interface SettingProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const Setting: FC<SettingProps> = (props) => {
    const {open, setOpen} = props;
    const [distance, setDistance] = useState<number>(200);
    const [rotate, setRotate] = useState<number>(40);

    useEffect(() => {
        gameSettings.distance = distance;
    }, [distance]);

    useEffect(() => {
        gameSettings.rotateX = rotate;
    }, [rotate]);

    const distanceChange = (e: React.ChangeEvent<any>, value: number | number[]) => {
        setDistance(value as number);
    };

    const rotateChange = (e: React.ChangeEvent<any>, value: number | number[]) => {
        setRotate(value as number);
    };

    return (
        <>
            <SettingsIcon className="setting-icon" onClick={() => setOpen(true)} />
            <Drawer className="setting-content" anchor="left" open={open} onClose={() => setOpen(false)}>
                <h3>SETTING</h3>
                <div className="setting-distance setting-item">
                    <h4 className="setting-title">distance</h4>
                    <div className="setting-operator">
                        <span className="setting-label">near</span>
                        <Slider min={settingValue.distance.min} max={settingValue.distance.max} className="setting-slider" value={distance} onChange={distanceChange} aria-labelledby="continuous-slider" />
                        <span className="setting-label">far</span>
                    </div>
                </div>
                <div className="setting-rotate setting-item">
                    <h4 className="setting-title">rotate</h4>
                    <div className="setting-operator">
                        <span className="setting-label">0</span>
                        <Slider min={settingValue.rotate.min} max={settingValue.rotate.max} className="setting-slider" value={rotate} onChange={rotateChange} aria-labelledby="continuous-slider" />
                        <span className="setting-label">360</span>
                    </div>
                </div>
                <h3>CONTROL</h3>
                <div className="game-control">
                    <div className="control-item" title="Rotate the shape by presss 'key_arrow_up'">
                        <ArrowUpwardIcon className="icon" />
                        <span>Rotate</span>
                    </div>
                    <div className="control-item" title="Speed up the fall by presss 'key_arrow_down'">
                        <ArrowDownwardIcon className="icon" />
                        <span>Speed Up</span>
                    </div>
                    <div className="control-item" title="Move left the shape by press 'key_arrow_left'">
                        <ArrowBackIcon className="icon" />
                        <span>Move Left</span>
                    </div>
                    <div className="control-item" title="Move right the shape by press 'key_arrow_right'">
                        <ArrowForwardIcon className="icon" />
                        <span>Move Right</span>
                    </div>
                    <div className="control-item" title="Switch game status(stop or start) by press 'key_space'">
                        <SpaceBarIcon className="icon" />
                        <span>Pause Or Continue</span>
                    </div>
                </div>
                <h3>ABOUT</h3>
                <div className="game-info">
                    <div className="description">
                        The game is written in WebGL. You can download sourcecode <a href="https://github.com/pengfeiw/3d-tetris">here</a>.
                        If you have any questions, you can leave a comment on my website.
                    </div>

                    <div>
                        <span className="label">Author:</span>
                        <span>Wang Pengfei</span>
                    </div>
                    <div>
                        <span className="label">Site:</span>
                        <span>
                            <a href="http://www.pengfeixc.com">http://www.pengfeixc.com</a>
                        </span>
                    </div>
                    <div>
                        <span className="label">MiniCode:</span>
                        <span>
                            <a href="http://mini.pengfeixc.com">http://mini.pengfeixc.com</a>
                        </span>
                    </div>
                </div>
            </Drawer>
        </>
    );
};

export default Setting;
