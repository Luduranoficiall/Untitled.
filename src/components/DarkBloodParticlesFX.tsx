import React, { useEffect, useMemo } from 'react';

export type BloodIntensity = 'heavy' | 'brutal' | 'critical';

interface DarkBloodParticlesFXProps {
  intensity?: BloodIntensity;
  onComplete?: () => void;
  className?: string;
}

interface BloodDroplet {
  id: number;
  width: number;
  height: number;
  targetX: number;
  targetY: number;
  gravity: number;
  rotation: number;
  delayMs: number;
  color: string;
  borderRadius: string;
  isTrail?: boolean;
}

interface BloodMistCloud {
  id: number;
  size: number;
  mistX: number;
  mistY: number;
  color: string;
  delayMs: number;
}

interface BloodDrip {
  id: number;
  startX: number;
  height: number;
  delayMs: number;
  color: string;
}

export const DarkBloodParticlesFX: React.FC<DarkBloodParticlesFXProps> = ({
  intensity = 'heavy',
  onComplete,
  className = '',
}) => {
  // Ajustar contagem de partículas conforme a brutalidade do golpe
  const dropletCount = intensity === 'critical' ? 26 : intensity === 'brutal' ? 22 : 16;
  const mistCount = intensity === 'critical' ? 6 : intensity === 'brutal' ? 5 : 3;
  const dripCount = intensity === 'critical' ? 5 : intensity === 'brutal' ? 4 : 2;

  // 1. Gotas e jatos de sangue sombrio em arco parabólico
  const droplets: BloodDroplet[] = useMemo(() => {
    const items: BloodDroplet[] = [];
    const bloodPalettes = [
      'radial-gradient(circle, #b91c1c 0%, #450a0a 60%, #150205 100%)', // Vermelho sangue profundo para abissal
      'radial-gradient(circle, #dc2626 0%, #7f1d1d 55%, #1f0408 100%)', // Ichor carmesim vivo
      'radial-gradient(circle, #881337 0%, #3f0713 70%, #0d0103 100%)', // Coágulo sombrio
      'radial-gradient(circle, #991b1b 0%, #2b0606 65%, #000000 100%)', // Sangue negro corrompido
      'radial-gradient(circle, #ef4444 0%, #991b1b 50%, #180306 100%)', // Gotículas afiadas
    ];

    const shapes = [
      '50% 50% 50% 50% / 60% 60% 40% 40%', // gota arredondada
      '30% 70% 70% 30% / 30% 30% 70% 70%', // respingo angular
      '80% 20% 60% 40% / 50% 70% 30% 50%', // estria esticada
      '60% 40% 30% 70% / 60% 30% 70% 40%', // fragmento viscoso
    ];

    for (let i = 0; i < dropletCount; i++) {
      // Ângulo radial com preferência para dispersão oblíqua para cima e para os lados (efeito de talho de espada)
      const baseAngle = (Math.PI * 2 * i) / dropletCount;
      const angleJitter = (Math.random() - 0.5) * 0.5;
      const angle = baseAngle + angleJitter;

      // Distância do espirro proporcional à brutalidade do impacto
      const speedMult = intensity === 'critical' ? 1.4 : intensity === 'brutal' ? 1.2 : 1.0;
      const distance = (35 + Math.random() * 65) * speedMult;
      const targetX = Math.round(Math.cos(angle) * distance);
      const targetY = Math.round(Math.sin(angle) * distance * 0.85); // Leve compressão vertical inicial
      const gravity = Math.round(18 + Math.random() * 32); // Gravidade puxando o sangue para baixo
      const rotation = Math.round((Math.random() - 0.5) * 360);

      const size = 5 + Math.round(Math.random() * (intensity === 'critical' ? 11 : 8));

      items.push({
        id: i,
        width: size,
        height: Math.round(size * (1.2 + Math.random() * 0.8)), // Gotas alongadas no eixo de voo
        targetX,
        targetY,
        gravity,
        rotation,
        delayMs: Math.round(Math.random() * 60),
        color: bloodPalettes[i % bloodPalettes.length],
        borderRadius: shapes[i % shapes.length],
        isTrail: i % 4 === 0,
      });
    }

    return items;
  }, [dropletCount, intensity]);

  // 2. Nuvem de névoa e miasma sombrio
  const mistClouds: BloodMistCloud[] = useMemo(() => {
    const items: BloodMistCloud[] = [];
    const mistColors = [
      'radial-gradient(circle, rgba(136, 19, 55, 0.7) 0%, rgba(69, 10, 10, 0.4) 50%, transparent 80%)',
      'radial-gradient(circle, rgba(185, 28, 28, 0.6) 0%, rgba(24, 5, 9, 0.5) 60%, transparent 85%)',
      'radial-gradient(circle, rgba(67, 10, 10, 0.8) 0%, rgba(0, 0, 0, 0.6) 70%, transparent 90%)',
    ];

    for (let i = 0; i < mistCount; i++) {
      const mistX = Math.round((Math.random() - 0.5) * 60);
      const mistY = Math.round(-15 - Math.random() * 35);
      const size = 45 + Math.round(Math.random() * 35);

      items.push({
        id: i,
        size,
        mistX,
        mistY,
        color: mistColors[i % mistColors.length],
        delayMs: Math.round(Math.random() * 40),
      });
    }

    return items;
  }, [mistCount]);

  // 3. Estrias de sangue que escorrem verticalmente
  const drips: BloodDrip[] = useMemo(() => {
    const items: BloodDrip[] = [];
    const dripColors = ['#5c0d11', '#7f1d1d', '#350608'];

    for (let i = 0; i < dripCount; i++) {
      items.push({
        id: i,
        startX: -30 + (i * 60) / (dripCount - 1 || 1) + Math.round((Math.random() - 0.5) * 12),
        height: 20 + Math.round(Math.random() * 25),
        delayMs: 80 + i * 40,
        color: dripColors[i % dripColors.length],
      });
    }

    return items;
  }, [dripCount]);

  useEffect(() => {
    // Desmontagem automática após o fim da animação de sangue (750ms)
    const timer = setTimeout(() => {
      onComplete?.();
    }, 780);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-visible select-none ${className}`}
      role="presentation"
      aria-hidden="true"
    >
      {/* 1. Clarão Carmesim Sombrio no Ponto de Impacto */}
      <div className="absolute w-24 h-24 rounded-full bg-red-700/40 blur-md mix-blend-color-dodge animate-pulse" />

      {/* 2. Nuvem de Miasma e Névoa Sombria (Blood Vapor) */}
      {mistClouds.map((mist) => (
        <div
          key={`mist_${mist.id}`}
          className="absolute rounded-full pointer-events-none animate-dark-blood-mist"
          style={{
            width: `${mist.size}px`,
            height: `${mist.size}px`,
            background: mist.color,
            animationDelay: `${mist.delayMs}ms`,
            // @ts-expect-error CSS custom properties
            '--mist-x': `${mist.mistX}px`,
            '--mist-y': `${mist.mistY}px`,
          }}
        />
      ))}

      {/* 3. Talho Visceral de Lâmina Sagrada rasgando a carne escura */}
      <svg
        className="absolute w-28 h-28 pointer-events-none animate-dark-slash-gash z-20"
        viewBox="0 0 100 100"
        fill="none"
      >
        {/* Sulco de corte principal com sombra sangrenta */}
        <path
          d="M10 20 Q48 50 88 82"
          stroke="#120204"
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M12 22 Q50 50 86 80"
          stroke="#991b1b"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M14 24 Q51 50 84 78"
          stroke="#ef4444"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Estrias e ranhuras menores de dilaceração */}
        <path
          d="M25 45 L35 55 M55 35 L65 45 M68 58 L78 68"
          stroke="#b91c1c"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.75"
        />
      </svg>

      {/* 4. Estrias de Sangue Escorrendo (Drips) */}
      {drips.map((drip) => (
        <div
          key={`drip_${drip.id}`}
          className="absolute pointer-events-none animate-dark-blood-drip"
          style={{
            left: `calc(50% + ${drip.startX}px)`,
            top: '48%',
            width: '3.5px',
            height: `${drip.height}px`,
            backgroundColor: drip.color,
            borderRadius: '2px',
            boxShadow: '0 0 4px rgba(0, 0, 0, 0.8)',
            animationDelay: `${drip.delayMs}ms`,
          }}
        />
      ))}

      {/* 5. Gotas de Sangue Sombrio e Coágulos Espirrando em Alta Velocidade */}
      {droplets.map((droplet) => (
        <div
          key={`blood_${droplet.id}`}
          className="absolute pointer-events-none animate-dark-blood-spurt"
          style={{
            width: `${droplet.width}px`,
            height: `${droplet.height}px`,
            background: droplet.color,
            borderRadius: droplet.borderRadius,
            boxShadow: '0 0 5px rgba(185, 28, 28, 0.7), 0 0 2px rgba(0, 0, 0, 0.9)',
            animationDelay: `${droplet.delayMs}ms`,
            // @ts-expect-error CSS custom properties
            '--blood-x': `${droplet.targetX}px`,
            '--blood-y': `${droplet.targetY}px`,
            '--blood-gravity': `${droplet.gravity}px`,
            '--blood-rot': `${droplet.rotation}deg`,
          }}
        />
      ))}

      {/* 6. Selo temático de Dilaceração para golpes brutais */}
      {intensity !== 'heavy' && (
        <div className="absolute -bottom-5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-950 via-[#2d050a] to-red-950 border border-red-600/80 text-[10px] font-bold text-red-200 tracking-wider uppercase shadow-[0_0_12px_rgba(220,38,38,0.7)] animate-bounce font-cinzel">
          🩸 {intensity === 'critical' ? 'Dilaceração Crítica!' : 'Sangue Sombrio!'}
        </div>
      )}
    </div>
  );
};
