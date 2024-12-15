import {} from "@babylonjs/core";

import { SceneData } from "./interfaces";

import {createxRotate, frameRate } from "./animations";


export default function createRunScene(runScene: SceneData) {
  runScene.sphere.position.y = 3; 
  runScene.sphere.position.x = -20; 
  runScene.sphere.position.z = 20;   

  runScene.sphere.animations.push(createxRotate(frameRate));
  runScene.scene.beginAnimation(runScene.sphere, 0, 2 * frameRate, true);
}                                   
