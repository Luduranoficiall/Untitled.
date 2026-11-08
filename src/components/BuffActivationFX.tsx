import React, { useEffect, useState } from 'react';

export type BuffFXType = 'strength' | 'agility' | 'armor' | 'custom';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  shape: 'spark' | 'star' | 'circle' | 'diamond' | 'streak';
  delay: number;
}

interface BuffActivationFXProps {
  type: BuffFXType;
  buffName?: string;
  onComplete?: () => void;
}

export const BuffActivationFX: React.FC<BuffActivationFXProps> = ({
  type,
  buffName,
  onComplete,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const isStrength = type === 'strength';
    const isAgility = type === 'agility';
    const isArmor = type === 'armor' || (!isStrength && !isAgility);

    let colors: string[];
    let defaultShape: Particle['shape'];

    if (isStrength) {
      colors = ['#ef4444', '#dc2626', '#f97316', '#fbbf24', '#fff176', '#b91c1c'];
      defaultShape = 'star';
    } else if (isAgility) {
      colors = ['#38bdf8', '#06b6d4', '#67e8f9', '#e0f2fe', '#a5f3fc', '#0284c7'];
      defaultShape = 'streak';
    } else {
      colors = ['#f59e0b', '#fbbf24', '#fde047', '#fef08a', '#d97706', '#ffffff'];
      defaultShape = 'diamond';
    }

    const count = 30;
    const generated: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
      // For strength, particles burst predominantly upwards; for agility, whirling outward; for armor, expanding barrier
      let speed = Math.random() * 70 + 40;
      let vx = Math.cos(angle) * speed;
      let vy = Math.sin(angle) * speed;

      if (isStrength) {
        vy = vy * 0.7 - Math.random() * 45; // Drift upwards like fire embers
      } else if (isAgility) {
        speed = Math.random() * 85 + 50;
        vx = Math.cos(angle + 0.5) * speed;
        vy = Math.sin(angle + 0.5) * speed;
      }

      const shapes: Particle['shape'][] = isStrength
        ? ['spark', 'star', 'circle']
        : isAgility
        ? ['streak', 'spark', 'star']
        : ['diamond', 'circle', 'spark'];

      generated.push({
        id: i,
        x: 0,
        y: 0,
        vx,
        vy,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        delay: Math.random() * 150,
      });
    }

    setParticles(generated);

    const timer = setTimeout(() => {
      onComplete?.();
    }, 2100);

    return () => clearTimeout(timer);
  }, [type, onComplete]);

  const isStrength = type === 'strength';
  const isAgility = type === 'agility';
  const isArmor = type === 'armor' || (!isStrength && !isAgility);

  // Styling specifics
  const glowShadow = isStrength
    ? 'rgba(239, 68, 68, 0.75)'
    : isAgility
    ? 'rgba(56, 189, 248, 0.75)'
    : 'rgba(245, 158, 11, 0.75)';

  const ringBorderColor = isStrength
    ? 'border-red-500'
    : isAgility
    ? 'border-cyan-400'
    : 'border-amber-400';

  const badgeBg = isStrength
    ? 'bg-gradient-to-r from-red-950/95 via-rose-900/95 to-red-950/95 border-red-500 text-red-200'
    : isAgility
    ? 'bg-gradient-to-r from-cyan-950/95 via-teal-900/95 to-cyan-950/95 border-cyan-400 text-cyan-200'
    : 'bg-gradient-to-r from-amber-950/95 via-yellow-900/95 to-amber-950/95 border-amber-400 text-amber-200';

  const titleText = isStrength
    ? buffName || 'Força Elevada'
    : isAgility
    ? buffName || 'Agilidade dos Ventos'
    : buffName || 'Armadura de Ferro';

  const subtitleText = isStrength
    ? '+40% Dano de Ataque'
    : isAgility
    ? '+30% Chance de Esquiva'
    : '+8 Defesa de Aço';

  const iconSymbol = isStrength ? '⚔️' : isAgility ? '💨' : '🛡️';

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-visible">
      {/* 1. Brilho Radiante sob o Retrato (Aura Primária) */}
      <div
        className="absolute w-36 h-36 rounded-full blur-xl transition-all duration-700 animate-pulse"
        style={{
          backgroundColor: glowShadow,
          opacity: 0.45,
        }}
      />

      {/* 2. Onda de Choque de Ativação Radial */}
      <div
        className={`absolute w-28 h-28 rounded-full border-2 ${ringBorderColor} animate-buff-shockwave`}
        style={{
          boxShadow: `0 0 25px ${glowShadow}`,
        }}
      />

      {/* 3. Sigilo / Selo Rúnico Giratório sob o Retrato */}
      <div className="absolute w-32 h-32 flex items-center justify-center animate-buff-rune opacity-70">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={isStrength ? '#ef4444' : isAgility ? '#38bdf8' : '#fbbf24'}
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <circle
            cx="50"
            cy="50"
            r="32"
            fill="none"
            stroke={isStrength ? '#f87171' : isAgility ? '#67e8f9' : '#fde047'}
            strokeWidth="1"
          />
          {/* Runic Points */}
          <polygon
            points="50,15 80,68 20,68"
            fill="none"
            stroke={isStrength ? '#dc2626' : isAgility ? '#0284c7' : '#d97706'}
            strokeWidth="1"
          />
          <polygon
            points="50,85 80,32 20,32"
            fill="none"
            stroke={isStrength ? '#dc2626' : isAgility ? '#0284c7' : '#d97706'}
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* 4. Partículas em Ascensão e Dispersão */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute transition-all duration-1000 ease-out"
            style={{
              transform: `translate(${p.vx}px, ${p.vy}px) rotate(${p.rotation + p.vx}deg)`,
              width: `${p.size}px`,
              height: p.shape === 'streak' ? `${p.size * 2.5}px` : `${p.size}px`,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 1.8}px ${p.color}`,
              borderRadius:
                p.shape === 'circle'
                  ? '50%'
                  : p.shape === 'streak'
                  ? '9999px'
                  : p.shape === 'diamond'
                  ? '2px'
                  : '1px',
              opacity: 0,
              transitionDelay: `${p.delay}ms`,
            }}
          />
        ))}
      </div>

      {/* 5. Emblema Flutuante com Nome e Efeito do Buff */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap z-40 animate-buff-banner pointer-events-none">
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-2xl backdrop-blur-md ${badgeBg}`}
          style={{
            boxShadow: `0 0 20px ${glowShadow}`,
          }}
        >
          <span className="text-sm">{iconSymbol}</span>
          <div className="flex flex-col items-start leading-none pr-1">
            <span className="text-[11px] font-cinzel font-bold tracking-wider uppercase">
              {titleText}
            </span>
            <span className="text-[9px] font-sans opacity-90 font-medium">
              {subtitleText}
            </span>
          </div>
          <span className="text-[10px] text-amber-300">✦</span>
        </div>
      </div>
    </div>
  );
};

interface PersistentBuffAuraProps {
  activeBuffs: { type?: BuffFXType; name: string }[];
}

export const PersistentBuffAura: React.FC<PersistentBuffAuraProps> = ({ activeBuffs }) => {
  if (!activeBuffs || activeBuffs.length === 0) return null;

  const hasStrength = activeBuffs.some((b) => b.type === 'strength');
  const hasAgility = activeBuffs.some((b) => b.type === 'agility');
  const hasArmor = activeBuffs.some((b) => b.type === 'armor');

  return (
    <div className="absolute -inset-1.5 rounded-xl pointer-events-none z-10 transition-all duration-500 overflow-visible">
      {/* Halo de Fundo com Pulso Suave */}
      {hasStrength && (
        <div className="absolute -inset-1 rounded-xl bg-red-600/20 blur-md animate-buff-aura-pulse" />
      )}
      {hasAgility && (
        <div className="absolute -inset-1 rounded-xl bg-cyan-500/20 blur-md animate-buff-aura-pulse" />
      )}
      {hasArmor && (
        <div className="absolute -inset-1 rounded-xl bg-amber-500/20 blur-md animate-buff-aura-pulse" />
      )}

      {/* Borda de Destaque Animada ao Redor do Retrato */}
      <div
        className={`absolute inset-0 rounded-lg border-2 transition-colors duration-500 ${
          hasStrength && hasArmor
            ? 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
            : hasStrength
            ? 'border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
            : hasAgility
            ? 'border-cyan-400/80 shadow-[0_0_15px_rgba(56,189,248,0.5)]'
            : 'border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
        }`}
      />

      {/* Partículas de Brilho Ambiente Sutis */}
      <div className="absolute -bottom-1 -right-1 flex gap-0.5">
        {hasStrength && <span className="text-[10px] animate-pulse">🔥</span>}
        {hasAgility && <span className="text-[10px] animate-pulse">💨</span>}
        {hasArmor && <span className="text-[10px] animate-pulse">✨</span>}
      </div>
    </div>
  );
};
