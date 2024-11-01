import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import App from "./App";
import { InitSettings } from "./settings";

const rootElement = document.querySelector("#root");

InitSettings()

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <Canvas
        shadows
        camera={{
          fov: 75,
          near: 0.1,
          far: 200,
          position: [-4, 3, 6],
        }}
      >
        <App />
      </Canvas>
    </StrictMode>
  );
}