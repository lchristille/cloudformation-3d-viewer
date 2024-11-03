/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Canvas } from "@react-three/fiber";
import ViewportScene from "../components/viewport/ViewportScene";

const layoutPosition = css`
    grid-area: main-viewport;
`

export default function MainViewport() {
    return <div css={[layoutPosition]}>
          <Canvas
        shadows
        camera={{
          fov: 75,
          near: 0.1,
          far: 200,
          position: [-4, 3, 6],
        }}
      >
        <ViewportScene />
      </Canvas>
    </div>
}