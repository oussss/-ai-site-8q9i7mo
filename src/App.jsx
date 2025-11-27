import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowDownRight, Terminal, Box, Hexagon, Zap, Menu, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- 3D Scene ---
function WireframeObject({ mouse }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Base rotation
    meshRef.current.rotation.x = time * 0.2;
    meshRef.current.rotation.y = time * 0.3;
    
    // Mouse interaction (lerping for smoothness)
    const targetX = (mouse.current.y * 0.5);
    const targetY = (mouse.current.x * 0.5);
    
    meshRef.current.rotation.x += (targetX - meshRef.current.rotation.x) * 0.1;
    meshRef.current.rotation.y += (targetY - meshRef.current.rotation.y) * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={2.2}>
        <torusKnotGeometry args={[1, 0.3, 128, 16]} />
        <meshBasicMaterial 
          color="#ccff00" 
          wireframe 
          transparent 
          opacity={0.8} 
        />
      </mesh>
    </Float>
  );
}

// --- Components ---

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const onMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    const onMouseOver = (e) => {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 border-2 border-[#ccff00] rounded-full pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
      animate={{
        x: mousePos.x - 16,
        y: mousePos.y - 16,
        scale: isHovering ? 2.5 : 1,
        rotate: isHovering ? 45 : 0,
        borderRadius: isHovering ? "0%" : "50%"
      }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {isHovering && <div className="w-2 h-2 bg-[#ccff00]" />}
    </motion.div>
  );
};

const GlitchTitle = ({ text, subtitle }) => {
  return (
    <div className="relative z-10 text-center">
      <h1 className="font-['Kalam'] font-bold text-6xl md:text-9xl text-white relative inline-block">
        <span className="absolute top-0 left-0 -ml-1 text-[#ccff00] opacity-70 animate-pulse pointer-events-none">{text}</span>
        <span className="absolute top-0 left-0 ml-1 text-red-500 opacity-70 animate-pulse delay-75 pointer-events-none">{text}</span>
        <span className="relative">{text}</span>
      </h1>
      <p className="font-['Itim'] text-xl md:text-3xl text-[#ccff00] mt-4 tracking-widest uppercase">
        {subtitle}
      </p>
    </div>
  );
};

const Marquee = () => {
  return (
    <div className="w-full bg-[#ccff00] text-black overflow-hidden py-3 rotate-1 border-y-4 border-black">
      <motion.div 
        className="flex whitespace-nowrap font-['Kalam'] font-bold text-2xl"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        {[...Array(10)].map((_, i) => (
          <span key={i} className="mx-8">
            WEB3 • NFT • DEFI • METAVERSE • SMART CONTRACTS • DAO •
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const HandDrawnCard = ({ title, desc, icon: Icon }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, rotate: -1 }}
      className="relative group"
    >
      {/* Sketchy Border Effect */}
      <div className="absolute inset-0 border-2 border-[#ccff00] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] translate-x-1 translate-y-1 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300" />
      <div className="relative bg-black border border-white/20 p-8 h-full rounded-[255px_15px_225px_15px/15px_225px_15px_255px] overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Icon size={64} className="text-[#ccff00]" />
        </div>
        <h3 className="font-['Kalam'] text-2xl font-bold text-white mb-4 group-hover:text-[#ccff00] transition-colors">
          {title}
        </h3>
        <p className="font-['Itim'] text-gray-300 text-lg">
          {desc}
        </p>
        <div className="mt-6 flex items-center text-[#ccff00] font-['Itim']">
          <span>Detayları Gör</span>
          <ArrowDownRight className="ml-2 w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
};

const Navbar = () => (
  <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference">
    <div className="font-['Kalam'] font-bold text-2xl text-[#ccff00] border-2 border-[#ccff00] px-3 py-1 rounded-[50%_10%_60%_20%/20%_60%_10%_50%]">
      W3.UAE
    </div>
    <button className="text-[#ccff00] hover:scale-110 transition-transform">
      <Menu size={32} />
    </button>
  </nav>
);

// --- Main App ---

export default function App() {
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    mouse.current = {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    };
  };

  return (
    <div 
      className="bg-[#050505] min-h-screen w-full overflow-x-hidden selection:bg-[#ccff00] selection:text-black"
      onMouseMove={handleMouseMove}
    >
      <CustomCursor />
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <Suspense fallback={null}>
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
              <WireframeObject mouse={mouse} />
              <ambientLight intensity={0.5} />
            </Suspense>
          </Canvas>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 p-4 flex flex-col items-center">
          <GlitchTitle text="WEB3 UAE" subtitle="Dijital Geleceği İnşa Ediyoruz" />
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-12"
          >
             <button className="group relative px-8 py-3 bg-transparent text-[#ccff00] font-['Kalam'] text-xl font-bold tracking-wider">
              <span className="absolute inset-0 border-2 border-[#ccff00] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] group-hover:bg-[#ccff00] transition-all duration-300"></span>
              <span className="relative group-hover:text-black transition-colors">PROJEYİ BAŞLAT</span>
            </button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#ccff00]"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowDownRight size={32} />
        </motion.div>
      </section>

      {/* MARQUEE */}
      <Marquee />

      {/* SERVICES SECTION */}
      <section className="relative py-24 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="font-['Kalam'] text-5xl md:text-7xl text-white mb-4">
              Hizmetlerimiz
              <span className="text-[#ccff00]">.</span>
            </h2>
            <div className="h-1 w-32 bg-[#ccff00] rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <HandDrawnCard 
              title="Smart Contracts"
              desc="Güvenli, denetlenmiş ve optimize edilmiş akıllı sözleşme geliştirme hizmetleri."
              icon={Terminal}
            />
            <HandDrawnCard 
              title="NFT Koleksiyonları"
              desc="Generative art, minting dApp'leri ve pazar yeri entegrasyonları."
              icon={Hexagon}
            />
            <HandDrawnCard 
              title="Metaverse Design"
              desc="Markanız için sürükleyici 3D dünyalar ve sanal deneyimler."
              icon={Box}
            />
          </div>
        </div>
      </section>

      {/* STATS SECTION (Cyberpunk Grid) */}
      <section className="py-20 border-y border-[#ccff00]/20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
           {[ 
             { label: "Tamamlanan Proje", val: "50+" },
             { label: "Toplam Hacim", val: "$10M+" },
             { label: "Mutlu Müşteri", val: "100%" },
             { label: "Ödüller", val: "12" }
           ].map((stat, i) => (
             <div key={i} className="flex flex-col items-center justify-center p-6 border border-[#ccff00]/30 hover:bg-[#ccff00]/10 transition-colors cursor-crosshair">
                <span className="font-['Kalam'] text-4xl md:text-5xl text-[#ccff00] font-bold">{stat.val}</span>
                <span className="font-['Itim'] text-white mt-2 text-lg">{stat.label}</span>
             </div>
           ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-24 px-6 md:px-20 relative overflow-hidden">
         {/* Background Elements */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-[#ccff00] blur-[100px] opacity-20 pointer-events-none" />

         <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-['Kalam'] text-5xl md:text-7xl text-white mb-8">
              Geleceği Birlikte <br/> Kodlayalım
            </h2>
            <p className="font-['Itim'] text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Bir sonraki büyük Web3 projeniz için bizimle iletişime geçin. 
              Kahve bizden, fikirler sizden.
            </p>
            
            <form className="max-w-md mx-auto space-y-6">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="E-posta Adresiniz"
                  className="w-full bg-transparent border-b-2 border-[#333] py-4 text-white font-['Itim'] text-xl focus:border-[#ccff00] focus:outline-none transition-colors"
                />
              </div>
              <button 
                type="button"
                className="w-full py-4 bg-[#ccff00] text-black font-['Kalam'] text-2xl font-bold hover:bg-white transition-colors rounded-[255px_15px_225px_15px/15px_225px_15px_255px]"
              >
                GÖNDER
              </button>
            </form>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t border-[#333] text-center font-['Itim'] text-gray-500">
        <p>© 2024 Web3 UAE. All rights reserved. Crafted in Cyberpunk Style.</p>
      </footer>
    </div>
  );
}
