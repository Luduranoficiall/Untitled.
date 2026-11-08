import React, { useEffect, useMemo } from 'react';

interface GoldenAscensionParticlesFXProps {
  onComplete?: () => void;
  className?: string;
}

interface GoldenMote {
  id: number;
  startX: number;
  targetX: number;
  targetY: number;
  size: number;
  delayMs: number;
  color: string;
  isSparkleStar?: boolean;
}

interface GoldenRay {
  id: number;
  startX: number;
  width: number;
  height: number;
  delayMs: number;
  opacity: number;
}

export const GoldenAscensionParticlesFX: React.FC<GoldenAscensionParticlesFXProps> = ({
  onComplete,
  className = '',
}) => {
  // 1. Partículas e esferas de energia solar sagrada ascendentes
  const motes: GoldenMote[] = useMemo(() => {
    const totalMotes = 22;
    const items: GoldenMote[] = [];

    const goldenPalettes = [
      'radial-gradient(circle, #ffffff 0%, #fef08a 35%, #eab308 75%, transparent 100%)', // Ouro solar puro
      'radial-gradient(circle, #ffffff 0%, #fde047 40%, #ca8a04 85%, transparent 100%)', // Âmbar radiante
      'radial-gradient(circle, #fffbeb 0%, #facc15 50%, #a16207 90%, transparent 100%)', // Luz da Ordem Dourada
      'radial-gradient(circle, #fef9c3 0%, #fbbf24 45%, #b45309 85%, transparent 100%)', // Chama sagrada suave
    ];

    for (let i = 0; i < totalMotes; i++) {
      // Dispersão ao longo da base do retrato (-45px a +45px do centro)
      const startX = -45 + (i * 90) / (totalMotes - 1) + Math.round((Math.random() - 0.5) * 14);
      // Leve desvio lateral orgânico durante a ascensão (-18px a +18px)
      const driftX = Math.round((Math.random() - 0.5) * 36);
      const targetX = startX + driftX;
      // Altura ascendente suave (-80px a -140px acima da base)
      const targetY = -85 - Math.round(Math.random() * 55);

      const size = 4 + Math.round(Math.random() * 7);
      const isSparkleStar = i % 3 === 0;

      items.push({
        id: i,
        startX,
        targetX,
        targetY,
        size,
        delayMs: Math.round(Math.random() * 260),
        color: goldenPalettes[i % goldenPalettes.length],
        isSparkleStar,
      });
    }

    return items;
  }, []);

  // 2. Feixes verticais suaves de luz solar que brotam da base
  const rays: GoldenRay[] = useMemo(() => {
    const items: GoldenRay[] = [];
    const positions = [-32, -10, 12, 34];

    positions.forEach((pos, idx) => {
      items.push({
        id: idx,
        startX: pos + Math.round((Math.random() - 0.5) * 8),
        width: 14 + Math.round(Math.random() * 12),
        height: 70 + Math.round(Math.random() * 45),
        delayMs: idx * 45,
        opacity: 0.35 + Math.random() * 0.25,
      });
    });

    return items;
  }, []);

  useEffect(() => {
    // Desmontagem suave após a conclusão das partículas ascendentes (1.25s)
    const timer = setTimeout(() => {
      onComplete?.();
    }, 1300);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-35 flex items-end justify-center overflow-visible select-none ${className}`}
      role="presentation"
      aria-hidden="true"
    >
      {/* 1. Halo Radiante Dourado na Base do Retrato */}
      <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-amber-400/50 via-yellow-300/25 to-transparent blur-sm rounded-b-lg animate-golden-base-glow" />
      <div className="absolute -bottom-2 w-32 h-6 bg-amber-400/35 rounded-full blur-md animate-pulse" />

      {/* 2. Feixes Verticais de Luz Sagrada emanando da base */}
      {rays.map((ray) => (
        <div
          key={`ray_${ray.id}`}
          className="absolute bottom-0 pointer-events-none animate-golden-base-glow"
          style={{
            left: `calc(50% + ${ray.startX}px)`,
            width: `${ray.width}px`,
            height: `${ray.height}px`,
            background: 'linear-gradient(to top, rgba(254, 240, 138, 0.45) 0%, rgba(250, 204, 21, 0.2) 60%, transparent 100%)',
            filter: 'blur(2px)',
            animationDelay: `${ray.delayMs}ms`,
            opacity: ray.opacity,
          }}
        />
      ))}

      {/* 3. Partículas e Orbes de Energia Dourada Ascendentes */}
      {motes.map((mote) => {
        if (mote.isSparkleStar) {
          // Estrela solar de 4 pontas cintilante subindo suavemente
          return (
            <div
              key={`star_${mote.id}`}
              className="absolute bottom-1 pointer-events-none animate-golden-sparkle"
              style={{
                left: `calc(50% + ${mote.startX}px)`,
                width: `${mote.size + 4}px`,
                height: `${mote.size + 4}px`,
                animationDelay: `${mote.delayMs}ms`,
                // @ts-expect-error CSS custom properties
                '--rise-x': `${mote.targetX - mote.startX}px`,
                '--rise-y': `${mote.targetY}px`,
              }}
            >
              <svg className="w-full h-full drop-shadow-[0_0_8px_#fef08a]" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z"
                  fill="url(#starGoldGrad)"
                />
                <defs>
                  <radialGradient id="starGoldGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="45%" stopColor="#fef08a" />
                    <stop offset="85%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#a16207" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          );
        }

        // Esfera luminosa de energia solar
        return (
          <div
            key={`mote_${mote.id}`}
            className="absolute bottom-1 rounded-full pointer-events-none animate-golden-energy-rise"
            style={{
              left: `calc(50% + ${mote.startX}px)`,
              width: `${mote.size}px`,
              height: `${mote.size}px`,
              background: mote.color,
              boxShadow: '0 0 10px #fef08a, 0 0 18px #eab308, 0 0 4px #ffffff',
              animationDelay: `${mote.delayMs}ms`,
              // @ts-expect-error CSS custom properties
              '--rise-x': `${mote.targetX - mote.startX}px`,
              '--rise-y': `${mote.targetY}px`,
            }}
          />
        );
      })}
    </div>
  );
};
