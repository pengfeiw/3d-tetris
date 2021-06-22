import React, {FC, useState} from "react";
import {Card} from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import Drawer from "@material-ui/core/Drawer";
import SettingsIcon from "@material-ui/icons/Settings";
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
            </Drawer>
        </>
    );
};

export default Setting;
