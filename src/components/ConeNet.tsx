import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface ConeNetProps {
  unfoldProgress: number;
}

// 创建扇形几何体
function createSectorGeometry(radius: number, angle: number, segments: number = 32) {
  const geometry = new THREE.BufferGeometry();
  const vertices = [0, 0, 0];
  const indices = [];
  
  const angleStep = angle / segments;
  const startAngle = -angle / 2;
  
  for (let i = 0; i <= segments; i++) {
    const theta = startAngle + i * angleStep;
    vertices.push(
      Math.cos(theta) * radius,
      Math.sin(theta) * radius,
      0
    );
  }
  
  for (let i = 0; i < segments; i++) {
    indices.push(0, i + 1, i + 2);
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  
  return geometry;
}

function ConeNet3D({ unfoldProgress }: ConeNetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const sideRef = useRef<THREE.Group>(null);
  const baseRef = useRef<THREE.Group>(null);

  const radius = 1.2;
  const height = 3;
  const slantHeight = Math.sqrt(radius * radius + height * height);
  const sectorAngle = Math.PI * 1.3;

  useEffect(() => {
    if (sideRef.current && baseRef.current) {
      const progress = unfoldProgress;

      // 侧面扇形展开动画
      gsap.to(sideRef.current.scale, {
        x: 1 - progress * 0.98,
        y: 1 - progress * 0.98,
        duration: 0.3,
        ease: 'power2.out'
      });

      // 底面位置：从圆锥底部移动到展开位置
      // 折叠位置: y = -height/2 (贴合圆锥底部)
      const baseFoldedY = -height / 2;
      const baseUnfoldedY = -height / 2 - radius - 1.0;
      const baseY = baseFoldedY + progress * (baseUnfoldedY - baseFoldedY);
      gsap.to(baseRef.current.position, {
        y: baseY,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [unfoldProgress, height, radius]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.03;
    }
  });

  const sectorGeometry = useRef(createSectorGeometry(slantHeight, sectorAngle, 32));

  return (
    <group ref={groupRef}>
      {/* 侧面 - 使用圆锥几何体 */}
      <group ref={sideRef}>
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <coneGeometry args={[radius, height, 32, 1, true]} />
          <meshStandardMaterial 
            color="#8B5CF6" 
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
            metalness={0.2}
            roughness={0.3}
          />
        </mesh>
        {/* 展开时的扇形示意 */}
        <mesh 
          position={[0, 0, radius + 0.8]} 
          visible={unfoldProgress > 0.3}
          rotation={[0, 0, Math.PI/2]}
        >
          <mesh geometry={sectorGeometry.current}>
            <meshStandardMaterial 
              color="#A78BFA" 
              transparent
              opacity={0.5 * unfoldProgress}
              side={THREE.DoubleSide}
            />
          </mesh>
        </mesh>
      </group>

      {/* 底面 - 圆形，水平放置 */}
      <group ref={baseRef} position={[0, -height / 2, 0]}>
        <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[radius, 64]} />
          <meshStandardMaterial
            color="#F59E0B"
            transparent
            opacity={0.9}
            metalness={0.2}
            roughness={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* 圆形边框 */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <ringGeometry args={[radius - 0.03, radius, 64]} />
          <meshBasicMaterial color="white" side={THREE.DoubleSide} />
        </mesh>
        <Text
          position={[0, -0.05, 0]}
          fontSize={0.35}
          color="white"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          rotation={[Math.PI / 2, 0, 0]}
        >
          底面
        </Text>
      </group>
    </group>
  );
}

function Scene({ unfoldProgress }: ConeNetProps) {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[10, 10, 10]} intensity={1.2} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#8B5CF6" />
      <pointLight position={[-5, -5, 5]} intensity={0.6} color="#F59E0B" />
      <ConeNet3D unfoldProgress={unfoldProgress} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={5} maxDistance={25} target={[0, 0, 0]} />
    </>
  );
}

export default function ConeNet() {
  const [unfoldProgress, setUnfoldProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const startProgress = useRef(0);

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
          <Scene unfoldProgress={unfoldProgress} />
        </Canvas>
        
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
          <span className="text-white/80 text-sm">👆 上下拖拽展开/折叠</span>
        </div>

        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-64 h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-75"
            style={{ width: `${unfoldProgress * 100}%` }}
          />
        </div>

        <div className="absolute top-16 left-6 bg-black/50 backdrop-blur-xl rounded-2xl p-5 border border-white/20 max-w-[280px]">
          <h3 className="text-white font-bold text-xl mb-2 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
            圆锥体展开图
          </h3>
          <div className="space-y-2 text-sm text-white/70">
            <p>📐 <span className="text-purple-400">侧面</span>：展开为扇形</p>
            <p>🔵 <span className="text-yellow-400">底面</span>：一个圆形</p>
            <div className="bg-white/10 rounded-lg p-2 mt-3 font-mono text-xs space-y-1">
              <p>侧面积 = πrl</p>
              <p>表面积 = πrl + πr²</p>
              <p>扇形角度 = (r/l) × 360°</p>
            </div>
          </div>
        </div>

        <div className="absolute top-16 right-6 bg-black/40 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/20">
          <span className={`text-sm font-medium ${unfoldProgress > 0.5 ? 'text-purple-400' : 'text-pink-400'}`}>
            {unfoldProgress > 0.5 ? '📋 展开中' : '🔺 折叠中'}
          </span>
        </div>
      </div>
    </div>
  );
}
