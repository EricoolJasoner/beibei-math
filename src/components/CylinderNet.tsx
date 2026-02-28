import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface CylinderNetProps {
  unfoldProgress: number;
}

function CylinderNet3D({ unfoldProgress }: CylinderNetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const sideRef = useRef<THREE.Group>(null);
  const topRef = useRef<THREE.Group>(null);
  const bottomRef = useRef<THREE.Group>(null);

  const radius = 1.2;
  const height = 2.5;
  const unfoldedWidth = 2 * Math.PI * radius;

  useEffect(() => {
    if (sideRef.current && topRef.current && bottomRef.current) {
      const progress = unfoldProgress;

      // 侧面：从圆柱形变成长方形
      gsap.to(sideRef.current.scale, {
        x: 1 - progress * 0.98,
        duration: 0.3,
        ease: 'power2.out'
      });

      // 上底面：从圆柱顶部移动到展开位置
      // 折叠位置: y = height/2 (贴合圆柱顶部)
      const topFoldedY = height / 2;
      const topUnfoldedY = height / 2 + radius + 0.8;
      const topY = topFoldedY + progress * (topUnfoldedY - topFoldedY);
      gsap.to(topRef.current.position, {
        y: topY,
        duration: 0.3,
        ease: 'power2.out'
      });

      // 下底面
      const bottomFoldedY = -height / 2;
      const bottomUnfoldedY = -height / 2 - radius - 0.8;
      const bottomY = bottomFoldedY + progress * (bottomUnfoldedY - bottomFoldedY);
      gsap.to(bottomRef.current.position, {
        y: bottomY,
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

  return (
    <group ref={groupRef}>
      {/* 侧面 - 使用圆柱几何体 */}
      <group ref={sideRef}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[radius, radius, height, 64, 1, true]} />
          <meshStandardMaterial 
            color="#3B82F6" 
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
            metalness={0.2}
            roughness={0.3}
          />
        </mesh>
        {/* 展开时的长方形示意 */}
        <mesh position={[0, 0, radius + 0.5]} visible={unfoldProgress > 0.5}>
          <boxGeometry args={[unfoldedWidth, height, 0.05]} />
          <meshStandardMaterial 
            color="#60A5FA" 
            transparent
            opacity={0.5 * unfoldProgress}
          />
        </mesh>
      </group>

      {/* 上底面 - 圆形，水平放置 */}
      <group ref={topRef} position={[0, height / 2, 0]}>
        <mesh castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[radius, 64]} />
          <meshStandardMaterial
            color="#10B981"
            transparent
            opacity={0.9}
            metalness={0.2}
            roughness={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* 圆形边框 */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[radius - 0.03, radius, 64]} />
          <meshBasicMaterial color="white" side={THREE.DoubleSide} />
        </mesh>
        <Text
          position={[0, 0.05, 0]}
          fontSize={0.35}
          color="white"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          rotation={[-Math.PI / 2, 0, 0]}
        >
          上底
        </Text>
      </group>

      {/* 下底面 - 圆形，水平放置 */}
      <group ref={bottomRef} position={[0, -height / 2, 0]}>
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
          下底
        </Text>
      </group>
    </group>
  );
}

function Scene({ unfoldProgress }: CylinderNetProps) {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[10, 10, 10]} intensity={1.2} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#3B82F6" />
      <pointLight position={[-5, -5, 5]} intensity={0.6} color="#10B981" />
      <CylinderNet3D unfoldProgress={unfoldProgress} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={5} maxDistance={25} target={[0, 0, 0]} />
    </>
  );
}

export default function CylinderNet() {
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
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-75"
            style={{ width: `${unfoldProgress * 100}%` }}
          />
        </div>

        <div className="absolute top-16 left-6 bg-black/50 backdrop-blur-xl rounded-2xl p-5 border border-white/20 max-w-[280px]">
          <h3 className="text-white font-bold text-xl mb-2 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            圆柱体展开图
          </h3>
          <div className="space-y-2 text-sm text-white/70">
            <p>📐 <span className="text-cyan-400">侧面</span>：展开为长方形</p>
            <p>🔵 <span className="text-green-400">底面</span>：两个相同的圆</p>
            <div className="bg-white/10 rounded-lg p-2 mt-3 font-mono text-xs">
              <p>侧面积 = 2πr × h</p>
              <p>表面积 = 侧面积 + 2×底面积</p>
            </div>
          </div>
        </div>

        <div className="absolute top-16 right-6 bg-black/40 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/20">
          <span className={`text-sm font-medium ${unfoldProgress > 0.5 ? 'text-cyan-400' : 'text-purple-400'}`}>
            {unfoldProgress > 0.5 ? '📋 展开中' : '🔷 折叠中'}
          </span>
        </div>
      </div>
    </div>
  );
}
