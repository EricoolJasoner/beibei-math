import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface FaceProps {
  color: string;
  label: string;
  unfoldProgress: number;
  unfoldedPosition: [number, number, number];
  unfoldedRotation: [number, number, number];
  foldedPosition: [number, number, number];
  foldedRotation: [number, number, number];
}

function Face3D({ color, label, unfoldProgress, unfoldedPosition, unfoldedRotation, foldedPosition, foldedRotation }: FaceProps) {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (groupRef.current) {
      const progress = unfoldProgress;
      
      const currentPos = [
        foldedPosition[0] + (unfoldedPosition[0] - foldedPosition[0]) * progress,
        foldedPosition[1] + (unfoldedPosition[1] - foldedPosition[1]) * progress,
        foldedPosition[2] + (unfoldedPosition[2] - foldedPosition[2]) * progress,
      ];
      
      const currentRot = [
        foldedRotation[0] + (unfoldedRotation[0] - foldedRotation[0]) * progress,
        foldedRotation[1] + (unfoldedRotation[1] - foldedRotation[1]) * progress,
        foldedRotation[2] + (unfoldedRotation[2] - foldedRotation[2]) * progress,
      ];
      
      gsap.to(groupRef.current.position, {
        x: currentPos[0],
        y: currentPos[1],
        z: currentPos[2],
        duration: 0.1,
        ease: 'power1.out'
      });
      
      gsap.to(groupRef.current.rotation, {
        x: currentRot[0],
        y: currentRot[1],
        z: currentRot[2],
        duration: 0.1,
        ease: 'power1.out'
      });
    }
  }, [unfoldProgress, foldedPosition, foldedRotation, unfoldedPosition, unfoldedRotation]);

  return (
    <group ref={groupRef} position={foldedPosition} rotation={foldedRotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.95, 0.95, 0.05]} />
        <meshStandardMaterial 
          color={color} 
          transparent
          opacity={0.9}
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      <Text position={[0, 0, 0.06]} fontSize={0.25} color="white" anchorX="center" anchorY="middle" fontWeight="bold">
        {label}
      </Text>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.95, 0.95, 0.05)]} />
        <lineBasicMaterial color="white" linewidth={2} />
      </lineSegments>
    </group>
  );
}

// ============================================
// 正方体11种展开图 - 按照图片正确布局
// ============================================

// 141型（6种）：中间4个一连串，两边各一随便放
const cubeNet141 = [
  {
    id: 1,
    name: '141型-1',
    rhyme: '中间4个一连串，两边各一随便放',
    layout: [
      { label: '1', color: '#10B981', pos: [-1.5, 1, 0], rot: [0, 0, 0], foldedPos: [0, 0.5, 0], foldedRot: [-Math.PI/2, 0, 0] },
      { label: '2', color: '#3B82F6', pos: [-1.5, 0, 0], rot: [0, 0, 0], foldedPos: [-0.5, 0, 0], foldedRot: [0, -Math.PI/2, 0] },
      { label: '3', color: '#3B82F6', pos: [-0.5, 0, 0], rot: [0, 0, 0], foldedPos: [0, 0, 0.5], foldedRot: [0, 0, 0] },
      { label: '4', color: '#3B82F6', pos: [0.5, 0, 0], rot: [0, 0, 0], foldedPos: [0.5, 0, 0], foldedRot: [0, Math.PI/2, 0] },
      { label: '5', color: '#3B82F6', pos: [1.5, 0, 0], rot: [0, 0, 0], foldedPos: [0, 0, -0.5], foldedRot: [0, Math.PI, 0] },
      { label: '6', color: '#F59E0B', pos: [-1.5, -1, 0], rot: [0, 0, 0], foldedPos: [0, -0.5, 0], foldedRot: [Math.PI/2, 0, 0] },
    ]
  },
  {
    id: 2,
    name: '141型-2',
    rhyme: '中间4个一连串，两边各一随便放',
    layout: [
      { label: '1', color: '#10B981', pos: [-1.5, 1, 0], rot: [0, 0, 0], foldedPos: [0, 0.5, 0], foldedRot: [-Math.PI/2, 0, 0] },
      { label: '2', color: '#3B82F6', pos: [-1.5, 0, 0], rot: [0, 0, 0], foldedPos: [-0.5, 0, 0], foldedRot: [0, -Math.PI/2, 0] },
      { label: '3', color: '#3B82F6', pos: [-0.5, 0, 0], rot: [0, 0, 0], foldedPos: [0, 0, 0.5], foldedRot: [0, 0, 0] },
      { label: '4', color: '#3B82F6', pos: [0.5, 0, 0], rot: [0, 0, 0], foldedPos: [0.5, 0, 0], foldedRot: [0, Math.PI/2, 0] },
      { label: '5', color: '#3B82F6', pos: [1.5, 0, 0], rot: [0, 0, 0], foldedPos: [0, 0, -0.5], foldedRot: [0, Math.PI, 0] },
      { label: '6', color: '#F59E0B', pos: [-0.5, -1, 0], rot: [0, 0, 0], foldedPos: [0, -0.5, 0], foldedRot: [Math.PI/2, 0, 0] },
    ]
  },
  {
    id: 3,
    name: '141型-3',
    rhyme: '中间4个一连串，两边各一随便放',
    layout: [
      { label: '1', color: '#10B981', pos: [-1.5, 1, 0], rot: [0, 0, 0], foldedPos: [0, 0.5, 0], foldedRot: [-Math.PI/2, 0, 0] },
      { label: '2', color: '#3B82F6', pos: [-1.5, 0, 0], rot: [0, 0, 0], foldedPos: [-0.5, 0, 0], foldedRot: [0, -Math.PI/2, 0] },
      { label: '3', color: '#3B82F6', pos: [-0.5, 0, 0], rot: [0, 0, 0], foldedPos: [0, 0, 0.5], foldedRot: [0, 0, 0] },
      { label: '4', color: '#3B82F6', pos: [0.5, 0, 0], rot: [0, 0, 0], foldedPos: [0.5, 0, 0], foldedRot: [0, Math.PI/2, 0] },
      { label: '5', color: '#3B82F6', pos: [1.5, 0, 0], rot: [0, 0, 0], foldedPos: [0, 0, -0.5], foldedRot: [0, Math.PI, 0] },
      { label: '6', color: '#F59E0B', pos: [0.5, -1, 0], rot: [0, 0, 0], foldedPos: [0, -0.5, 0], foldedRot: [Math.PI/2, 0, 0] },
    ]
  },
  {
    id: 4,
    name: '141型-4',
    rhyme: '中间4个一连串，两边各一随便放',
    layout: [
      { label: '1', color: '#10B981', pos: [-1.5, 1, 0], rot: [0, 0, 0], foldedPos: [0, 0.5, 0], foldedRot: [-Math.PI/2, 0, 0] },
      { label: '2', color: '#3B82F6', pos: [-1.5, 0, 0], rot: [0, 0, 0], foldedPos: [-0.5, 0, 0], foldedRot: [0, -Math.PI/2, 0] },
      { label: '3', color: '#3B82F6', pos: [-0.5, 0, 0], rot: [0, 0, 0], foldedPos: [0, 0, 0.5], foldedRot: [0, 0, 0] },
      { label: '4', color: '#3B82F6', pos: [0.5, 0, 0], rot: [0, 0, 0], foldedPos: [0.5, 0, 0], foldedRot: [0, Math.PI/2, 0] },
      { label: '5', color: '#3B82F6', pos: [1.5, 0, 0], rot: [0, 0, 0], foldedPos: [0, 0, -0.5], foldedRot: [0, Math.PI, 0] },
      { label: '6', color: '#F59E0B', pos: [1.5, -1, 0], rot: [0, 0, 0], foldedPos: [0, -0.5, 0], foldedRot: [Math.PI/2, 0, 0] },
    ]
  },
  {
    id: 5,
    name: '141型-5',
    rhyme: '中间4个一连串，两边各一随便放',
    layout: [
      { label: '1', color: '#10B981', pos: [-0.5, 1, 0], rot: [0, 0, 0], foldedPos: [0, 0.5, 0], foldedRot: [-Math.PI/2, 0, 0] },
      { label: '2', color: '#3B82F6', pos: [-1.5, 0, 0], rot: [0, 0, 0], foldedPos: [-0.5, 0, 0], foldedRot: [0, -Math.PI/2, 0] },
      { label: '3', color: '#3B82F6', pos: [-0.5, 0, 0], rot: [0, 0, 0], foldedPos: [0, 0, 0.5], foldedRot: [0, 0, 0] },
      { label: '4', color: '#3B82F6', pos: [0.5, 0, 0], rot: [0, 0, 0], foldedPos: [0.5, 0, 0], foldedRot: [0, Math.PI/2, 0] },
      { label: '5', color: '#3B82F6', pos: [1.5, 0, 0], rot: [0, 0, 0], foldedPos: [0, 0, -0.5], foldedRot: [0, Math.PI, 0] },
      { label: '6', color: '#F59E0B', pos: [-0.5, -1, 0], rot: [0, 0, 0], foldedPos: [0, -0.5, 0], foldedRot: [Math.PI/2, 0, 0] },
    ]
  },
  {
    id: 6,
    name: '141型-6',
    rhyme: '中间4个一连串，两边各一随便放',
    layout: [
      { label: '1', color: '#10B981', pos: [-0.5, 1, 0], rot: [0, 0, 0], foldedPos: [0, 0.5, 0], foldedRot: [-Math.PI/2, 0, 0] },
      { label: '2', color: '#3B82F6', pos: [-1.5, 0, 0], rot: [0, 0, 0], foldedPos: [-0.5, 0, 0], foldedRot: [0, -Math.PI/2, 0] },
      { label: '3', color: '#3B82F6', pos: [-0.5, 0, 0], rot: [0, 0, 0], foldedPos: [0, 0, 0.5], foldedRot: [0, 0, 0] },
      { label: '4', color: '#3B82F6', pos: [0.5, 0, 0], rot: [0, 0, 0], foldedPos: [0.5, 0, 0], foldedRot: [0, Math.PI/2, 0] },
      { label: '5', color: '#3B82F6', pos: [1.5, 0, 0], rot: [0, 0, 0], foldedPos: [0, 0, -0.5], foldedRot: [0, Math.PI, 0] },
      { label: '6', color: '#F59E0B', pos: [0.5, -1, 0], rot: [0, 0, 0], foldedPos: [0, -0.5, 0], foldedRot: [Math.PI/2, 0, 0] },
    ]
  },
];

// 231型（3种）：二三紧连错一个
// 第一行2个，第二行3个（向右错开1格），第三行1个
const cubeNet231 = [
  {
    id: 7,
    name: '231型-1',
    rhyme: '二三紧连错一个，三一相连一随便',
    // 2、3、6在同一列
    layout: [
      { label: '1', color: '#10B981', pos: [-1, 1, 0], rot: [0, 0, 0], foldedPos: [0, 0.5, 0], foldedRot: [-Math.PI/2, 0, 0] },
      { label: '2', color: '#10B981', pos: [0, 1, 0], rot: [0, 0, 0], foldedPos: [0, 0, -0.5], foldedRot: [0, Math.PI, 0] },
      { label: '3', color: '#3B82F6', pos: [0, 0, 0], rot: [0, 0, 0], foldedPos: [-0.5, 0, 0], foldedRot: [0, -Math.PI/2, 0] },
      { label: '4', color: '#3B82F6', pos: [1, 0, 0], rot: [0, 0, 0], foldedPos: [0, 0, 0.5], foldedRot: [0, 0, 0] },
      { label: '5', color: '#3B82F6', pos: [2, 0, 0], rot: [0, 0, 0], foldedPos: [0.5, 0, 0], foldedRot: [0, Math.PI/2, 0] },
      { label: '6', color: '#F59E0B', pos: [0, -1, 0], rot: [0, 0, 0], foldedPos: [0, -0.5, 0], foldedRot: [Math.PI/2, 0, 0] },
    ]
  },
  {
    id: 8,
    name: '231型-2',
    rhyme: '二三紧连错一个，三一相连一随便',
    // 2、3在一列，4、6在一列
    layout: [
      { label: '1', color: '#10B981', pos: [-1, 1, 0], rot: [0, 0, 0], foldedPos: [0, 0.5, 0], foldedRot: [-Math.PI/2, 0, 0] },
      { label: '2', color: '#10B981', pos: [0, 1, 0], rot: [0, 0, 0], foldedPos: [0, 0, -0.5], foldedRot: [0, Math.PI, 0] },
      { label: '3', color: '#3B82F6', pos: [0, 0, 0], rot: [0, 0, 0], foldedPos: [-0.5, 0, 0], foldedRot: [0, -Math.PI/2, 0] },
      { label: '4', color: '#3B82F6', pos: [1, 0, 0], rot: [0, 0, 0], foldedPos: [0, 0, 0.5], foldedRot: [0, 0, 0] },
      { label: '5', color: '#3B82F6', pos: [2, 0, 0], rot: [0, 0, 0], foldedPos: [0.5, 0, 0], foldedRot: [0, Math.PI/2, 0] },
      { label: '6', color: '#F59E0B', pos: [1, -1, 0], rot: [0, 0, 0], foldedPos: [0, -0.5, 0], foldedRot: [Math.PI/2, 0, 0] },
    ]
  },
  {
    id: 9,
    name: '231型-3',
    rhyme: '二三紧连错一个，三一相连一随便',
    // 2、3在一列，5、6在一列
    layout: [
      { label: '1', color: '#10B981', pos: [-1, 1, 0], rot: [0, 0, 0], foldedPos: [0, 0.5, 0], foldedRot: [-Math.PI/2, 0, 0] },
      { label: '2', color: '#10B981', pos: [0, 1, 0], rot: [0, 0, 0], foldedPos: [0, 0, -0.5], foldedRot: [0, Math.PI, 0] },
      { label: '3', color: '#3B82F6', pos: [0, 0, 0], rot: [0, 0, 0], foldedPos: [-0.5, 0, 0], foldedRot: [0, -Math.PI/2, 0] },
      { label: '4', color: '#3B82F6', pos: [1, 0, 0], rot: [0, 0, 0], foldedPos: [0, 0, 0.5], foldedRot: [0, 0, 0] },
      { label: '5', color: '#3B82F6', pos: [2, 0, 0], rot: [0, 0, 0], foldedPos: [0.5, 0, 0], foldedRot: [0, Math.PI/2, 0] },
      { label: '6', color: '#F59E0B', pos: [2, -1, 0], rot: [0, 0, 0], foldedPos: [0, -0.5, 0], foldedRot: [Math.PI/2, 0, 0] },
    ]
  },
];

// 222型（1种）：两两相连各挪一
// 阶梯状：第一行2个，第二行2个向右错开1格，第三行2个向右再错开1格
const cubeNet222 = [
  {
    id: 10,
    name: '222型-阶梯',
    rhyme: '两两相连各挪一',
    // 2、3在一列，4、5在一列
    layout: [
      { label: '1', color: '#10B981', pos: [-1, 1, 0], rot: [0, 0, 0], foldedPos: [0, 0.5, 0], foldedRot: [-Math.PI/2, 0, 0] },
      { label: '2', color: '#10B981', pos: [0, 1, 0], rot: [0, 0, 0], foldedPos: [0, 0, -0.5], foldedRot: [0, Math.PI, 0] },
      { label: '3', color: '#3B82F6', pos: [0, 0, 0], rot: [0, 0, 0], foldedPos: [-0.5, 0, 0], foldedRot: [0, -Math.PI/2, 0] },
      { label: '4', color: '#3B82F6', pos: [1, 0, 0], rot: [0, 0, 0], foldedPos: [0, 0, 0.5], foldedRot: [0, 0, 0] },
      { label: '5', color: '#F59E0B', pos: [1, -1, 0], rot: [0, 0, 0], foldedPos: [0.5, 0, 0], foldedRot: [0, Math.PI/2, 0] },
      { label: '6', color: '#F59E0B', pos: [2, -1, 0], rot: [0, 0, 0], foldedPos: [0, -0.5, 0], foldedRot: [Math.PI/2, 0, 0] },
    ]
  },
];

// 33型（1种）：三个两排一对齐
// 两行各3个，第二行向右错开2格，只有一个方块对齐（形成"日"字）
const cubeNet33 = [
  {
    id: 11,
    name: '33型-日字',
    rhyme: '三个两排一对齐',
    // 第一行3个，第二行3个向右错开2格，只有中间1个对齐
    layout: [
      { label: '1', color: '#10B981', pos: [-1, 0.5, 0], rot: [0, 0, 0], foldedPos: [0, 0.5, 0], foldedRot: [-Math.PI/2, 0, 0] },
      { label: '2', color: '#10B981', pos: [0, 0.5, 0], rot: [0, 0, 0], foldedPos: [0, 0, -0.5], foldedRot: [0, Math.PI, 0] },
      { label: '3', color: '#10B981', pos: [1, 0.5, 0], rot: [0, 0, 0], foldedPos: [0.5, 0, 0], foldedRot: [0, Math.PI/2, 0] },
      { label: '4', color: '#3B82F6', pos: [1, -0.5, 0], rot: [0, 0, 0], foldedPos: [-0.5, 0, 0], foldedRot: [0, -Math.PI/2, 0] },
      { label: '5', color: '#3B82F6', pos: [2, -0.5, 0], rot: [0, 0, 0], foldedPos: [0, 0, 0.5], foldedRot: [0, 0, 0] },
      { label: '6', color: '#3B82F6', pos: [3, -0.5, 0], rot: [0, 0, 0], foldedPos: [0, -0.5, 0], foldedRot: [Math.PI/2, 0, 0] },
    ]
  },
];

// 合并所有类型
const cubeNetTypes = [...cubeNet141, ...cubeNet231, ...cubeNet222, ...cubeNet33];

function CubeNet3D({ unfoldProgress, layout }: { unfoldProgress: number; layout: typeof cubeNetTypes[0]['layout'] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {layout.map((face, index) => (
        <Face3D
          key={index}
          color={face.color}
          label={face.label}
          unfoldProgress={unfoldProgress}
          unfoldedPosition={face.pos as [number, number, number]}
          unfoldedRotation={face.rot as [number, number, number]}
          foldedPosition={face.foldedPos as [number, number, number]}
          foldedRotation={face.foldedRot as [number, number, number]}
        />
      ))}
    </group>
  );
}

function Scene({ unfoldProgress, layout }: { unfoldProgress: number; layout: typeof cubeNetTypes[0]['layout'] }) {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[10, 10, 10]} intensity={1.2} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#3B82F6" />
      <pointLight position={[-5, -5, 5]} intensity={0.6} color="#EC4899" />
      <CubeNet3D unfoldProgress={unfoldProgress} layout={layout} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={3} maxDistance={20} target={[0, 0, 0]} />
    </>
  );
}

export default function CubeNetAll() {
  const [unfoldProgress, setUnfoldProgress] = useState(1);
  const [currentType, setCurrentType] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const startProgress = useRef(0);

  const currentNet = cubeNetTypes[currentType];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartY.current = e.clientY;
    startProgress.current = unfoldProgress;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaY = dragStartY.current - e.clientY;
    const newProgress = Math.max(0, Math.min(1, startProgress.current + deltaY / 200));
    setUnfoldProgress(newProgress);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    dragStartY.current = e.touches[0].clientY;
    startProgress.current = unfoldProgress;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaY = dragStartY.current - e.touches[0].clientY;
    const newProgress = Math.max(0, Math.min(1, startProgress.current + deltaY / 200));
    setUnfoldProgress(newProgress);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div 
        className="flex-1 relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }} shadows gl={{ antialias: true, alpha: true }}>
          <Scene unfoldProgress={unfoldProgress} layout={currentNet.layout} />
        </Canvas>
        
        {/* 类型选择器 */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-1 max-w-[95%] z-10">
          {cubeNetTypes.map((net, index) => (
            <button
              key={net.id}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentType(index);
              }}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                currentType === index
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                  : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white backdrop-blur-sm'
              }`}
              title={net.name}
            >
              {net.id}
            </button>
          ))}
        </div>

        {/* 拖拽提示 */}
        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
          <span className="text-white/80 text-sm">👆 上下拖拽展开/折叠</span>
        </div>

        {/* 进度条 */}
        <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 w-64 h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-75"
            style={{ width: `${unfoldProgress * 100}%` }}
          />
        </div>

        {/* 信息面板 */}
        <div className="absolute top-24 left-6 bg-black/60 backdrop-blur-xl rounded-2xl p-5 border border-white/20 max-w-[320px]">
          <h3 className="text-white font-bold text-lg mb-1">{currentNet.name}</h3>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 bg-blue-500/30 rounded text-xs text-blue-300">
              {currentType < 6 ? '141型' : currentType < 9 ? '231型' : currentType < 10 ? '222型' : '33型'}
            </span>
            <span className="text-white/50 text-xs">{currentType + 1} / 11</span>
          </div>
          
          {/* 口诀 */}
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
            <p className="text-yellow-300 text-sm font-medium">📜 口诀</p>
            <p className="text-white text-sm mt-1">{currentNet.rhyme}</p>
          </div>
        </div>

        {/* 状态指示 */}
        <div className="absolute top-24 right-6 bg-black/40 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/20">
          <span className={`text-sm font-medium ${unfoldProgress > 0.5 ? 'text-cyan-400' : 'text-purple-400'}`}>
            {unfoldProgress > 0.5 ? '📋 展开中' : '🔷 折叠中'}
          </span>
        </div>

        {/* 找相对面口诀 */}
        <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-xl rounded-xl p-4 border border-white/20 max-w-[380px]">
          <h4 className="text-white font-bold text-sm mb-2">🔍 找相对面口诀</h4>
          <div className="text-white/70 text-xs space-y-1">
            <p>• 要找两个相对面，切记相隔一个面</p>
            <p>• 一四一，二三一，一在同侧任意移</p>
            <p>• 二二二阶梯路，两个三日相连</p>
            <p>• 相邻一层必有日，一线不过四，整体没有凹和田</p>
          </div>
        </div>
      </div>
    </div>
  );
}
