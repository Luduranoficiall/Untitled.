import React, { useMemo } from 'react';

export type WeatherType = 'rain' | 'fog' | 'ash';

interface WeatherOverlayProps {
  weather: WeatherType;
}

export function getWeatherForEnemy(enemyId: string): { type: WeatherType; label: string; icon: string } {
  if (enemyId === 'swamp_wraith') {
    return {
      type: 'fog',
      label: 'Névoa Espectral do Pântano',
      icon: '🌫️',
    };
  }
  if (enemyId === 'corrupted_lord') {
    return {
      type: 'ash',
      label: 'Névoa Carmesim com Cinzas',
      icon: '🔥',
    };
  }
  // Default para Quimera e monstros de montanha
  return {
    type: 'rain',
    label: 'Chuva Gélida das Montanhas',
    icon: '🌧️',
  };
}

export const WeatherOverlay: React.FC<WeatherOverlayProps> = ({ weather }) => {
  // Gerar partículas determinísticas para a sessão do clima
  const rainDrops = useMemo(() => {
    return Array.from({ length: 36 }).map((_, i) => ({
      id: i,
      left: `${(i * 100) / 36 + (i % 3) * 1.5}%`,
      delay: `${((i * 7) % 25) * 0.05}s`,
      duration: `${0.65 + ((i * 3) % 4) * 0.1}s`,
      opacity: 0.35 + ((i % 5) * 0.1),
      height: `${24 + ((i * 5) % 18)}px`,
    }));
  }, []);

  const emberParticles = useMemo(() => {
    return Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      left: `${5 + (i * 90) / 22 + (i % 4) * 2}%`,
      delay: `${((i * 13) % 30) * 0.15}s`,
      duration: `${3.8 + (i % 3) * 0.8}s`,
      size: `${3 + (i % 3) * 2}px`,
      color: i % 2 === 0 ? '#f59e0b' : '#ef4444',
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 rounded-2xl select-none">
      {/* 1. Clima: Tempestade Gélida com Chuva */}
      {weather === 'rain' && (
        <div className="absolute inset-0">
          {/* Vinheta azulada fria de tempestade */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-950/20 via-transparent to-slate-950/30" />

          {/* Gotas de Chuva em Ângulo com CSS */}
          {rainDrops.map((drop) => (
            <div
              key={drop.id}
              className="absolute w-[1.5px] bg-gradient-to-b from-transparent via-sky-200/60 to-white/80 animate-rain-drop"
              style={{
                left: drop.left,
                top: '-40px',
                height: drop.height,
                animationDelay: drop.delay,
                animationDuration: drop.duration,
                opacity: drop.opacity,
                transform: 'rotate(15deg)',
              }}
            />
          ))}

          {/* Respingos sutis na base da arena */}
          <div className="absolute bottom-2 left-0 right-0 h-4 bg-gradient-to-t from-sky-400/10 to-transparent blur-sm" />
        </div>
      )}

      {/* 2. Clima: Neblina / Névoa Espectral do Pântano */}
      {weather === 'fog' && (
        <div className="absolute inset-0">
          {/* Vinheta esmeralda fantasmagórica */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/25 via-slate-950/20 to-emerald-950/30" />

          {/* Camada 1 de Névoa Fluida Rastejante */}
          <div
            className="absolute -bottom-8 -left-1/4 w-[160%] h-48 bg-gradient-to-t from-emerald-900/40 via-emerald-800/25 to-transparent filter blur-2xl animate-fog-1"
          />

          {/* Camada 2 de Névoa Superior Fluida */}
          <div
            className="absolute -top-10 -right-1/4 w-[150%] h-40 bg-gradient-to-b from-slate-800/35 via-emerald-950/20 to-transparent filter blur-2xl animate-fog-2"
          />

          {/* Partículas de bruma etérea em suspensão */}
          <div className="absolute inset-0 flex items-center justify-around">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-32 h-16 rounded-full bg-emerald-500/10 filter blur-xl animate-pulse"
                style={{
                  animationDuration: `${3.5 + i}s`,
                  animationDelay: `${i * 0.7}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 3. Clima: Névoa Carmesim com Cinzas & Brasas Abissais */}
      {weather === 'ash' && (
        <div className="absolute inset-0">
          {/* Vinheta avermelhada sombria */}
          <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-transparent to-red-950/35" />

          {/* Névoa de enxofre escura ao fundo */}
          <div
            className="absolute -bottom-6 -left-1/4 w-[150%] h-40 bg-gradient-to-t from-red-950/45 via-black/30 to-transparent filter blur-xl animate-fog-1"
          />

          {/* Partículas de Brasas Flutuando para Cima */}
          {emberParticles.map((ember) => (
            <div
              key={ember.id}
              className="absolute rounded-full animate-ember"
              style={{
                left: ember.left,
                bottom: '0px',
                width: ember.size,
                height: ember.size,
                backgroundColor: ember.color,
                boxShadow: `0 0 6px ${ember.color}`,
                animationDelay: ember.delay,
                animationDuration: ember.duration,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
