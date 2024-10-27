import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// @ts-ignore
const vscode = acquireVsCodeApi();
// vscode.postMessage({
//   command: 'getExtensionMediaUri'
// })

// window.addEventListener('message', event => {
//   const message = event.data;

//   switch(message.command) {
//     case 'getExtensionMediaUri':
//       console.log("extensionMediaUri", message.extensionMediaUri)
//   }
// })

// Canvas
const canvas: HTMLCanvasElement | null = document.querySelector("canvas.webgl");
const mediaUri = new URL(canvas?.dataset.mediaUri ?? "");
const textureUri = new URL('textures/', mediaUri);

/**
 * Textures
 */
const doorTextureUri = new URL('Door_Wood_001_basecolor.jpg', textureUri).href;
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const texture = textureLoader.load(doorTextureUri);
texture.colorSpace = THREE.SRGBColorSpace;


//const textureUri = vscode.Uri.joinPath(extensionMediaUri, 'textures', 'Door_Wood_001_basecolor.jpg')

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

if (!!canvas) {
  const observer = new MutationObserver(() => {
    updateSceneBackground();
  });

  // Observe changes in the style attribute of the document's root element
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["style"],
  });

  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // Scene
  const scene = new THREE.Scene();

  // Object
  // const geometry = new THREE.BoxGeometry();
  // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  // const cube = new THREE.Mesh(geometry, material);
  // scene.add(cube);

  const box = createBeveledBox(10, 5, 0.3);
  scene.add(box);

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000
  );
  camera.position.z = 5;
  camera.position.y = 3;
  camera.lookAt(box.position);
  scene.add(camera);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  updateSceneBackground();

  const clock = new THREE.Clock();

  function tick() {
    // Time
    const elapsedTime = clock.getElapsedTime();

    box.position.y = (0.03 * Math.sin(elapsedTime * 2));
    box.rotation.y = (0.1 * Math.sin(elapsedTime * 0.3));

    controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  tick();

  function updateSceneBackground() {
    // Retrieve the current background color from the CSS variable
    const backgroundColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--vscode-editor-background")
      .trim();

    // Update the scene background with the new color
    scene.background = new THREE.Color(backgroundColor);
  }

  function createBeveledBox(width: number, height: number, depth: number) {
    const shape = new THREE.Shape();

    shape.moveTo(0, 0);
    shape.lineTo(0, height);
    shape.lineTo(width, height);
    shape.lineTo(width, 0);
    shape.lineTo(0, 0);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: depth,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.2,
      bevelSegments: 64,
      bevelOffset: 0.1
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    geometry.computeBoundingBox();

    const boundingBox = geometry.boundingBox!;

    const centerX = (boundingBox.max.x + boundingBox.min.x) / 2;
    const centerY = (boundingBox.max.y + boundingBox.min.y) / 2;
    const centerZ = (boundingBox.max.z + boundingBox.min.z) / 2;

    geometry.translate(-centerX, -centerY, -centerZ);
    geometry.rotateX(Math.PI / 2);

    //const material = new THREE.MeshBasicMaterial({ color: 0x333E48 });
    //const material = new THREE.MeshBasicMaterial({ color: 0xFF9900 });
    const material = new THREE.MeshBasicMaterial({ map: texture })
    const mesh = new THREE.Mesh(geometry, material);

    return mesh;
  }
}
