import {
    Scene,
    ArcRotateCamera,
    Vector3,
    Vector4,
    HemisphericLight,
    SpotLight,
    MeshBuilder,
    Mesh,
    Sound,
    Light,
    Camera,
    Engine,
    StandardMaterial,
    Texture,
    Color3,
    Space,
    ShadowGenerator,
    PointLight,
    DirectionalLight,
  } from "@babylonjs/core";
  import { Button, AdvancedDynamicTexture } from "@babylonjs/gui/2D";
  import setSceneIndex from "./index";
  
  
  function createBox(scene: Scene, px: number, py: number, pz: number, sx: number, sy: number, sz: number, rotation: boolean) {
    let box = MeshBuilder.CreateBox("box",{size: 1}, scene);
    box.position = new Vector3(px, py, pz);
    box.scaling = new Vector3(sx, sy, sz);
    box.receiveShadows = true;
  
  
    if (rotation) {
      scene.registerAfterRender(function () {
        box.rotate(new Vector3(10, 7, 5)/*axis*/, 0.4/*angle*/, Space.LOCAL);
      });
    }
    return box;
  }
  
  function createFacedBox(scene: Scene, px: number, py: number, pz: number, sx: number, sy: number, sz: number) {
    const mat = new StandardMaterial("mat");
    const texture = new Texture("https://assets.babylonjs.com/environments/numbers.jpg");
    mat.diffuseTexture = texture;
  
    var columns = 6;
    var rows = 1;
  
    const faceUV = new Array(6);
  
    for (let i = 0; i < 6; i++) {
        faceUV[i] = new Vector4(i / columns, 0, (i + 1) / columns, 1 / rows);
    }
  
    const options = {
        faceUV: faceUV,
        wrap: true
    };
  
    let box = MeshBuilder.CreateBox("tiledBox", options, scene);
    box.material = mat;
    box.position = new Vector3(px, py, pz);
  
    scene.registerAfterRender(function () {
        box.rotate(new Vector3(10, 7, 5)/*axis*/, 0.4/*angle*/, Space.LOCAL);
    });
    return box;
  }
  
  
  
  function createAnyLight(scene: Scene, index: number, px: number, py: number, pz: number, colX: number, colY: number, colZ: number, mesh: Mesh) {
    switch (index) {
      case 1: 
        const hemiLight = new HemisphericLight("hemiLight", new Vector3(px, py, pz), scene);
        hemiLight.intensity = 0.1;
        return hemiLight;
        break;
      case 2:
        const spotLight = new SpotLight("spotLight", new Vector3(px, py, pz), new Vector3(0, -1, 0), Math.PI / 3, 10, scene);
        spotLight.diffuse = new Color3(colX, colY, colZ); 
        let shadowGenerator = new ShadowGenerator(1024, spotLight);
        shadowGenerator.addShadowCaster(mesh);
        shadowGenerator.useExponentialShadowMap = true;
        return spotLight;
        break;
      case 3:
        const directionalLight = new DirectionalLight("directionalLight", new Vector3(px, py, pz), scene);
        directionalLight.diffuse = new Color3(colX, colY, colZ);
        shadowGenerator = new ShadowGenerator(1024, directionalLight);
        shadowGenerator.addShadowCaster(mesh);
        shadowGenerator.useExponentialShadowMap = true;
        return directionalLight;
        break;
    }
  }
  
  function createHemiLight(scene: Scene) {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.3;
    return light;
  }
  function createDirectionalLight(scene: Scene) {
    const light = new DirectionalLight("light", new Vector3(1, 0, 0), scene);
    light.diffuse = new Color3(1, 0, 0);
    light.intensity = 1;
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

 

function createSceneButton(
  scene: Scene,
  name: string,
  index: string,
  x: string,
  y: string,
  advtex: { addControl: (arg0: Button) => void },
  Sindex: number
) {
  var button: Button = Button.CreateSimpleButton(name, index);
  button.left = x;
  button.top = y;
  button.width = "180px";
  button.height = "35px";
  button.color = "white";
  button.cornerRadius = 20;
  button.background = "green";
  const buttonClick: Sound = new Sound(
    "MenuClickSFX",
    "./assets/audio/coin2.mp3",
    scene,
    null,
    {
      loop: false,
      autoplay: false,
    }
  );
  button.onPointerUpObservable.add(function () {
    buttonClick.play();
    setSceneIndex(Sindex);
  });
  advtex.addControl(button);
  return button;
}

  
  export default function element1(engine: Engine) {
    interface SceneData {
      scene: Scene;
      box?: Mesh;
      faceBox?: Mesh;
      light?: Light;
      hemisphericLight?: HemisphericLight;
      directionalLight?: DirectionalLight;
      sphere?: Mesh;
      torus?: Mesh;
      ground?: Mesh;
      camera?: Camera;
    }
  
    let that: SceneData = { scene: new Scene(engine) };
    that.scene.debugLayer.show();
  
  
    that.hemisphericLight = createHemiLight(that.scene);
    that.directionalLight = createDirectionalLight(that.scene);
    that.faceBox = createFacedBox(that.scene, -10, 2.5, 0, 0.5, 1, 1);
    that.light = createAnyLight(that.scene, 2, -10, 5, 0, 0.75, 0.12, 0.91, that.faceBox);
  
    that.box = createBox(that.scene, -13, 2.5, 0, 0.5, 5, 9, false);
    that.box = createBox(that.scene, -8, 2.5, 0, 0.5, 9, 9, false);
    that.box = createBox(that.scene, -3, 2.5, 0, 0.5, 13, 9, false);
    that.box = createBox(that.scene, 2, 2.5, 0, 0.5, 16, 9, false);
    that.box = createBox(that.scene, 7, 2.5, 0, 0.5, 20, 9, false);
    that.box = createBox(that.scene, 12, 2.5, 0, 0.5, 24, 9, false); 

    let advancedTexture: AdvancedDynamicTexture =
    AdvancedDynamicTexture.CreateFullscreenUI("myUI", true);
  let button1: Button = createSceneButton(
    that.scene,
    "but1",
    "Element 1",
    "-700px",
    "0px",
    advancedTexture,
    0
  );
  let button2: Button = createSceneButton(
    that.scene,
    "but2",
    "Element 2",
    "-700px",
    "-60px",
    advancedTexture,
    1
  );
  let button3: Button = createSceneButton(
    that.scene,
    "but3",
    "Element 3",
    "-700px",
    "-120px",
    advancedTexture,
    2
  );
  
    that.camera = createArcRotateCamera(that.scene);
    return that;
  }