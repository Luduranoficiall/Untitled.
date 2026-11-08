import React, { useEffect, useState } from 'react';

export type CriticalType = 'holy' | 'dark';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  rotation: number;
  shape: 'spark' | 'star' | 'circle';
}

interface CriticalBurstFXProps {
  type: CriticalType;
  targetRect?: { x: number; y: number } | null;
  onComplete?: () => void;
}

export const CriticalBurstFX: React.FC<CriticalBurstFXProps> = ({
  type,
  onComplete,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Gerar 26 partículas físicas com trajetórias em arco
    const isHoly = type === 'holy';
    const newParticles: Particle[] = [];

    const holyColors = ['#ffffff', '#fef08a', '#facc15', '#fbbf24', '#f59e0b', '#d97706'];
    const darkColors = ['#ef4444', '#dc2626', '#b91c1c', '#7f1d1d', '#991b1b', '#450a0a'];

    const colors = isHoly ? holyColors : darkColors;

    for (let i = 0; i < 28; i++) {
      const angle = (Math.PI * 2 * i) / 28 + (Math.random() * 0.3 - 0.15);
      const speed = Math.random() * 140 + 70; // pixels de dispersão

      newParticles.push({
        id: i,
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * (isHoly ? 7 : 8) + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
        rotation: Math.random() * 360,
        shape: isHoly ? (i % 2 === 0 ? 'star' : 'spark') : (i % 2 === 0 ? 'spark' : 'circle'),
      });
    }

    setParticles(newParticles);

    const timer = setTimeout(() => {
      onComplete?.();
    }, 1000);

    return () => clearTimeout(timer);
  }, [type, onComplete]);

  const isHoly = type === 'holy';

  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden flex items-center justify-center">
      {/* 1. Flash de Tela Carmesim se for golpe do Monstro */}
      {!isHoly && (
        <div className="absolute inset-0 bg-red-700/30 animate-crimson-flash" />
      )}

      {/* 2. Feixe de Luz Sagrada Vertical se for o Herói */}
      {isHoly && (
        <div className="absolute top-0 bottom-0 w-36 sm:w-48 bg-gradient-to-b from-white/95 via-amber-300/80 to-transparent blur-md animate-holy-beam" />
      )}
      {isHoly && (
        <div className="absolute top-0 bottom-0 w-12 bg-white animate-holy-beam blur-sm" />
      )}

      {/* 3. Onda de Choque Circular */}
      <div
        className={`w-40 h-40 rounded-full border-4 animate-shockwave ${
          isHoly
            ? 'border-amber-300 shadow-[0_0_40px_rgba(251,191,36,0.8)]'
            : 'border-red-600 shadow-[0_0_40px_rgba(220,38,38,0.8)]'
        }`}
      />

      {/* 4. Estrela de Impacto Central */}
      <div
        className={`relative z-10 font-cinzel text-center px-4 py-1.5 rounded-full border backdrop-blur-md shadow-2xl animate-bounce ${
          isHoly
            ? 'bg-[#18140f]/90 border-amber-400 text-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.6)]'
            : 'bg-[#1a0a0a]/90 border-red-600 text-red-300 shadow-[0_0_30px_rgba(220,38,38,0.6)]'
        }`}
      >
        <span className="text-xs sm:text-sm font-black tracking-widest uppercase flex items-center gap-1.5">
          {isHoly ? (
            <>
              <span className="text-yellow-300 text-base">✦</span>
              <span>GOLPE CRÍTICO SAGRADO!</span>
              <span className="text-yellow-300 text-base">✦</span>
            </>
          ) : (
            <>
              <span>🩸</span>
              <span>IMPACTO DILACERANTE!</span>
              <span>🩸</span>
            </>
          )}
        </span>
      </div>

      {/* 5. Partículas Físicas em Dispersão Radial */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute transition-all duration-700 ease-out"
            style={{
              transform: `translate(${p.vx}px, ${p.vy}px) rotate(${p.rotation + p.vx}deg)`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              boxShadow: `0 0 10px ${p.color}`,
              borderRadius: p.shape === 'circle' ? '50%' : '1px',
              opacity: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
};
