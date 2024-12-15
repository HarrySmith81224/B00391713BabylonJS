import { Engine} from "@babylonjs/core";
import element1 from "./element1";
import element2 from "./element2";
import element4 from "./element4";
import "./main.css";

const CanvasName = "renderCanvas";

let canvas = document.createElement("canvas");
canvas.id = CanvasName;

canvas.classList.add("background-canvas");
document.body.appendChild(canvas);

let scene;
let scenes: any[] = [];

let eng = new Engine(canvas, true, {}, true);

scenes[0] = element1(eng);
scenes[1] = element2(eng);
scenes[2] = element4(eng);

scene = scenes[0].scene;
setSceneIndex(0);

export default function setSceneIndex(i: number) {
  eng.runRenderLoop(() => {
      scenes[i].scene.render();
  });
}   
