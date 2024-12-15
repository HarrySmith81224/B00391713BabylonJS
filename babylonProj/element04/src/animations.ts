import { Animation, Color3, Vector3 } from "@babylonjs/core";

interface PositionArray {
    frame: number;
    value: number;
}

interface ScaleArray {
    frame: number;
    value: Vector3;
}

interface colorArray {
    frame: number;
    value: Color3;
}

export const frameRate = 30;

export function createxRotate(frameRate: number){
    const xRotation = new Animation(
        "xRotation",
        "rotation.x",
        frameRate,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CYCLE
    );

    const keyFramesRX: PositionArray[]= [];
    keyFramesRX.push({ frame: 0, value: 0 });
    keyFramesRX.push({ frame: frameRate, value: Math.PI });
    keyFramesRX.push({ frame: 2 * frameRate, value: Math.PI * 2 });

    xRotation.setKeys(keyFramesRX);

    return xRotation
}