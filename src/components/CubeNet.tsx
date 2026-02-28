import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface FaceProps {
  color: string;
  label: string;
  isFolded: boolean;
  unfoldedPosition: [number, number, number];
  unfoldedRotation: [number, number, number];
  foldedPosition: [number, number, number];
  foldedRotation: [number, number, number];
}

function Face3D({ color, label, isFolded, unfoldedPosition, unfoldedRotation, foldedPosition, foldedRotation }: FaceProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (groupRef.current) {
      const targetPos = isFolded ? foldedPosition : unfoldedPosition;
      const targetRot = isFolded ? foldedRotation : unfoldedRotation;
      
      gsap.to(groupRef.current.position, {
        x: targetPos[0],
        y: targetPos[1],
        z: targetPos[2],
        duration: 1.2,
        ease: 'power3.inOut'
      });
      
      gsap.to(groupRef.current.rotation, {
        x: targetRot[0],
        y: targetRot[1],
        z: targetRot[2],
        duration: 1.2,
        ease: 'power3.inOut'
      });
    }
  }, [isFolded, foldedPosition, foldedRotation, unfoldedPosition, unfoldedRotation]);

  return (
    <group ref={groupRef} position={unfoldedPosition} rotation={unfoldedRotation}>
      {/* 主面片 - 使用薄盒子代替平面 */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[1.9, 1.9, 0.05]} />
        <meshStandardMaterial 
          color={color} 
          transparent
          opacity={0.85}
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>
      
      {/* 内部发光层 */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[1.7, 1.7]} />
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* 文字标签 */}
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.6}
        color="white"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {label}
      </Text>
      
      {/* 边框线 */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1.9, 1.9, 0.05)]} />
        <lineBasicMaterial color="white" linewidth={3} />
      </lineSegments>
    </group>
  );
}

function CubeNet3D({ isFolded }: { isFolded: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && !isFolded) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  // 展开图布局 (十字形)
  //      [上]
  // [左] [前] [右] [后]
  //      [下]
  
  const faces = [
    {
      label: '前',
      color: '#3B82F6', // 蓝色
      unfoldedPos: [0, 0, 0] as [number, number, number],
      unfoldedRot: [0, 0, 0] as [number, number, number],
      foldedPos: [0, 0, 1] as [number, number, number],
      foldedRot: [0, 0, 0] as [number, number, number],
    },
    {
      label: '上',
      color: '#10B981', // 绿色
      unfoldedPos: [0, 2, 0] as [number, number, number],
      unfoldedRot: [0, 0, 0] as [number, number, number],
      foldedPos: [0, 1, 0] as [number, number, number],
      foldedRot: [-Math.PI / 2, 0, 0] as [number, number, number],
    },
    {
      label: '下',
      color: '#F59E0B', // 橙色
      unfoldedPos: [0, -2, 0] as [number, number, number],
      unfoldedRot: [0, 0, 0] as [number, number, number],
      foldedPos: [0, -1, 0] as [number, number, number],
      foldedRot: [Math.PI / 2, 0, 0] as [number, number, number],
    },
    {
      label: '左',
      color: '#EF4444', // 红色
      unfoldedPos: [-2, 0, 0] as [number, number, number],
      unfoldedRot: [0, 0, 0] as [number, number, number],
      foldedPos: [-1, 0, 0] as [number, number, number],
      foldedRot: [0, -Math.PI / 2, 0] as [number, number, number],
    },
    {
      label: '右',
      color: '#8B5CF6', // 紫色
      unfoldedPos: [2, 0, 0] as [number, number, number],
      unfoldedRot: [0, 0, 0] as [number, number, number],
      foldedPos: [1, 0, 0] as [number, number, number],
      foldedRot: [0, Math.PI / 2, 0] as [number, number, number],
    },
    {
      label: '后',
      color: '#EC4899', // 粉色
      unfoldedPos: [4, 0, 0] as [number, number, number],
      unfoldedRot: [0, 0, 0] as [number, number, number],
      foldedPos: [0, 0, -1] as [number, number, number],
      foldedRot: [0, Math.PI, 0] as [number, number, number],
    },
  ];

  return (
    <group ref={groupRef}>
      {faces.map((face, index) => (
        <Face3D
          key={index}
          color={face.color}
          label={face.label}
          isFolded={isFolded}
          unfoldedPosition={face.unfoldedPos}
          unfoldedRotation={face.unfoldedRot}
          foldedPosition={face.foldedPos}
          foldedRotation={face.foldedRot}
        />
      ))}
    </group>
  );
}

function Scene({ isFolded }: { isFolded: boolean }) {
  return (
    <>
      {/* 环境光 */}
      <ambientLight intensity={0.8} />
      
      {/* 主光源 */}
      <directionalLight 
        position={[10, 10, 10]} 
        intensity={1.2} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      
      {/* 补光 */}
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      
      {/* 彩色点光源增加氛围 */}
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#3B82F6" />
      <pointLight position={[-5, -5, 5]} intensity={0.6} color="#EC4899" />
      
      {/* 3D模型 */}
      <CubeNet3D isFolded={isFolded} />
      
      {/* 控制器 */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={20}
        target={[0, 0, 0]}
      />
    </>
  );
}

export default function CubeNet() {
  const [isFolded, setIsFolded] = useState(false);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 relative">
        <Canvas 
          camera={{ position: [0, 0, 12], fov: 50 }}
          shadows
          gl={{ antialias: true, alpha: true }}
        >
          <Scene isFolded={isFolded} />
        </Canvas>
        
        {/* 控制面板 */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
          <button
            onClick={() => setIsFolded(false)}
            className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl ${
              !isFolded 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-500/40 scale-105 ring-2 ring-white/30' 
                : 'bg-white/10 text-white/70 hover:bg-white/20 backdrop-blur-md border border-white/20'
            }`}
          >
            展开
          </button>
          <button
            onClick={() => setIsFolded(true)}
            className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl ${
              isFolded 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-purple-500/40 scale-105 ring-2 ring-white/30' 
                : 'bg-white/10 text-white/70 hover:bg-white/20 backdrop-blur-md border border-white/20'
            }`}
          >
            折叠
          </button>
        </div>

        {/* 提示文字 */}
        <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-xl rounded-2xl p-5 border border-white/20 max-w-[280px]">
          <h3 className="text-white font-bold text-xl mb-2 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            正方体展开图
          </h3>
          <p className="text-white/70 text-sm leading-relaxed">
            🖱️ 拖动旋转视角<br/>
            🔍 滚轮缩放<br/>
            👆 点击按钮查看展开与折叠动画
          </p>
        </div>

        {/* 状态指示 */}
        <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/20">
          <span className={`text-sm font-medium ${isFolded ? 'text-purple-400' : 'text-cyan-400'}`}>
            {isFolded ? '🔷 折叠状态' : '📋 展开状态'}
          </span>
        </div>
      </div>
    </div>
  );
}
