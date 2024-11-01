import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import App from "./App";

const rootElement = document.querySelector("#root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <Canvas>
      <App />
    </Canvas>
  );
}
