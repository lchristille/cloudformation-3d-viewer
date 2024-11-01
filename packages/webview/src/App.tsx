import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Group, Mesh } from "three";
import { Float, TransformControls, OrbitControls } from "@react-three/drei";

export default function App() {
  const cubeRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  const [transformTarget, setTransformTarget] = useState<Mesh | null>(null);

  useEffect(() => {
    setTransformTarget(cubeRef.current);
  }, [cubeRef.current]);

  useFrame((state, delta) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <>
      <OrbitControls makeDefault />
      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <group ref={groupRef}>
        <mesh position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
        <Float>
          <mesh
            ref={cubeRef}
            position-x={2}
            rotation-y={Math.PI * 0.25}
            scale={1.5}
          >
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
          </mesh>
        </Float>
        <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
          <planeGeometry />
          <meshStandardMaterial color="greenyellow" />
        </mesh>
      </group>

      {transformTarget && (
        <TransformControls
          object={transformTarget}
          mode="translate"
          enabled={true}
        />
      )}
    </>
  );
}
