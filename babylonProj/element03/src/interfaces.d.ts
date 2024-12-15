import {
  Scene,
  Sound,
  Mesh,
  HemisphericLight,
  Camera,
  DirectionalLight,
  ISceneLoaderAsyncResult,
} from "@babylonjs/core";

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
