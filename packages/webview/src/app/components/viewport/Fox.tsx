import { PUBLIC_URI } from "../../../settings";
import { AppendURL } from "../../../helpers";
import { Clone, useGLTF, useAnimations } from "@react-three/drei";
import { useEffect } from "react";

const modelPath = AppendURL(PUBLIC_URI!, ["models", "Fox", "glTF", "Fox.gltf"]);
useGLTF.preload(modelPath);

const Fox: React.FC = () => {
  const model = useGLTF(modelPath);
  const animations = useAnimations(model.animations, model.scene);

  console.log(animations);

  useEffect(() => {
    const surveyAction = animations.actions.Survey;
    const runAction = animations.actions.Run;
    const walkAction = animations.actions.Walk;
    if (runAction && walkAction && surveyAction) {
      surveyAction.play();

      window.setTimeout(() => {
      runAction.play();
      runAction.crossFadeFrom(surveyAction, 3, false);


        window.setTimeout(() => {
          walkAction.play();
          walkAction.crossFadeFrom(runAction, 1, false);
        }, 5000);

      }, 3000)
    }
  }, []);

  return (
    <>
      <primitive object={model.scene} scale={0.03} position-y={-1} />
    </>
  );
}

export default Fox;
