
import setSceneIndex from "./index";

import {
    Scene,
    ArcRotateCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    Mesh,
    Light,
    Camera,
    Engine,
    StandardMaterial,
    Texture,
    Color3,
    CubeTexture,
    Sound
  } from "@babylonjs/core";
  import * as GUI from "@babylonjs/gui";
 
  //----------------------------------------------------

  function createText(scene: Scene, theText: string, x: string, y: string, s: string, c: string, advtex) {
    let text = new GUI.TextBlock();
    text.text = theText;
    text.color = c;
    text.fontSize = s;
    text.fontWeight = "bold"; //can add parameter for this if you wish
    text.left = x;
    text.top = y;
    advtex.addControl(text);
    return text;
  }

  function createRectangle(scene: Scene, w: string, h: string, x: string, y: string, cr: number, c: string, t: number, bg: string, advtext) {
    let rectangle = new GUI.Rectangle();
    rectangle.width = w;
    rectangle.height = h;
    rectangle.left = x;
    rectangle.top = y;
    rectangle.cornerRadius = cr;
    rectangle.color = c;
    rectangle.thickness = t;
    rectangle.background = bg;
    advtext.addControl(rectangle);
    return rectangle;
  }

  function createSceneButton(scene: Scene, name: string, index: string, x: string, y: string, advtex, Sindex: number) {
    let button = GUI.Button.CreateSimpleButton(name, index);
        button.left = x;
        button.top = y;
        button.width = "160px";
        button.height = "60px";
        button.color = "white";
        button.cornerRadius = 20;
        button.background = "purple";

        const buttonClick = new Sound("MenuClickSFX", "./audio/menu-click.wav", scene, null, {
          loop: false,
          autoplay: false,
        });

        button.onPointerUpObservable.add(function() {
            buttonClick.play();
            setSceneIndex(Sindex);
        });
        advtex.addControl(button);
        return button;
 }

  //----------------------------------------------------------------------------------------------
  //Create Skybox
  function createSkybox(scene: Scene) {
    //Skybox
    const skybox = MeshBuilder.CreateBox("skyBox", {size:150}, scene);
	  const skyboxMaterial = new StandardMaterial("skyBox", scene);
	  skyboxMaterial.backFaceCulling = false;
	  skyboxMaterial.reflectionTexture = new CubeTexture("textures/skybox", scene);
	  skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
	  skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
	  skyboxMaterial.specularColor = new Color3(0, 0, 0);
	  skybox.material = skyboxMaterial;
    return skybox;
  }

 
  function createHemiLight(scene: Scene) {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.8;
    return light;
  }
  
  function createArcRotateCamera(scene: Scene) {
    let camAlpha = -Math.PI / 2,
      camBeta = Math.PI / 2.5,
      camDist = 10,
      camTarget = new Vector3(0, 0, 0);
    let camera = new ArcRotateCamera(
      "camera1",
      camAlpha,
      camBeta,
      camDist,
      camTarget,
      scene,
    );
    camera.attachControl(true);
    return camera;
  }
 
  //----------------------------------------------------------
  //BOTTOM OF CODE - MAIN RENDERING AREA FOR YOUR SCENE
  export default function menuScene(engine: Engine) {
    interface SceneData {
      scene: Scene;
      advancedTexture: GUI.AdvancedDynamicTexture;
      textBG: GUI.Rectangle;
      titleText: GUI.TextBlock;
      button1: GUI.Button;
      button2: GUI.Button;
      skybox: Mesh;
      hemiLight: HemisphericLight;
      camera: Camera;
    }
  
    //let that: SceneData = { scene: new Scene(engine) };
    
    //----------------------------------------------------------
    let scene = new Scene(engine);
    let advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI", true);
    let textBG = createRectangle(scene, "300px", "100px", "0px", "-200px", 20, "white", 4, "purple", advancedTexture);
    let titleText = createText(scene, "THE GAME", "0px", "-200px", "45", "white", advancedTexture);
    let button1 = createSceneButton(scene, "but1", "Element 1", "0px", "-75px", advancedTexture, 1);
    let button2 = createSceneButton(scene, "but2", "Element 4", "0px", "0px", advancedTexture, 2);

    let skybox = createSkybox(scene);
    //Scene Lighting & Camera
    let hemiLight = createHemiLight(scene);
    let camera = createArcRotateCamera(scene);
    
    let that: SceneData = {
      scene,
      advancedTexture,
      textBG,
      titleText,
      button1,
      button2,
      skybox,
      hemiLight,
      camera
    };
    
    return that;
  }  //----------------------------------------------------