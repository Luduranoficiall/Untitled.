import React, { useEffect, useMemo } from 'react';

interface EnemyShatterFXProps {
  onComplete?: () => void;
  className?: string;
}

interface Shard {
  id: number;
  clipPath: string;
  width: number;
  height: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  rotation: number;
  colorGradient: string;
  delayMs: number;
}

// Formatos poligonais de estilhaços afiados estilo vidro quebrado / cristais escuros
const SHARD_POLYGONS = [
  'polygon(50% 0%, 0% 100%, 100% 100%)', // triângulo agudo
  'polygon(20% 0%, 100% 30%, 80% 100%, 0% 80%)', // faceta romboide
  'polygon(0% 0%, 100% 20%, 60% 100%)', // lasca alongada
  'polygon(35% 0%, 100% 0%, 85% 100%, 15% 85%)', // trapézio quebrado
  'polygon(50% 0%, 90% 40%, 70% 100%, 10% 90%, 0% 30%)', // pentágono estilhaçado
  'polygon(0% 40%, 100% 0%, 70% 100%)', // punhal de vidro
  'polygon(15% 0%, 85% 15%, 100% 85%, 25% 100%)', // lâmina angular
  'polygon(50% 0%, 100% 70%, 30% 100%)', // fragmento afiado
];

export const EnemyShatterFX: React.FC<EnemyShatterFXProps> = ({
  onComplete,
  className = '',
}) => {
  // Gerar conjunto procedural balanceado de estilhaços
  const shards: Shard[] = useMemo(() => {
    const totalShards = 22;
    const items: Shard[] = [];

    const rubyGradients = [
      'linear-gradient(135deg, #ffffff 0%, #ef4444 35%, #991b1b 100%)',
      'linear-gradient(145deg, #fef2f2 0%, #dc2626 40%, #7f1d1d 100%)',
      'linear-gradient(120deg, #fca5a5 0%, #b91c1c 50%, #450a0a 100%)',
      'linear-gradient(160deg, #ffffff 0%, #f87171 25%, #dc2626 100%)',
      'linear-gradient(135deg, #fee2e2 0%, #e11d48 45%, #881337 100%)',
    ];

    for (let i = 0; i < totalShards; i++) {
      // Ângulo radial em círculo completo com jitter orgânico
      const angle = (Math.PI * 2 * i) / totalShards + (Math.random() * 0.4 - 0.2);
      // Distância de projeção do estilhaço (60px a 140px fora do centro)
      const distance = 65 + Math.random() * 85;
      const targetX = Math.round(Math.cos(angle) * distance);
      const targetY = Math.round(Math.sin(angle) * distance);
      const rotation = Math.round((Math.random() - 0.5) * 540); // Rotação rápida em graus

      items.push({
        id: i,
        clipPath: SHARD_POLYGONS[i % SHARD_POLYGONS.length],
        width: 14 + Math.round(Math.random() * 16),
        height: 16 + Math.round(Math.random() * 20),
        startX: (Math.random() - 0.5) * 20,
        startY: (Math.random() - 0.5) * 20,
        targetX,
        targetY,
        rotation,
        colorGradient: rubyGradients[i % rubyGradients.length],
        delayMs: Math.round(Math.random() * 50),
      });
    }

    return items;
  }, []);

  useEffect(() => {
    // Auto-encerramento e desmontagem após o término dos efeitos visuais (800ms)
    const timer = setTimeout(() => {
      onComplete?.();
    }, 850);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-visible select-none ${className}`}
      role="presentation"
      aria-hidden="true"
    >
      {/* 1. Camada de Brilho Avermelhado de Alto Contraste (Crimson Flash Strobe) */}
      <div className="absolute inset-0 rounded-lg bg-red-600/70 mix-blend-color-dodge animate-enemy-crimson-flash" />
      <div className="absolute inset-[-12px] rounded-xl bg-gradient-to-r from-red-600/60 via-rose-500/80 to-red-700/60 blur-md animate-enemy-crimson-flash" />

      {/* 2. Anéis de Choque Expansivos Carmesins */}
      <div className="absolute w-28 h-28 rounded-full border-4 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.9)] animate-crit-crimson-ring" />
      <div
        className="absolute w-32 h-32 rounded-full border-2 border-rose-400 shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-crit-crimson-ring"
        style={{ animationDelay: '0.08s' }}
      />

      {/* 3. Teia de Fraturas e Rachaduras de Vidro (SVG Crack Web) */}
      <svg
        className="absolute inset-0 w-full h-full animate-enemy-crack-web drop-shadow-[0_0_8px_rgba(239,68,68,0.95)]"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="miter">
          {/* Fissuras Principais que partem do centro de impacto */}
          <path d="M100 100 L70 65 L40 50 L10 45" stroke="#ffffff" />
          <path d="M100 100 L130 60 L165 40 L190 30" stroke="#fca5a5" />
          <path d="M100 100 L145 130 L175 160 L195 185" stroke="#ffffff" />
          <path d="M100 100 L65 140 L35 165 L10 180" stroke="#fca5a5" />
          <path d="M100 100 L100 45 L95 15" stroke="#ffffff" />
          <path d="M100 100 L105 160 L110 195" stroke="#fca5a5" />
          <path d="M100 100 L45 95 L10 105" stroke="#ffffff" />
          <path d="M100 100 L160 102 L195 95" stroke="#fca5a5" />

          {/* Ramificações transversais e quebras concêntricas */}
          <path d="M70 65 L85 45 M70 65 L55 80" stroke="#ef4444" strokeWidth="1.8" />
          <path d="M130 60 L140 85 M130 60 L115 40" stroke="#ef4444" strokeWidth="1.8" />
          <path d="M145 130 L160 115 M145 130 L130 155" stroke="#ef4444" strokeWidth="1.8" />
          <path d="M65 140 L50 125 M65 140 L78 160" stroke="#ef4444" strokeWidth="1.8" />
          <path d="M68 66 L100 48 L128 61 L142 101 L144 128 L104 158 L66 138 L46 96 Z" stroke="#fee2e2" strokeWidth="1.2" strokeDasharray="4 2" />
        </g>
        {/* Ponto focal de explosão estilhaçada */}
        <circle cx="100" cy="100" r="8" fill="#ffffff" filter="drop-shadow(0 0 10px #ef4444)" />
        <circle cx="100" cy="100" r="16" stroke="#ef4444" strokeWidth="2" opacity="0.85" />
      </svg>

      {/* 4. Estilhaços Poligonais Físicos Dispersos (Shards Flying Outward) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {shards.map((shard) => (
          <div
            key={shard.id}
            className="absolute animate-shatter-shard"
            style={
              {
                '--shard-x': `${shard.targetX}px`,
                '--shard-y': `${shard.targetY}px`,
                '--shard-rot': `${shard.rotation}deg`,
                width: `${shard.width}px`,
                height: `${shard.height}px`,
                clipPath: shard.clipPath,
                background: shard.colorGradient,
                boxShadow: '0 0 12px rgba(239, 68, 68, 0.9), inset 0 0 4px #ffffff',
                border: '1px solid rgba(255, 255, 255, 0.7)',
                animationDelay: `${shard.delayMs}ms`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* 5. Centelhas Incandescentes de Alto Contraste */}
      {[...Array(12)].map((_, idx) => {
        const sparkAngle = (Math.PI * 2 * idx) / 12;
        const sparkDist = 50 + (idx % 3) * 25;
        const sparkX = Math.cos(sparkAngle) * sparkDist;
        const sparkY = Math.sin(sparkAngle) * sparkDist;

        return (
          <div
            key={`spark-${idx}`}
            className="absolute w-2 h-2 rounded-full bg-white animate-shatter-shard"
            style={
              {
                '--shard-x': `${sparkX}px`,
                '--shard-y': `${sparkY}px`,
                '--shard-rot': `${idx * 45}deg`,
                boxShadow: '0 0 8px #ffffff, 0 0 16px #ef4444',
                animationDelay: `${(idx % 4) * 30}ms`,
              } as React.CSSProperties
            }
          />
        );
      })}

      {/* 6. Selo Emblema "ESTILHAÇO CRÍTICO!" */}
      <div className="absolute -top-7 sm:-top-8 px-2.5 py-0.5 rounded-full bg-black/90 border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.9)] flex items-center gap-1.5 animate-bounce z-40">
        <span className="text-red-400 text-xs">⚡</span>
        <span className="text-[10px] sm:text-xs font-cinzel font-black tracking-widest text-red-200 uppercase drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]">
          Estilhaço Crítico!
        </span>
        <span className="text-amber-400 text-xs">💥</span>
      </div>
    </div>
  );
};
