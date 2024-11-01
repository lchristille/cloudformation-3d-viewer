import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Group, Mesh } from "three";
import { Float, TransformControls, OrbitControls } from "@react-three/drei";
import { useControls } from "leva";
import { Perf } from "r3f-perf";

export default function App() {
  const cubeRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  const [transformTarget, setTransformTarget] = useState<Mesh | null>(null);

  const { showStats } = useControls({
    showStats: false
  })

  const { position, color } = useControls("sphere", {
      position: { value: { x: -2, y: 0, z: 0}, min: -5, max: 5, step: 0.1 },
      color: '#ff0000'
  });

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
      { showStats && <Perf position="bottom-right" />}
      <OrbitControls makeDefault />
      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <group ref={groupRef}>
        <mesh position={ [position.x, position.y, position.z ]}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
        <Float>
          <mesh
            ref={cubeRef}
            position-x={3}
            rotation-y={Math.PI * 0.25}
            scale={1.5}
          >
            <boxGeometry />
            <meshStandardMaterial color={color} />
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
