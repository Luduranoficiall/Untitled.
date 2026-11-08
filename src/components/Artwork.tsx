import React from 'react';

export const SireAlaricPortrait: React.FC<{
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  isDamaged?: boolean;
  damageKey?: number;
}> = ({
  className = '',
  size = 'md',
  isDamaged = false,
  damageKey,
}) => {
  const dim = size === 'sm' ? 'w-16 h-16' : size === 'lg' ? 'w-48 h-48 sm:w-56 sm:h-56' : 'w-28 h-28 sm:w-36 sm:h-36';
  const [animatingDamage, setAnimatingDamage] = React.useState(false);

  React.useEffect(() => {
    if (damageKey !== undefined && damageKey > 0) {
      setAnimatingDamage(false);
      const raf = requestAnimationFrame(() => {
        setAnimatingDamage(true);
      });
      const timer = setTimeout(() => {
        setAnimatingDamage(false);
      }, 500);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(timer);
      };
    }
  }, [damageKey]);

  const showDamage = isDamaged || animatingDamage;

  return (
    <div
      className={`relative ${dim} rounded-lg overflow-hidden border-2 transition-all duration-200 shrink-0 bg-[#120f0b] ${
        showDamage
          ? 'border-red-600 shadow-[0_0_35px_rgba(220,38,38,0.9)] animate-alaric-damage-shake'
          : 'border-[#c59b27] shadow-[0_0_20px_rgba(197,155,39,0.35)]'
      } ${className}`}
    >
      {/* Flash Vermelho & Pulso de Sangue sobre o Retrato */}
      {showDamage && (
        <div
          key={`flash_${damageKey ?? 0}`}
          className="absolute inset-0 pointer-events-none animate-alaric-damage-flash z-20 flex items-center justify-center overflow-hidden"
        >
          {/* Overlay carmesim de impacto */}
          <div className="absolute inset-0 bg-red-600/40 mix-blend-hard-light" />
          {/* Fissuras de corte e sangue estilizadas */}
          <svg className="absolute inset-0 w-full h-full opacity-70" viewBox="0 0 100 100" fill="none">
            <path d="M12 25 L88 78 M78 18 L22 82 M45 10 L58 92" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
            <circle cx="35" cy="40" r="3" fill="#ef4444" opacity="0.6" />
            <circle cx="68" cy="62" r="2.5" fill="#ef4444" opacity="0.6" />
          </svg>
        </div>
      )}

      {/* Background glow & sunburst */}
      <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="sunGlow" cx="50%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#4a3b1a" />
            <stop offset="60%" stopColor="#211a0d" />
            <stop offset="100%" stopColor="#0d0b07" />
          </radialGradient>
          <linearGradient id="goldPlate" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f7e199" />
            <stop offset="40%" stopColor="#c59b27" />
            <stop offset="85%" stopColor="#755610" />
          </linearGradient>
          <linearGradient id="steelPlate" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d5dbe3" />
            <stop offset="50%" stopColor="#7f8b99" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
          <linearGradient id="capeRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#991b1b" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>
        </defs>

        {/* Ambient Dark Sun Aura */}
        <rect width="200" height="200" fill="url(#sunGlow)" />
        <circle cx="100" cy="70" r="45" fill="#f59e0b" opacity="0.12" />
        <circle cx="100" cy="70" r="30" stroke="#c59b27" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />

        {/* Cape folds */}
        <path d="M40 180 C40 135 65 115 80 110 L100 130 L120 110 C135 115 160 135 160 180 Z" fill="url(#capeRed)" />

        {/* Steel Pauldrons (Dragona de Prata) */}
        <path d="M42 120 C42 105 60 98 75 105 C68 118 64 135 55 145 C46 138 42 130 42 120 Z" fill="url(#steelPlate)" stroke="#c59b27" strokeWidth="2" />
        <path d="M158 120 C158 105 140 98 125 105 C132 118 136 135 145 145 C154 138 158 130 158 120 Z" fill="url(#steelPlate)" stroke="#c59b27" strokeWidth="2" />

        {/* Chestplate Armor */}
        <path d="M72 108 L100 95 L128 108 L134 165 C134 178 118 185 100 185 C82 185 66 178 66 165 Z" fill="url(#goldPlate)" />
        {/* Chest Gorget / Lion Motif */}
        <path d="M85 125 L100 115 L115 125 L100 148 Z" fill="#2d220c" stroke="#f6dc9c" strokeWidth="1.5" />
        <circle cx="100" cy="130" r="4" fill="#f6dc9c" />

        {/* Neck & Gorget */}
        <path d="M84 90 L100 80 L116 90 L114 105 L86 105 Z" fill="url(#steelPlate)" />

        {/* Head / Face */}
        <ellipse cx="100" cy="70" rx="22" ry="26" fill="#d4a373" />

        {/* Paladin Beard & Mustache */}
        <path d="M82 68 C80 84 88 100 100 102 C112 100 120 84 118 68 C115 76 108 78 100 78 C92 78 85 76 82 68 Z" fill="#3a2e22" />
        <path d="M90 74 C95 72 105 72 110 74 C106 78 94 78 90 74 Z" fill="#261c14" />

        {/* Eyes & Eyebrows */}
        <path d="M88 60 Q94 57 98 60" stroke="#1f1811" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M102 60 Q106 57 112 60" stroke="#1f1811" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="94" cy="64" r="2.2" fill="#2b4c7e" />
        <circle cx="106" cy="64" r="2.2" fill="#2b4c7e" />
        <circle cx="94.6" cy="63.5" r="0.7" fill="#ffffff" />
        <circle cx="106.6" cy="63.5" r="0.7" fill="#ffffff" />

        {/* Nose */}
        <path d="M100 62 L98 71 L102 71 Z" fill="#b08055" />

        {/* Dark Brown Hair */}
        <path d="M78 65 C76 45 92 40 100 40 C108 40 124 45 122 65 C122 55 115 48 100 48 C85 48 78 55 78 65 Z" fill="#261c14" />
        <path d="M76 65 L82 78 L80 62 Z" fill="#261c14" />
        <path d="M124 65 L118 78 L120 62 Z" fill="#261c14" />

        {/* Golden Circlet / Crown of the Golden Order */}
        <path d="M79 54 Q100 49 121 54 L120 50 Q100 45 80 50 Z" fill="url(#goldPlate)" stroke="#fef08a" strokeWidth="0.8" />
        <polygon points="100,43 103,49 97,49" fill="#fef08a" />
      </svg>
      {/* Corner Filigree Overlays */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#fef08a]/80" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#fef08a]/80" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#fef08a]/80" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#fef08a]/80" />
    </div>
  );
};

export const ValeriaPortrait: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-lg overflow-hidden border-2 border-[#c59b27] shadow-[0_0_20px_rgba(234,179,8,0.25)] shrink-0 bg-[#160e14] ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bazaarGlow" cx="60%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#4c1d38" />
            <stop offset="50%" stopColor="#250d1b" />
            <stop offset="100%" stopColor="#0d050a" />
          </radialGradient>
          <linearGradient id="crimsonRobe" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b91c1c" />
            <stop offset="60%" stopColor="#7f1d1d" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>
          <linearGradient id="potionGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a7f3d0" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        <rect width="200" height="200" fill="url(#bazaarGlow)" />

        {/* Ambient warm lamp light in shop */}
        <circle cx="160" cy="50" r="30" fill="#f59e0b" opacity="0.15" />
        <path d="M155 35 L165 35 L168 55 L152 55 Z" fill="#d97706" opacity="0.4" />

        {/* Hooded Cloak / Traje de Mercadora */}
        <path d="M45 190 C40 140 60 110 80 100 L100 120 L120 100 C140 110 160 140 155 190 Z" fill="url(#crimsonRobe)" />
        <path d="M60 70 C60 35 80 25 100 25 C120 25 140 35 140 70 C140 95 130 110 120 115 C110 108 90 108 80 115 C70 110 60 95 60 70 Z" fill="#581c87" opacity="0.85" />
        <path d="M65 72 C65 42 80 32 100 32 C120 32 135 42 135 72 C135 90 128 104 120 108 C110 102 90 102 80 108 C72 104 65 90 65 72 Z" fill="#450a0a" />

        {/* Face */}
        <ellipse cx="100" cy="74" rx="20" ry="24" fill="#f0ab8d" />

        {/* Dark raven hair framing face */}
        <path d="M82 62 C82 50 90 42 100 42 C110 42 118 50 118 62 C114 60 108 58 100 58 C92 58 86 60 82 62 Z" fill="#171717" />
        <path d="M81 62 C83 75 84 88 88 95 C85 88 83 75 81 62 Z" fill="#171717" />
        <path d="M119 62 C117 75 116 88 112 95 C115 88 117 75 119 62 Z" fill="#171717" />

        {/* Eyes (Enigmatic Emerald) */}
        <path d="M88 69 Q94 66 98 69" stroke="#171717" strokeWidth="2" strokeLinecap="round" />
        <path d="M102 69 Q106 66 112 69" stroke="#171717" strokeWidth="2" strokeLinecap="round" />
        <circle cx="94" cy="72" r="2.2" fill="#10b981" />
        <circle cx="106" cy="72" r="2.2" fill="#10b981" />
        <circle cx="94.5" cy="71.5" r="0.7" fill="#ffffff" />
        <circle cx="106.5" cy="71.5" r="0.7" fill="#ffffff" />

        {/* Smile */}
        <path d="M95 86 Q100 90 105 86" stroke="#991b1b" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Golden Filigree Earring */}
        <circle cx="81" cy="78" r="2.5" fill="#facc15" />
        <path d="M81 80.5 L81 86" stroke="#facc15" strokeWidth="1.5" />

        {/* Alchemical Potion Vial in Hand */}
        <path d="M135 155 L145 155 L150 178 C150 184 130 184 130 178 Z" fill="url(#potionGlow)" opacity="0.95" />
        <rect x="137" y="150" width="6" height="5" fill="#92400e" rx="1" />
        <circle cx="140" cy="170" r="2" fill="#ffffff" opacity="0.8" />
      </svg>
      {/* Corner filigree */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#fef08a]/80" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#fef08a]/80" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#fef08a]/80" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#fef08a]/80" />
    </div>
  );
};

export const EnemyArtwork: React.FC<{ enemyId: string; className?: string }> = ({ enemyId, className = '' }) => {
  return (
    <div className={`relative w-36 h-36 sm:w-44 sm:h-44 rounded-lg overflow-hidden border-2 border-red-900/80 shadow-[0_0_24px_rgba(239,68,68,0.25)] shrink-0 bg-[#0f0a0a] ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="darkAura" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#450a0a" />
            <stop offset="70%" stopColor="#180505" />
            <stop offset="100%" stopColor="#080202" />
          </radialGradient>
        </defs>

        <rect width="200" height="200" fill="url(#darkAura)" />

        {enemyId === 'shadow_chimera' && (
          <g>
            {/* Horns */}
            <path d="M60 70 Q40 25 30 10 Q50 35 70 55 Z" fill="#713f12" stroke="#eab308" strokeWidth="1" />
            <path d="M140 70 Q160 25 170 10 Q150 35 130 55 Z" fill="#713f12" stroke="#eab308" strokeWidth="1" />
            {/* Head Silhouette */}
            <path d="M65 80 C60 120 75 150 100 155 C125 150 140 120 135 80 C130 60 70 60 65 80 Z" fill="#1c1917" stroke="#991b1b" strokeWidth="2" />
            {/* Fangs */}
            <polygon points="85,120 90,135 95,120" fill="#fef08a" />
            <polygon points="105,120 110,135 115,120" fill="#fef08a" />
            {/* Glowing Amber Eyes */}
            <circle cx="85" cy="85" r="5" fill="#f59e0b" />
            <circle cx="115" cy="85" r="5" fill="#f59e0b" />
            <circle cx="85" cy="85" r="2" fill="#dc2626" />
            <circle cx="115" cy="85" r="2" fill="#dc2626" />
            {/* Shadow particles */}
            <circle cx="50" cy="130" r="3" fill="#ef4444" opacity="0.6" />
            <circle cx="150" cy="120" r="4" fill="#ef4444" opacity="0.5" />
          </g>
        )}

        {enemyId === 'swamp_wraith' && (
          <g>
            {/* Ghostly shroud */}
            <path d="M70 40 C85 20 115 20 130 40 C145 60 155 110 140 170 C125 150 110 170 100 150 C90 170 75 150 60 170 C45 110 55 60 70 40 Z" fill="#064e3b" opacity="0.8" stroke="#10b981" strokeWidth="2" />
            {/* Glowing hollow eyes */}
            <ellipse cx="88" cy="65" rx="6" ry="8" fill="#a7f3d0" />
            <ellipse cx="112" cy="65" rx="6" ry="8" fill="#a7f3d0" />
            <path d="M96 90 Q100 100 104 90" stroke="#a7f3d0" strokeWidth="3" fill="none" />
          </g>
        )}

        {enemyId === 'corrupted_lord' && (
          <g>
            {/* Spiked Dark Helmet */}
            <path d="M60 80 L70 30 L85 50 L100 15 L115 50 L130 30 L140 80 L135 150 L65 150 Z" fill="#262626" stroke="#c2410c" strokeWidth="2" />
            {/* Crimson Visor Slit */}
            <path d="M80 85 L120 85 L115 92 L85 92 Z" fill="#ef4444" />
            <circle cx="92" cy="88" r="2" fill="#ffffff" />
            <circle cx="108" cy="88" r="2" fill="#ffffff" />
            {/* Dark plate collar */}
            <path d="M50 150 L100 185 L150 150 Z" fill="#171717" stroke="#7f1d1d" strokeWidth="2" />
          </g>
        )}
      </svg>
      {/* Ominous red corners */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500/80" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500/80" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500/80" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500/80" />
    </div>
  );
};
