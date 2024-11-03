import { useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { DirectionalLight, Group, Mesh } from "three";
import {
  TransformControls,
  OrbitControls,
  SoftShadows,
} from "@react-three/drei";
import { useControls } from "leva";
import { Perf } from "r3f-perf";

import Model from "./Model";
import Fox from "./Fox";

export default function App() {
  const cubeRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const directionalLight = useRef<DirectionalLight>(
    null
  ) as React.MutableRefObject<DirectionalLight>;

  // useHelper(directionalLight, THREE.DirectionalLightHelper, 1);

  const { showStats } = useControls({
    showStats: false,
  });


  return (
    <>
      <SoftShadows size={25} samples={10} focus={0} />
      {showStats && <Perf position="bottom-right" />}
      <OrbitControls makeDefault />
      <directionalLight
        ref={directionalLight}
        position={[1, 2, 3]}
        intensity={4.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <ambientLight intensity={1.5} />

      <group ref={groupRef}>
        <Suspense>
        </Suspense>
        <mesh
          receiveShadow
          position-y={-1}
          rotation-x={-Math.PI * 0.5}
          scale={10}
        >
          <planeGeometry />
          <meshStandardMaterial color="greenyellow" />
        </mesh>
      </group>
    </>
  );
}
