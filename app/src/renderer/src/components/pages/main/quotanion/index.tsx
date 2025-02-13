import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

// ダミーのクォータニオンデータを生成する関数
function generateDummyQuaternion() {
  // ロケットらしい動きに制限したオイラー角を生成
  const euler = new THREE.Euler(
    // X軸（ピッチ）: -30度から30度の範囲
    (Math.random() * Math.PI) / 3 - Math.PI / 6,
    // Y軸（ヨー）: -45度から45度の範囲
    (Math.random() * Math.PI) / 2 - Math.PI / 4,
    // Z軸（ロール）: -20度から20度の範囲
    (Math.random() * Math.PI) / 9 - Math.PI / 18
  );

  // オイラー角からクォータニオンを生成
  return new THREE.Quaternion().setFromEuler(euler);
}

// ロケットモデルコンポーネント
function RocketModel() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [currentQuaternion, setCurrentQuaternion] = useState(new THREE.Quaternion());
  const { scene } = useGLTF('assets/rocket.glb');

  // クォータニオンの更新間隔を2秒に変更（より自然な動きに）
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuaternion(generateDummyQuaternion());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // クォータニオンを適用（補間速度を調整）
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.quaternion.slerp(currentQuaternion, 0.05); // よりゆっくりとした補間
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={meshRef} scale={2}>
        <primitive object={scene} />
      </mesh>
    </group>
  );
}

export default function Quotanion() {
  const [_currentQuaternion, setCurrentQuaternion] = useState<THREE.Quaternion>(
    new THREE.Quaternion()
  );

  // 1秒ごとにクォータニオンを更新
  useEffect(() => {
    const interval = setInterval(() => {
      const newQuaternion = generateDummyQuaternion();
      setCurrentQuaternion(newQuaternion);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex size-full flex-col border">
      <Canvas
        camera={{
          position: [10, 10, 10],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
      >
        <ambientLight intensity={0.3} />
        <hemisphereLight color="#ffffff" groundColor="#444444" intensity={0.5} />
        <RocketModel />
        <OrbitControls enableRotate={true} enableZoom={true} enablePan={true} target={[0, 0, 0]} />
        {/* 座標軸を表示（デバッグ用） */}
        <axesHelper args={[5]} position={[0, 0, 0]} />
      </Canvas>
    </div>
  );
}
