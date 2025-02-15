import { OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useMemo } from 'react';
import { Water } from 'three/examples/jsm/objects/Water';

// 水面コンポーネント
function WaterSurface() {
  const ref = useRef<Water>(null);
  const gl = useThree((state) => state.gl);
  const waterNormals = useLoader(THREE.TextureLoader, '/waternormals.jpeg');
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  const geom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), []);
  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0x000000,
      waterColor: 0x003033,
      distortionScale: 3,
      fog: false,
      format: gl.outputColorSpace,
    }),
    [waterNormals]
  );
  useFrame((_state, delta) => {
    if (ref.current?.material.uniforms) {
      ref.current.material.uniforms.time.value += delta;
    }
  });
  const water = useMemo(() => new Water(geom, config), [geom, config]);
  return <primitive object={water} ref={ref} rotation-x={-Math.PI / 2} />;
}

function OshimaModel() {
  const { scene } = useGLTF('assets/oshima-color.glb');

  return (
    <mesh scale={0.01} rotation={[0, Math.PI / 2, 0]}>
      <primitive object={scene} />
    </mesh>
  );
}

export default function FlightMap() {
  return (
    <div className="w-full border">
      <Canvas
        camera={{
          position: [100, 100, 100],
          fov: 50,
          near: 1,
          far: 10000,
        }}
      >
        <Sky
          distance={450000}
          sunPosition={[100, 100, 60]}
          inclination={0.5}
          azimuth={0.25}
          mieCoefficient={0.002}
          mieDirectionalG={0.7}
          turbidity={1}
          rayleigh={0.01}
        />
        <ambientLight intensity={0.5} />
        <hemisphereLight color="#ffffff" groundColor="#84a3db" intensity={1} />
        <pointLight position={[-50, 50, -50]} />
        <pointLight position={[50, 30, 50]} />
        <fog attach="fog" args={['#b1e1ff', 100, 1000]} />
        <OshimaModel />
        <WaterSurface />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.5}
          minDistance={50}
          maxDistance={250}
          target={[0, 0, 0]}
          enablePan={true}
          panSpeed={1.0}
          screenSpacePanning={true}
        />
      </Canvas>
    </div>
  );
}
