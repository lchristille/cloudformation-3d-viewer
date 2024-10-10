import * as THREE from "three";

// @ts-ignore
const vscode = acquireVsCodeApi();

// Canvas
const canvas: HTMLCanvasElement | null = document.querySelector("canvas.webgl");

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
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000
  );
  camera.position.z = 5;
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  updateSceneBackground();

  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  animate();

  function updateSceneBackground() {
    // Retrieve the current background color from the CSS variable
    const backgroundColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--vscode-editor-background")
      .trim();

    // Update the scene background with the new color
    scene.background = new THREE.Color(backgroundColor);
  }
}
