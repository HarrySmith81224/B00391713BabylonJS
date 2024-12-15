import {
  Scene,
  Mesh,
  HemisphericLight,
  Camera,
  DirectionalLight,
} from "@babylonjs/core";

export interface SceneData {
  scene: Scene;
  ground: Mesh;
  sky: Mesh;
  sphere: Mesh;
  box: Mesh;
  facebox: Mesh;
  lightHemispheric: HemisphericLight;
  directionalLight: DirectionalLight;
  camera: Camera;
}
