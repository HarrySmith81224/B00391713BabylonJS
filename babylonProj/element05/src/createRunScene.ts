import { AbstractMesh,
  ActionManager,
  CubeTexture,
  Mesh,
  Skeleton } from "@babylonjs/core";
import { bakedAnimations, walk, idle, getAnimating, toggleAnimating } from "./bakedAnimations";
import { SceneData } from "./interfaces";
import {
  keyActionManager,
  keyDownMap,
  keyDownHeld,
  getKeyDown,
} from "./keyActionManager";

import setSceneIndex from "./index";

import {createxRotate, frameRate } from "./animations";

import { collisionDeclaration } from "./collisionDeclaration";

export default function createRunScene(runScene: SceneData) {
  collisionDeclaration(runScene);
  runScene.sphere.position.y = 3; 
  runScene.sphere.position.x = -20; 
  runScene.sphere.position.z = 20;   

  runScene.sphere.animations.push(createxRotate(frameRate));
  runScene.scene.beginAnimation(runScene.sphere, 0, 2 * frameRate, true);
  runScene.scene.actionManager = new ActionManager(runScene.scene);
  keyActionManager(runScene.scene);
  runScene.audio.stop();
  runScene.player.then((result) => {
    let skeleton: Skeleton = result!.skeletons[0];
    bakedAnimations(runScene.scene, skeleton);
  });
  runScene.scene.onBeforeRenderObservable.add(() => {
    // check and respond to keypad presses

    if (getKeyDown() == 1 && (keyDownMap["m"] || keyDownMap["M"])) {
      keyDownHeld();
      if (runScene.audio.isPlaying) {
        setSceneIndex(0)
        runScene.audio.stop();
      }
    }
    runScene.player.then((result) => {
      let characterMoving: Boolean = false;
      let character: AbstractMesh = result!.meshes[0];
      if (keyDownMap["w"] || keyDownMap["ArrowUp"]) {
        character.position.x -= 0.1;
        character.rotation.y = (3 * Math.PI) / 2;
        characterMoving = true;
      }
      if (keyDownMap["a"] || keyDownMap["ArrowLeft"]) {
        character.position.z -= 0.1;
        character.rotation.y = (2 * Math.PI) / 2;
        characterMoving = true;
      }
      if (keyDownMap["s"] || keyDownMap["ArrowDown"]) {
        character.position.x += 0.1;
        character.rotation.y = (1 * Math.PI) / 2;
        characterMoving = true;
      }
      if (keyDownMap["d"] || keyDownMap["ArrowRight"]) {
        character.position.z += 0.1;
        character.rotation.y = (0 * Math.PI) / 2;
        characterMoving = true;
      }
      if (getKeyDown() && characterMoving) {
        if (!getAnimating()) {
          walk();
          toggleAnimating(); 
        }
      } else {
        if (getAnimating()) {
          idle();
          toggleAnimating();
        }
      }  
      
    });
  });
  

  runScene.scene.onAfterRenderObservable.add(() => {});
}                                
