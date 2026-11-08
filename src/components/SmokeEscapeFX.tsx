import React from 'react';

interface SmokeEscapeFXProps {
  onComplete?: () => void;
}

export const SmokeEscapeFX: React.FC<SmokeEscapeFXProps> = () => {
  // Configuração de nuvens com posições e atrasos variados
  const smokeClouds = [
    { id: 1, x: '50%', y: '50%', size: 'w-64 h-64 sm:w-80 sm:h-80', bg: 'bg-[#3d362e]/90', delay: '0s' },
    { id: 2, x: '40%', y: '45%', size: 'w-72 h-72 sm:w-96 sm:h-96', bg: 'bg-[#26201a]/95', delay: '0.08s' },
    { id: 3, x: '60%', y: '55%', size: 'w-60 h-60 sm:w-80 sm:h-80', bg: 'bg-[#4a4237]/85', delay: '0.12s' },
    { id: 4, x: '35%', y: '60%', size: 'w-56 h-56 sm:w-72 sm:h-72', bg: 'bg-[#1e1914]/90', delay: '0.18s' },
    { id: 5, x: '65%', y: '40%', size: 'w-52 h-52 sm:w-64 sm:h-64', bg: 'bg-[#5c503f]/80', delay: '0.15s' },
    { id: 6, x: '50%', y: '40%', size: 'w-80 h-80 sm:w-[420px] sm:h-[420px]', bg: 'bg-[#2a241d]/95', delay: '0.22s' },
  ];

  return (
    <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden flex items-center justify-center">
      {/* Camada de desvanecimento e névoa escura */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-700" />

      {/* Nuvens de fumaça em expansão rápida */}
      {smokeClouds.map((cloud) => (
        <div
          key={cloud.id}
          className={`absolute rounded-full filter blur-xl ${cloud.size} ${cloud.bg} animate-smoke-puff`}
          style={{
            left: cloud.x,
            top: cloud.y,
            transform: 'translate(-50%, -50%)',
            animationDelay: cloud.delay,
          }}
        />
      ))}

      {/* Faíscas douradas e brasas dispersando na fumaça */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(16)].map((_, i) => {
          const angle = (i * 360) / 16;
          const dist = 70 + (i % 4) * 35;
          const rad = (angle * Math.PI) / 180;
          return (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-[#f3d484] shadow-[0_0_8px_#c59b27] animate-ping"
              style={{
                transform: `translate(${Math.cos(rad) * dist}px, ${Math.sin(rad) * dist}px)`,
                animationDuration: '0.7s',
                animationDelay: `${i * 0.03}s`,
              }}
            />
          );
        })}
      </div>

      {/* Selo Central da Fuga Táctica */}
      <div className="relative z-20 text-center px-6 py-4 rounded-2xl bg-[#18140f]/95 border-2 border-[#c59b27] shadow-[0_0_40px_rgba(0,0,0,0.9)] max-w-sm mx-4 animate-in zoom-in-90 fade-in duration-300">
        <div className="text-3xl mb-1">💨</div>
        <div className="text-xs uppercase font-extrabold tracking-widest text-[#a88636] font-cinzel">
          Recuo Tático Sagrado
        </div>
        <h3 className="text-base sm:text-lg font-bold text-[#f3d484] my-1 font-cinzel">
          Bomba de Fumaça Lançada!
        </h3>
        <p className="text-xs text-[#bdae93] leading-relaxed">
          Sire Alaric desengaja das garras inimigas sob uma densa cortina de fumaça e retorna com segurança ao acampamento.
        </p>
      </div>
    </div>
  );
};
