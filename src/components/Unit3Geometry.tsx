import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CubeNetAll from './CubeNetAll';
import CylinderNet from './CylinderNet';
import ConeNet from './ConeNet';
import { Box, Circle, Triangle } from 'lucide-react';

type ShapeType = 'cube' | 'cylinder' | 'cone';

const shapes = [
  { id: 'cube' as ShapeType, label: '正方体', icon: Box, desc: '11种展开方式', color: 'from-blue-500 to-cyan-500' },
  { id: 'cylinder' as ShapeType, label: '圆柱体', icon: Circle, desc: '长方形+圆形', color: 'from-green-500 to-emerald-500' },
  { id: 'cone' as ShapeType, label: '圆锥体', icon: Triangle, desc: '扇形+圆形', color: 'from-purple-500 to-pink-500' },
];

export default function Unit3Geometry() {
  const [activeShape, setActiveShape] = useState<ShapeType>('cube');

  return (
    <div className="w-full h-full flex flex-col">
      {/* 形状选择器 */}
      <div className="px-6 py-4 border-b border-white/10 backdrop-blur-md bg-black/20">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-sm mr-2">选择立体图形:</span>
            {shapes.map((shape) => {
              const Icon = shape.icon;
              return (
                <button
                  key={shape.id}
                  onClick={() => setActiveShape(shape.id)}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                    activeShape === shape.id
                      ? `bg-gradient-to-r ${shape.color} text-white shadow-lg scale-105`
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{shape.label}</span>
                </button>
              );
            })}
          </div>
          
          <div className="hidden md:block text-white/40 text-sm">
            第三单元 · 长方体与正方体
          </div>
        </div>
      </div>

      {/* 3D展示区域 */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeShape === 'cube' && (
            <motion.div
              key="cube"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <CubeNetAll />
            </motion.div>
          )}
          
          {activeShape === 'cylinder' && (
            <motion.div
              key="cylinder"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <CylinderNet />
            </motion.div>
          )}
          
          {activeShape === 'cone' && (
            <motion.div
              key="cone"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <ConeNet />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部说明 */}
      <div className="px-6 py-3 border-t border-white/10 backdrop-blur-md bg-black/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm text-white/60">
            {activeShape === 'cube' && (
              <>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  141型: 6种
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  231型: 3种
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  222型: 1种
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  33型: 1种
                </span>
              </>
            )}
            {activeShape === 'cylinder' && (
              <>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  侧面展开 = 长方形
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  底面 = 圆形
                </span>
              </>
            )}
            {activeShape === 'cone' && (
              <>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  侧面展开 = 扇形
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  底面 = 圆形
                </span>
              </>
            )}
          </div>
          
          <div className="text-white/40 text-xs">
            点击上方按钮切换不同立体图形
          </div>
        </div>
      </div>
    </div>
  );
}
