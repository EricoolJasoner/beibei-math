import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CubeHollow from './components/CubeHollow';
import Unit3Geometry from './components/Unit3Geometry';
import LoginPage from './components/LoginPage';
import { Box, Square, Layers, Calculator, BookOpen, Sparkles, ChevronRight, Star, Lightbulb } from 'lucide-react';
import { gsap } from 'gsap';

type TabType = 'unit3' | 'net' | 'hollow' | 'learn';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('unit3');
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current && isLoggedIn) {
      gsap.fromTo(headerRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const tabs = [
    { id: 'unit3' as TabType, label: '第三单元', icon: Layers, desc: '正方体/圆柱/圆锥' },
    { id: 'hollow' as TabType, label: '挖空问题', icon: Square, desc: '表面积变化规律' },
    { id: 'learn' as TabType, label: '知识要点', icon: BookOpen, desc: '核心概念总结' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* 渐变光晕 */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px]" />
        
        {/* 网格背景 */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* 浮动粒子 */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* 主内容 */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <header ref={headerRef} className="px-6 py-4 border-b border-white/10 backdrop-blur-md bg-black/20">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  北北数学模型模拟器
                </h1>
                <p className="text-xs text-white/50">人教版五年级下学期 · 立体几何</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </header>

        {/* 移动端导航 */}
        <div className="md:hidden px-4 py-2 border-b border-white/10 backdrop-blur-md bg-black/20">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-white/10 text-white/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 主内容区 */}
        <main className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'unit3' && (
              <motion.div
                key="unit3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Unit3Geometry />
              </motion.div>
            )}
            
            {activeTab === 'hollow' && (
              <motion.div
                key="hollow"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <CubeHollow />
              </motion.div>
            )}
            
            {activeTab === 'learn' && (
              <motion.div
                key="learn"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 overflow-y-auto p-6"
              >
                <LearnContent />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-white/10 backdrop-blur-md bg-black/20">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-white/40">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span>拖动旋转 · 滚轮缩放 · 点击交互</span>
            </div>
            <div>北北数学模型模拟器 v1.0</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function LearnContent() {
  const sections = [
    {
      title: '正方体展开图',
      icon: Box,
      color: 'from-blue-500 to-cyan-500',
      points: [
        '正方体展开图有11种不同的形式',
        '141型（6种）：中间4个，上下各1个',
        '231型（3种）：中间3个，上面2个下面1个',
        '222型（1种）：阶梯状排列',
        '33型（1种）：两行各3个',
        '相对的面在展开图中不相邻',
      ],
    },
    {
      title: '圆柱体展开图',
      icon: Layers,
      color: 'from-green-500 to-emerald-500',
      points: [
        '圆柱侧面展开为长方形',
        '长方形的长 = 底面周长 = 2πr',
        '长方形的宽 = 圆柱的高 = h',
        '两个底面是相同的圆形',
        '表面积 = 侧面积 + 2×底面积',
      ],
    },
    {
      title: '圆锥体展开图',
      icon: Star,
      color: 'from-purple-500 to-pink-500',
      points: [
        '圆锥侧面展开为扇形',
        '扇形的半径 = 母线长 = l',
        '扇形的弧长 = 底面周长 = 2πr',
        '扇形角度 = (r/l) × 360°',
        '底面是一个圆形',
      ],
    },
    {
      title: '挖空问题规律',
      icon: Square,
      color: 'from-orange-500 to-red-500',
      points: [
        '顶点挖空：表面积不变（挖3个面，增3个面）',
        '棱上挖空：表面积+2（挖2个面，增4个面）',
        '面心挖空：表面积+4（挖1个面，增5个面）',
        '体积总是减少一个小正方体的体积',
        '关键是数清楚挖掉和新增的面数',
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          知识要点总结
        </h2>
        <p className="text-white/60">人教版五年级下学期数学 · 第三单元</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">{section.title}</h3>
              </div>
              
              <ul className="space-y-2">
                {section.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                    <ChevronRight className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      {/* 公式卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-2xl p-6 border border-white/10"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          核心公式
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-black/30 rounded-xl p-4">
            <h4 className="text-cyan-400 font-bold mb-2">正方体</h4>
            <p className="text-white/80 font-mono text-sm">S = 6a²</p>
            <p className="text-white/80 font-mono text-sm">V = a³</p>
          </div>
          <div className="bg-black/30 rounded-xl p-4">
            <h4 className="text-green-400 font-bold mb-2">圆柱体</h4>
            <p className="text-white/80 font-mono text-sm">S侧 = 2πrh</p>
            <p className="text-white/80 font-mono text-sm">V = πr²h</p>
          </div>
          <div className="bg-black/30 rounded-xl p-4">
            <h4 className="text-purple-400 font-bold mb-2">圆锥体</h4>
            <p className="text-white/80 font-mono text-sm">S侧 = πrl</p>
            <p className="text-white/80 font-mono text-sm">V = ⅓πr²h</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
