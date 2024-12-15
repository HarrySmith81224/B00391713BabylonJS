import {
  Scene,
  Sound,
  Mesh,
  HemisphericLight,
  Camera,
  DirectionalLight,
  ISceneLoaderAsyncResult,
} from "@babylonjs/core";

import {Button }  from "@babylonjs/gui/2D";

export interface SceneData {
  scene: Scene;
  audio: Sound;
  ground: Mesh;
  sky: Mesh;
  sphere: Mesh;
  box: Mesh;
  box1: Mesh;
  facebox: Mesh;
  lightHemispheric: HemisphericLight;
  directionalLight: DirectionalLight;
  player: Promise<void | ISceneLoaderAsyncResult>;
  camera: Camera;
}

export interface GUIData {
  button1:Button;
  button2:Button;
  button3:Button;
  button4:Button;
}