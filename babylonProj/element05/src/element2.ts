import { SceneData } from './interfaces';

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
  Sound,
  Space,
  ShadowGenerator,
  DirectionalLight,
  SpotLight,
} from '@babylonjs/core';

import { Button, AdvancedDynamicTexture } from '@babylonjs/gui/2D';
import setSceneIndex from './index';

function createBox(
  scene: Scene,
  px: number,
  py: number,
  pz: number,
  sx: number,
  sy: number,
  sz: number,
  rotation: boolean
) {
  let box = MeshBuilder.CreateBox('box', { size: 1 }, scene);
  box.position = new Vector3(px, py, pz);
  box.scaling = new Vector3(sx, sy, sz);
  box.receiveShadows = true;

  if (rotation) {
    scene.registerAfterRender(function () {
      box.rotate(new Vector3(10, 7, 5) /*axis*/, 0.4 /*angle*/, Space.LOCAL);
    });
  }
  return box;
}

function createFacedBox(
  scene: Scene,
  px: number,
  py: number,
  pz: number,
  sx: number,
  sy: number,
  sz: number
) {
  const mat = new StandardMaterial('mat');
  const texture = new Texture(
    'https://assets.babylonjs.com/environments/numbers.jpg'
  );
  mat.diffuseTexture = texture;

  var columns = 6;
  var rows = 1;

  const faceUV = new Array(6);

  for (let i = 0; i < 6; i++) {
    faceUV[i] = new Vector4(i / columns, 0, (i + 1) / columns, 1 / rows);
  }

  const options = {
    faceUV: faceUV,
    wrap: true,
  };

  let box = MeshBuilder.CreateBox('tiledBox', options, scene);
  box.material = mat;
  box.position = new Vector3(px, py, pz);

  scene.registerAfterRender(function () {
    box.rotate(new Vector3(10, 7, 5) /*axis*/, 0.4 /*angle*/, Space.LOCAL);
  });
  return box;
}

function createAnyLight(
  scene: Scene,
  index: number,
  px: number,
  py: number,
  pz: number,
  colX: number,
  colY: number,
  colZ: number,
  mesh: Mesh
) {
  switch (index) {
    case 1:
      const spotLight = new SpotLight(
        'spotLight',
        new Vector3(px, py, pz),
        new Vector3(0, -1, 0),
        Math.PI / 3,
        10,
        scene
      );
      spotLight.diffuse = new Color3(colX, colY, colZ);
      let shadowGenerator = new ShadowGenerator(1024, spotLight);
      shadowGenerator.addShadowCaster(mesh);
      shadowGenerator.useExponentialShadowMap = true;
      return spotLight;
      break;
    case 2:
      const directionalLight = new DirectionalLight(
        'directionalLight',
        new Vector3(px, py, pz),
        scene
      );
      directionalLight.diffuse = new Color3(colX, colY, colZ);
      shadowGenerator = new ShadowGenerator(1024, directionalLight);
      shadowGenerator.addShadowCaster(mesh);
      shadowGenerator.useExponentialShadowMap = true;
      return directionalLight;
      break;
  }
}

function createDirectionalLight(scene: Scene) {
  const light = new DirectionalLight('light', new Vector3(1, 0, 0), scene);
  light.diffuse = new Color3(1, 0, 0);
  light.intensity = 1;
  return light;
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
  const groundMaterial = new StandardMaterial('groundMaterial');
  groundMaterial.diffuseTexture = new Texture(
    './assets/environments/valleygrass.png'
  );
  groundMaterial.diffuseTexture.hasAlpha = true;
  //groundMaterial.diffuseColor = new Color3(0, 1, 0);
  groundMaterial.backFaceCulling = false;
  let ground = MeshBuilder.CreateGround(
    'ground',
    { width: 15, height: 15 },
    scene
  );

  ground.material = groundMaterial;
  return ground;
}

function createTerrain(scene: Scene) {
  const largeGroundMat = new StandardMaterial('largeGroundMat');
  largeGroundMat.diffuseTexture = new Texture(
    './assets/environments/valleygrass.png'
  );

  const largeGround = MeshBuilder.CreateGroundFromHeightMap(
    'largeGround',
    './assets/environments/Height.png',
    {
      width: 300,
      height: 300,
      subdivisions: 100,
      minHeight: 0,
      maxHeight: 40,
    },
    scene
  );
  largeGround.material = largeGroundMat;
  largeGround.position.y = -20;
}

function createSky(scene: Scene) {
  const skybox = MeshBuilder.CreateBox('skyBox', { size: 150 }, scene);
  const skyboxMaterial = new StandardMaterial('skyBox', scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new CubeTexture(
    './assets/textures/skybox/skybox',
    scene
  );
  skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
  skyboxMaterial.specularColor = new Color3(0, 0, 0);
  skybox.material = skyboxMaterial;
  return skybox;
}

function createHouse(scene: Scene, style: number) {
  //style 1 small style 2 semi detatched
  const boxMat = new StandardMaterial('boxMat');
  const faceUV: Vector4[] = []; // faces for small house
  if (style == 1) {
    boxMat.diffuseTexture = new Texture('./assets/textures/cubehouse.png');
    faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
    faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
    faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
    faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
  } else {
    boxMat.diffuseTexture = new Texture('./assets/textures/semihouse.png');
    faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0); //rear face
    faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
    faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
    faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side
  }

  const box = MeshBuilder.CreateBox(
    'box',
    { width: style, height: 1, faceUV: faceUV, wrap: true },
    scene
  );
  box.position = new Vector3(0, 0.5, 0);
  box.scaling = new Vector3(1, 1, 1);

  box.material = boxMat;

  const roof = MeshBuilder.CreateCylinder('roof', {
    diameter: 1.3,
    height: 1.2,
    tessellation: 3,
  });
  roof.scaling.x = 0.75;
  roof.scaling.y = style * 0.85;
  roof.rotation.z = Math.PI / 2;
  roof.position.y = 1.22;
  const roofMat = new StandardMaterial('roofMat');
  roofMat.diffuseTexture = new Texture('./assets/textures/roof.jpg', scene);
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
        ihouses[i] = houses[0]!.createInstance('house' + i);
      } else {
        ihouses[i] = houses[1]!.createInstance('house' + i);
      }
      ihouses[i].rotation.y = places[i][1];
      ihouses[i].position.x = places[i][2];
      ihouses[i].position.z = places[i][3];
    }
  }
  // nothing returned by this function
}

function createTrees(scene: Scene) {
  const spriteManagerTrees = new SpriteManager(
    'treesManager',
    './assets/sprites/tree.png',
    2000,
    { width: 512, height: 1024 },
    scene
  );

  //We create trees at random positions
  for (let i = 0; i < 50; i++) {
    const tree: Sprite = new Sprite('tree', spriteManagerTrees);
    tree.position.x = Math.random() * 13 - 6;
    tree.position.z = Math.random() * 13 - 6;
    tree.position.y = 0.2;
  }
  // nothing returned by this function
}

function createHemisphericLight(scene: Scene) {
  const light = new HemisphericLight(
    'light',
    new Vector3(2, 1, 0), // move x pos to direct shadows
    scene
  );
  light.intensity = 0.7;
  light.diffuse = new Color3(1, 1, 1);
  light.specular = new Color3(1, 0.8, 0.8);
  light.groundColor = new Color3(0, 0.2, 0.7);
  return light;
}

function createArcRotateCamera(scene: Scene) {
  let camAlpha = -Math.PI / 2,
    camBeta = Math.PI / 2.5,
    camDist = 25,
    camTarget = new Vector3(0, 0, 0);
  let camera = new ArcRotateCamera(
    'camera1',
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
  button.width = '180px';
  button.height = '35px';
  button.color = 'white';
  button.cornerRadius = 20;
  button.background = 'green';
  const buttonClick: Sound = new Sound(
    'MenuClickSFX',
    './assets/audio/menu-click.wav',
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

export default function element2(engine: Engine) {
  let scene = new Scene(engine);
  let ground = createGround(scene);
  let sky = createSky(scene);
  let lightHemispheric = createHemisphericLight(scene);
  createHouses(scene, 3);
  createTrees(scene);
  createTerrain(scene);
  createBoxes(scene);
  let camera = createArcRotateCamera(scene);
  let directionalLight = createDirectionalLight(scene);

  let advancedTexture: AdvancedDynamicTexture =
    AdvancedDynamicTexture.CreateFullscreenUI('myUI', true);
  let button1: Button = createSceneButton(
    scene,
    'but1',
    'Element 1',
    '-700px',
    '0px',
    advancedTexture,
    0
  );
  let button2: Button = createSceneButton(
    scene,
    'but2',
    'Element 2',
    '-700px',
    '-60px',
    advancedTexture,
    1
  );
  let button3: Button = createSceneButton(
    scene,
    'but3',
    'Element 3',
    '-700px',
    '-120px',
    advancedTexture,
    2
  );

  let that: SceneData = {
    scene,
    ground,
    sky,
    lightHemispheric,
    camera,
    directionalLight,
  };

  return that;
}
