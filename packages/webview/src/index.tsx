import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import App from "./App";
import { Leva } from "leva";

const rootElement = document.querySelector("#root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <Canvas>
        <App />
      </Canvas>
    </StrictMode>
  );
}
