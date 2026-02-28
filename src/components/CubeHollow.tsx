import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

type HollowType = 'none' | 'corner' | 'edge' | 'face';

interface CubeHollowProps {
  hollowType: HollowType;
  isExtracted: boolean;
  showCalculation: boolean;
}

// 原有面颜色
const ORIGINAL_FACE_COLOR = '#3B82F6';
// 新增面颜色（挖空后暴露的内部面）
const NEW_FACE_COLOR = '#EF4444';

function MainCube({ hollowType, isExtracted, showCalculation }: CubeHollowProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredFace, setHoveredFace] = useState<number | null>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  const cubeSize = 3;
  const smallCubeSize = 1;

  // 计算表面积变化
  const surfaceAreaInfo = useMemo(() => {
    const originalArea = 6 * cubeSize * cubeSize;
    
    switch (hollowType) {
      case 'corner':
        return {
          change: 0,
          newArea: originalArea,
          description: '顶点挖空：表面积不变',
          detail: '挖掉3个原有面，新增3个内部面，正好抵消',
          formula: `6 × ${cubeSize}² = ${originalArea}`,
          removedFaces: 3,
          addedFaces: 3,
        };
      case 'edge':
        const edgeAdd = 2 * smallCubeSize * smallCubeSize;
        return {
          change: edgeAdd,
          newArea: originalArea + edgeAdd,
          description: '棱上挖空：表面积增加',
          detail: '挖掉2个原有面，新增4个内部面，净增2个面',
          formula: `6 × ${cubeSize}² + 2 × ${smallCubeSize}² = ${originalArea + edgeAdd}`,
          removedFaces: 2,
          addedFaces: 4,
        };
      case 'face':
        const faceAdd = 4 * smallCubeSize * smallCubeSize;
        return {
          change: faceAdd,
          newArea: originalArea + faceAdd,
          description: '面心挖空：表面积增加最多',
          detail: '挖掉1个原有面，新增5个内部面，净增4个面',
          formula: `6 × ${cubeSize}² + 4 × ${smallCubeSize}² = ${originalArea + faceAdd}`,
          removedFaces: 1,
          addedFaces: 5,
        };
      default:
        return {
          change: 0,
          newArea: originalArea,
          description: '原始正方体',
          detail: '6个面，每个面都是正方形',
          formula: `6 × ${cubeSize}² = ${originalArea}`,
          removedFaces: 0,
          addedFaces: 0,
        };
    }
  }, [hollowType]);

  // 主立方体的面
  const faces = [
    { pos: [0, 0, cubeSize/2] as [number, number, number], rot: [0, 0, 0] as [number, number, number], label: '前' },
    { pos: [0, 0, -cubeSize/2] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number], label: '后' },
    { pos: [cubeSize/2, 0, 0] as [number, number, number], rot: [0, Math.PI/2, 0] as [number, number, number], label: '右' },
    { pos: [-cubeSize/2, 0, 0] as [number, number, number], rot: [0, -Math.PI/2, 0] as [number, number, number], label: '左' },
    { pos: [0, cubeSize/2, 0] as [number, number, number], rot: [-Math.PI/2, 0, 0] as [number, number, number], label: '上' },
    { pos: [0, -cubeSize/2, 0] as [number, number, number], rot: [Math.PI/2, 0, 0] as [number, number, number], label: '下' },
  ];

  // 小立方体在大正方体中的位置
  const getSmallCubePosition = () => {
    switch (hollowType) {
      case 'corner':
        return [cubeSize/2 - smallCubeSize/2, cubeSize/2 - smallCubeSize/2, cubeSize/2 - smallCubeSize/2] as [number, number, number];
      case 'edge':
        return [0, cubeSize/2 - smallCubeSize/2, cubeSize/2 - smallCubeSize/2] as [number, number, number];
      case 'face':
        return [0, 0, cubeSize/2 + smallCubeSize/2] as [number, number, number];
      default:
        return [0, 0, 0] as [number, number, number];
    }
  };

  // 小立方体的6个面（在大正方体内部，用红色表示新增面）
  const smallCubeFaces = hollowType !== 'none' ? [
    { pos: [0, 0, smallCubeSize/2] as [number, number, number], rot: [0, 0, 0] as [number, number, number], label: '内前', isNew: true },
    { pos: [0, 0, -smallCubeSize/2] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number], label: '内后', isNew: true },
    { pos: [smallCubeSize/2, 0, 0] as [number, number, number], rot: [0, Math.PI/2, 0] as [number, number, number], label: '内右', isNew: true },
    { pos: [-smallCubeSize/2, 0, 0] as [number, number, number], rot: [0, -Math.PI/2, 0] as [number, number, number], label: '内左', isNew: true },
    { pos: [0, smallCubeSize/2, 0] as [number, number, number], rot: [-Math.PI/2, 0, 0] as [number, number, number], label: '内上', isNew: true },
    { pos: [0, -smallCubeSize/2, 0] as [number, number, number], rot: [Math.PI/2, 0, 0] as [number, number, number], label: '内下', isNew: true },
  ] : [];

  // 根据挖空类型，确定哪些小立方体面是可见的（新增的）
  const getVisibleSmallFaces = () => {
    switch (hollowType) {
      case 'corner':
        return [0, 2, 4]; // 内前、内右、内上
      case 'edge':
        return [0, 2, 4, 5]; // 内前、内右、内上、内下
      case 'face':
        return [0, 2, 3, 4, 5]; // 内前、内右、内左、内上、内下
      default:
        return [];
    }
  };

  const visibleSmallFaceIndices = getVisibleSmallFaces();

  // 被提出的小立方体位置（偏移量）
  const extractedOffset = isExtracted ? [2.5, 1.5, 2] : [0, 0, 0];
  const smallCubePos = getSmallCubePosition();

  // 根据挖空类型，确定被挖掉的小立方体上哪些是原有面（与大正方体接触的面）
  // 顶点挖空：3个原有面（前、右、上）
  // 棱上挖空：2个原有面（前、上）
  // 面心挖空：1个原有面（前）
  const getOriginalFaceIndices = () => {
    switch (hollowType) {
      case 'corner':
        return [0, 2, 4]; // 前、右、上
      case 'edge':
        return [0, 4]; // 前、上
      case 'face':
        return [0]; // 前
      default:
        return [];
    }
  };

  const originalFaceIndices = getOriginalFaceIndices();

  return (
    <group ref={groupRef}>
      {/* 主立方体 */}
      <group>
        {faces.map((face, index) => (
          <group key={index} position={face.pos} rotation={face.rot}>
            <mesh
              onPointerOver={() => setHoveredFace(index)}
              onPointerOut={() => setHoveredFace(null)}
            >
              <planeGeometry args={[cubeSize, cubeSize]} />
              <meshStandardMaterial 
                color={ORIGINAL_FACE_COLOR}
                side={THREE.DoubleSide}
                transparent
                opacity={hoveredFace === index ? 0.9 : 0.7}
                metalness={0.3}
                roughness={0.4}
              />
            </mesh>
            <gridHelper args={[cubeSize, 3, 'white', 'rgba(255,255,255,0.3)']} position={[0, 0, 0.01]} />
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(cubeSize, cubeSize)]} />
              <lineBasicMaterial color="white" linewidth={2} />
            </lineSegments>
            <Text
              position={[0, 0, 0.02]}
              fontSize={0.4}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {face.label}
            </Text>
          </group>
        ))}
      </group>

      {/* 挖空处显示的新增面（红色） */}
      {hollowType !== 'none' && (
        <group position={smallCubePos}>
          {smallCubeFaces.map((face, index) => {
            const isVisible = visibleSmallFaceIndices.includes(index);
            if (!isVisible) return null;
            
            return (
              <group key={index} position={face.pos} rotation={face.rot}>
                <mesh>
                  <planeGeometry args={[smallCubeSize, smallCubeSize]} />
                  <meshStandardMaterial 
                    color={NEW_FACE_COLOR}
                    side={THREE.DoubleSide}
                    transparent
                    opacity={0.95}
                    emissive={NEW_FACE_COLOR}
                    emissiveIntensity={0.2}
                  />
                </mesh>
                <lineSegments>
                  <edgesGeometry args={[new THREE.PlaneGeometry(smallCubeSize, smallCubeSize)]} />
                  <lineBasicMaterial color="white" linewidth={2} />
                </lineSegments>
                <Text
                  position={[0, 0, 0.02]}
                  fontSize={0.2}
                  color="white"
                  anchorX="center"
                  anchorY="middle"
                >
                  新增
                </Text>
              </group>
            );
          })}
          
          <Text
            position={[0, 0, smallCubeSize/2 + 0.15]}
            fontSize={0.25}
            color="#EF4444"
            anchorX="center"
            anchorY="middle"
          >
            挖空处
          </Text>
        </group>
      )}

      {/* 被提出的小立方体 - 用不同颜色标注原有面和新增面 */}
      {hollowType !== 'none' && (
        <group 
          position={[
            smallCubePos[0] + extractedOffset[0],
            smallCubePos[1] + extractedOffset[1],
            smallCubePos[2] + extractedOffset[2]
          ]}
        >
          {/* 小立方体的6个面 - 用颜色区分原有面和新增面 */}
          {[
            { pos: [0, 0, smallCubeSize/2] as [number, number, number], rot: [0, 0, 0] as [number, number, number], label: '前' },
            { pos: [0, 0, -smallCubeSize/2] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number], label: '后' },
            { pos: [smallCubeSize/2, 0, 0] as [number, number, number], rot: [0, Math.PI/2, 0] as [number, number, number], label: '右' },
            { pos: [-smallCubeSize/2, 0, 0] as [number, number, number], rot: [0, -Math.PI/2, 0] as [number, number, number], label: '左' },
            { pos: [0, smallCubeSize/2, 0] as [number, number, number], rot: [-Math.PI/2, 0, 0] as [number, number, number], label: '上' },
            { pos: [0, -smallCubeSize/2, 0] as [number, number, number], rot: [Math.PI/2, 0, 0] as [number, number, number], label: '下' },
          ].map((face, index) => {
            // 判断这个面是原有面还是新增面
            const isOriginal = originalFaceIndices.includes(index);
            const faceColor = isOriginal ? ORIGINAL_FACE_COLOR : NEW_FACE_COLOR;
            
            return (
              <group key={index} position={face.pos} rotation={face.rot}>
                <mesh>
                  <planeGeometry args={[smallCubeSize, smallCubeSize]} />
                  <meshStandardMaterial 
                    color={faceColor}
                    side={THREE.DoubleSide}
                    transparent
                    opacity={0.9}
                    emissive={faceColor}
                    emissiveIntensity={0.1}
                  />
                </mesh>
                <lineSegments>
                  <edgesGeometry args={[new THREE.PlaneGeometry(smallCubeSize, smallCubeSize)]} />
                  <lineBasicMaterial color="white" linewidth={1} />
                </lineSegments>
                <Text
                  position={[0, 0, 0.02]}
                  fontSize={0.15}
                  color="white"
                  anchorX="center"
                  anchorY="middle"
                >
                  {isOriginal ? '原有' : '新增'}
                </Text>
              </group>
            );
          })}
          
          {/* 小立方体标签 */}
          <Text
            position={[0, smallCubeSize/2 + 0.4, 0]}
            fontSize={0.25}
            color="#FBBF24"
            anchorX="center"
            anchorY="middle"
          >
            挖掉的小正方体
          </Text>
        </group>
      )}

      {/* 尺寸标注 */}
      {showCalculation && (
        <Html position={[0, -cubeSize - 1.5, 0]} center>
          <div className="bg-black/80 backdrop-blur-md rounded-xl p-4 border border-white/20 text-white min-w-[300px]">
            <h4 className="font-bold text-lg mb-2 text-cyan-400">{surfaceAreaInfo.description}</h4>
            <p className="text-sm text-white/80 mb-2">{surfaceAreaInfo.detail}</p>
            
            {hollowType !== 'none' && (
              <div className="flex gap-4 mb-3 text-sm">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: ORIGINAL_FACE_COLOR }}></span>
                  <span className="text-white/60">原有面</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: NEW_FACE_COLOR }}></span>
                  <span className="text-white/60">新增面</span>
                </div>
              </div>
            )}
            
            <div className="bg-white/10 rounded-lg p-2 font-mono text-sm">
              {surfaceAreaInfo.formula}
            </div>
            
            {hollowType !== 'none' && (
              <div className="mt-2 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-white/60">挖掉的面:</span>
                  <span className="text-red-400">-{surfaceAreaInfo.removedFaces}个</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">新增的面:</span>
                  <span className="text-green-400">+{surfaceAreaInfo.addedFaces}个</span>
                </div>
                <div className="flex justify-between border-t border-white/20 pt-1 mt-1">
                  <span className="text-white/80">表面积变化:</span>
                  <span className={surfaceAreaInfo.change === 0 ? 'text-yellow-400' : 'text-green-400'}>
                    {surfaceAreaInfo.change === 0 ? '不变' : `+${surfaceAreaInfo.change}`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

function Scene({ hollowType, isExtracted, showCalculation }: CubeHollowProps) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#3B82F6" />
      <pointLight position={[5, 5, -5]} intensity={0.5} color="#EC4899" />
      <MainCube hollowType={hollowType} isExtracted={isExtracted} showCalculation={showCalculation} />
      <OrbitControls 
        enablePan={false} 
        enableZoom={true}
        minDistance={5}
        maxDistance={20}
      />
    </>
  );
}

export default function CubeHollow() {
  const [hollowType, setHollowType] = useState<HollowType>('none');
  const [isExtracted, setIsExtracted] = useState(false);
  const [showCalculation, setShowCalculation] = useState(true);

  const hollowTypes: { type: HollowType; label: string; desc: string; color: string }[] = [
    { type: 'none', label: '原始正方体', desc: '6个面，表面积=54', color: 'from-blue-500 to-cyan-500' },
    { type: 'corner', label: '顶点挖空', desc: '表面积不变=54', color: 'from-green-500 to-emerald-500' },
    { type: 'edge', label: '棱上挖空', desc: '表面积+2=56', color: 'from-yellow-500 to-orange-500' },
    { type: 'face', label: '面心挖空', desc: '表面积+4=58', color: 'from-purple-500 to-pink-500' },
  ];

  const handleTypeChange = (type: HollowType) => {
    setHollowType(type);
    setIsExtracted(false);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 relative">
        <Canvas camera={{ position: [8, 6, 8], fov: 45 }}>
          <Scene hollowType={hollowType} isExtracted={isExtracted} showCalculation={showCalculation} />
        </Canvas>
        
        {/* 挖空类型选择 */}
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-2 max-w-[90%]">
          {hollowTypes.map((item) => (
            <button
              key={item.type}
              onClick={() => handleTypeChange(item.type)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
                hollowType === item.type 
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg scale-105` 
                  : 'bg-white/10 text-white/70 hover:bg-white/20 backdrop-blur-sm'
              }`}
            >
              <div>{item.label}</div>
              <div className="text-xs font-normal opacity-80">{item.desc}</div>
            </button>
          ))}
        </div>

        {/* 提取小正方体按钮 */}
        {hollowType !== 'none' && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <button
              onClick={() => setIsExtracted(!isExtracted)}
              className={`px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl ${
                isExtracted 
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-red-500/40 ring-2 ring-white/30' 
                  : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-amber-500/40 hover:scale-105'
              }`}
            >
              {isExtracted ? '🔽 放回小正方体' : '🔼 提出小正方体'}
            </button>
          </div>
        )}

        {/* 计算显示开关 */}
        <div className="absolute top-6 right-6">
          <button
            onClick={() => setShowCalculation(!showCalculation)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
              showCalculation 
                ? 'bg-green-500/80 text-white shadow-lg shadow-green-500/30' 
                : 'bg-white/10 text-white/70 hover:bg-white/20 backdrop-blur-sm'
            }`}
          >
            {showCalculation ? '隐藏计算' : '显示计算'}
          </button>
        </div>

        {/* 图例说明 */}
        {hollowType !== 'none' && (
          <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/20">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded" style={{ backgroundColor: ORIGINAL_FACE_COLOR }}></span>
                <span className="text-white/70">原有面（蓝色）</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded" style={{ backgroundColor: NEW_FACE_COLOR }}></span>
                <span className="text-white/70">新增面（红色）</span>
              </div>
            </div>
          </div>
        )}

        {/* 提示文字 */}
        <div className="absolute bottom-40 left-6 bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 max-w-[250px]">
          <h3 className="text-white font-bold text-lg mb-2">正方体挖空问题</h3>
          <p className="text-white/70 text-sm">
            1. 选择挖空类型<br/>
            2. 点击"提出小正方体"查看内部<br/>
            3. 观察新增的红色面
          </p>
        </div>
      </div>
    </div>
  );
}
