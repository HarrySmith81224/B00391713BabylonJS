import { SceneData } from "./interfaces";

import {
  Scene,
  ArcRotateCamera,
  Vector3,
  MeshBuilder,
  Mesh,
  StandardMaterial,
  HemisphericLight,
  Color3,
  Engine,
  Texture,
  CubeTexture,
  Nullable,
  Vector4,
  InstancedMesh,
  SpriteManager,
  Sprite,
  Space,
  ShadowGenerator,
  DirectionalLight,
  SpotLight,
  SceneLoader,
  AbstractMesh,
  ISceneLoaderAsyncResult,
  Sound
} from "@babylonjs/core";




function backgroundMusic(scene: Scene): Sound{
  let music = new Sound("music", "./assets/audio/arcade-kid.mp3", scene,  null ,
   {
      loop: true,
      autoplay: true
  });

  Engine.audioEngine!.useCustomUnlockedButton = true;

  // Unlock audio on first user interaction.
  window.addEventListener('click', () => {
    if(!Engine.audioEngine!.unlocked){
        Engine.audioEngine!.unlock();
    }
}, { once: true });
  return music;
}


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
      const spotLight = new SpotLight("spotLight", new Vector3(px, py, pz), new Vector3(0, -1, 0), Math.PI / 3, 10, scene);
      spotLight.diffuse = new Color3(colX, colY, colZ); 
      let shadowGenerator = new ShadowGenerator(1024, spotLight);
      shadowGenerator.addShadowCaster(mesh);
      shadowGenerator.useExponentialShadowMap = true;
      return spotLight;
      break;
    case 2:
      const directionalLight = new DirectionalLight("directionalLight", new Vector3(px, py, pz), scene);
      directionalLight.diffuse = new Color3(colX, colY, colZ);
      shadowGenerator = new ShadowGenerator(1024, directionalLight);
      shadowGenerator.addShadowCaster(mesh);
      shadowGenerator.useExponentialShadowMap = true;
      return directionalLight;
      break;
  }
}

function createDirectionalLight(scene: Scene) {
  const light = new DirectionalLight("light", new Vector3(1, 0, 0), scene);
  light.diffuse = new Color3(1, 0, 0);
  light.intensity = 1;
  return light;
}



function createBox1(scene: Scene) {
  let box1 = MeshBuilder.CreateBox("box", { width: 1, height: 1 }, scene);
  box1.position.x = -1;
  box1.position.y = 4;
  box1.position.z = 1;
  return box1;
}

function createBoxes(scene: Scene) {
  createBox(scene, -13, 2.5, 20, 0.5, 5, 9, false);
  createBox(scene, -8, 2.5, 20, 0.5, 9, 9, false);
  createBox(scene, -3, 2.5, 20, 0.5, 13, 9, false);
  createBox(scene, 2, 2.5, 20, 0.5, 16, 9, false);
  createBox(scene, 7, 2.5, 20, 0.5, 20, 9, false);
  createBox(scene, 12, 2.5, 20, 0.5, 24, 9, false);

  createFacedBox(scene, -10, 2.5, 20, 0.5, 1, 1);

}










function createGround(scene: Scene) {
  const groundMaterial = new StandardMaterial("groundMaterial");
  groundMaterial.diffuseTexture = new Texture(
    "./assets/environments/valleygrass.png"
  );
  groundMaterial.diffuseTexture.hasAlpha = true;
  //groundMaterial.diffuseColor = new Color3(0, 1, 0);
  groundMaterial.backFaceCulling = false;
  let ground = MeshBuilder.CreateGround(
    "ground",
    { width: 15, height: 15 },
    scene
  );

  ground.material = groundMaterial;
  return ground;
}

function createTerrain(scene: Scene) {
  const largeGroundMat = new StandardMaterial("largeGroundMat");
  largeGroundMat.diffuseTexture = new Texture(
    "./assets/environments/valleygrass.png"
  );

  const largeGround = MeshBuilder.CreateGroundFromHeightMap(
    "largeGround",
    "./assets/environments/Height.png",
    {
      width: 300,
      height: 300,
      subdivisions: 100,
      minHeight: 0,
      maxHeight: 40,
      
    },scene
  );
  largeGround.material = largeGroundMat;
  largeGround.position.y = -20;
}

function createSky(scene: Scene) {
  const skybox = MeshBuilder.CreateBox("skyBox", { size: 150 }, scene);
  const skyboxMaterial = new StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new CubeTexture(
    "./assets/textures/skybox/skybox",
    scene
  );
  skyboxMaterial.reflectionTexture.coordinatesMode =
    Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
  skyboxMaterial.specularColor = new Color3(0, 0, 0);
  skybox.material = skyboxMaterial;
  return skybox;
}

function createSphere(scene: Scene) {
  let sphere = MeshBuilder.CreateSphere(
    "sphere",
    { diameter: 8, segments: 32 },
    scene
  );
  var texture = new StandardMaterial("earth", scene);
  texture.emissiveTexture = new Texture("./assets/textures/earth.jpg", scene);
  sphere.material = texture;
  return sphere;
}

function createHouse(scene: Scene, style: number)  {
  //style 1 small style 2 semi detatched
  const boxMat = new StandardMaterial("boxMat");
  const faceUV: Vector4[] = []; // faces for small house
  if (style == 1) {
    boxMat.diffuseTexture = new Texture(
      "./assets/textures/cubehouse.png"
    );
    faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
    faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
    faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
    faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
    // faceUV[4] would be for bottom but not used
    // faceUV[5] would be for top but not used
  } else {
    boxMat.diffuseTexture = new Texture(
      "./assets/textures/semihouse.png"
    );
    faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0); //rear face
    faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
    faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
    faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side
    // faceUV[4] would be for bottom but not used
    // faceUV[5] would be for top but not used
  }

  const box = MeshBuilder.CreateBox(
    "box",
    { width: style, height: 1, faceUV: faceUV, wrap: true },
    scene
  );
  box.position = new Vector3(0, 0.5, 0);
  box.scaling = new Vector3(1, 1, 1);

  box.material = boxMat;

  const roof = MeshBuilder.CreateCylinder("roof", {
    diameter: 1.3,
    height: 1.2,
    tessellation: 3,
  });
  roof.scaling.x = 0.75;
  roof.scaling.y = style * 0.85;
  roof.rotation.z = Math.PI / 2;
  roof.position.y = 1.22;
  const roofMat = new StandardMaterial("roofMat");
  roofMat.diffuseTexture = new Texture(
    "./assets/textures/roof.jpg",
    scene
  );
  roof.material = roofMat;

  const house = Mesh.MergeMeshes(
    [box, roof],
    true,
    false,
  undefined,
    false,
    true
  );
  // last true allows combined mesh to use multiple materials

  return house;
}

function createHouses(scene: Scene, style: number) {
  //Start by locating one each of the two house types then add others

  if (style == 1) {
    // show 1 small house
    createHouse(scene, 1);
  }
  if (style == 2) {
    // show 1 large house
    createHouse(scene, 2);
  }
  if (style == 3) {
    // show estate
    const houses: Nullable<Mesh>[] = [];
    const ihouses: InstancedMesh[] = [];    
    const places: number[][] = []; //each entry is an array [house type, rotation, x, z]
    places.push([1, 0, 0, 1]); // small house
    places.push([2, 0, 2, 2]); // semi  house
    places.push([1, 0, 4, -1]);
    places.push([2, 0, -2, -2]);

    houses[0] = createHouse(scene, 1);
    houses[1] = createHouse(scene, 2);

    for (let i = 0; i < places.length; i++) {
      if (places[i][0] === 1) {
        ihouses[i] = houses[0]!.createInstance("house" + i);
      } else {
        ihouses[i] = houses[1]!.createInstance("house" + i);
      }
      ihouses[i].rotation.y = places[i][1];
      ihouses[i].position.x = places[i][2];
      ihouses[i].position.z = places[i][3];
    }
  }
  // nothing returned by this function
}

function createTrees(scene: Scene){
  const spriteManagerTrees = new SpriteManager("treesManager", "./assets/sprites/tree.png", 2000, {width: 512, height: 1024}, scene);

  //We create trees at random positions
  for (let i = 0; i < 50; i++) {
      const tree: Sprite = new Sprite("tree", spriteManagerTrees);
      tree.position.x = (Math.random() * 13) - 6;
      tree.position.z = (Math.random() * 13) - 6;
      tree.position.y = 0.2;
  }
  // nothing returned by this function
}

function createHemisphericLight(scene: Scene) {
  const light = new HemisphericLight(
    "light",
    new Vector3(2, 1, 0), // move x pos to direct shadows
    scene
  );
  light.intensity = 0.7;
  light.diffuse = new Color3(1, 1, 1);
  light.specular = new Color3(1, 0.8, 0.8);
  light.groundColor = new Color3(0, 0.2, 0.7);
  return light;
}



function importMeshA(scene: Scene, x: number, y: number) {
  let item: Promise<void | ISceneLoaderAsyncResult> =
    SceneLoader.ImportMeshAsync(
      "",
      "./assets/models/",
      "dummy3.babylon",
      scene
    );

  item.then((result) => {
    let character: AbstractMesh = result!.meshes[0];
    character.position.x = x;
    character.position.y = y + 0.1;
    character.scaling = new Vector3(1, 1, 1);
    character.rotation = new Vector3(0, 1.5, 0);
  });
  return item;
}


function createArcRotateCamera(scene: Scene) {
  let camAlpha = -Math.PI / 2,
    camBeta = Math.PI / 2.5,
    camDist = 25,
    camTarget = new Vector3(0, 0, 0);
  let camera = new ArcRotateCamera(
    "camera1",
    camAlpha,
    camBeta,
    camDist,
    camTarget,
    scene
  );
  camera.lowerRadiusLimit = 9;
  camera.upperRadiusLimit = 25;
  camera.lowerAlphaLimit = 0;
  camera.upperAlphaLimit = Math.PI * 2;
  camera.lowerBetaLimit = 0;
  camera.upperBetaLimit = Math.PI / 2.02;

  camera.attachControl(true);
  return camera;
}



export default function createStartScene(engine: Engine) {
  let scene   = new Scene(engine);
  let audio = backgroundMusic(scene);
  let ground  = createGround(scene);
  let sky     = createSky(scene);
  let sphere = createSphere(scene);
  let lightHemispheric = createHemisphericLight(scene);
  let box1 = createBox1(scene);
  createHouses(scene, 3);
  createTrees(scene);
  createTerrain(scene);
  createBoxes(scene);
  let camera  = createArcRotateCamera(scene);
  let directionalLight = createDirectionalLight(scene);
  let player = importMeshA(scene, 0, 0);


  


  let that: SceneData = {
    scene,
    ground,
    sky,
    box1,
    sphere,
    lightHemispheric,
    camera,
    directionalLight,
    player,
    audio,
  };
  
  return that;
}
