import * as THREE from "three";

// @ts-ignore
const vscode = acquireVsCodeApi();

// Canvas
const canvas: HTMLCanvasElement | null = document.querySelector("canvas.webgl");

const backgroundColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--vscode-editor-background')
  .trim();

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

if (!!canvas) {

    window.addEventListener('resize', () => {
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
  scene.background = new THREE.Color(backgroundColor);

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

  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  animate();
}
