import { extend, ReactThreeFiber, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Group, Mesh } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

extend({ OrbitControls });

declare global {
    namespace JSX {
        interface IntrinsicElements {
            orbitControls: ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>;
        }
    }
}

export default function App() {
  const { camera, gl } = useThree();
  const cubeRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <>
      <orbitControls args={ [camera, gl.domElement ] }/>

      <directionalLight position={ [1, 2, 3] } intensity={ 4.5 }/>
      <ambientLight intensity={ 1.5 }/>

      <group ref={groupRef}>
        <mesh position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
        <mesh
          ref={cubeRef}
          rotation-y={Math.PI * 0.25}
          position-x={2}
          scale={1.5}
        >
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
        <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
          <planeGeometry />
          <meshStandardMaterial color="greenyellow" />
        </mesh>
      </group>
    </>
  );
}
