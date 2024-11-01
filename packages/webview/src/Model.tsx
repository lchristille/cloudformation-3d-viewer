import { PUBLIC_URI } from "./settings";
import { AppendURL } from "./helpers";
import { Clone, useGLTF } from "@react-three/drei";

const modelPath = AppendURL(PUBLIC_URI!, ["models", "hamburger-draco.glb"]);
useGLTF.preload(modelPath);

export default function Model() {
  const model = useGLTF(modelPath);
  return (
    <>
      <Clone object={model.scene} scale={0.5} />
    </>
  );
}
