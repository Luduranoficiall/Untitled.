import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CombatLogEntry } from '../types/game';
import { Scroll, ChevronDown, Sparkles, Filter, Shield, Swords, Zap, ArrowDown } from 'lucide-react';

interface BattleLogWindowProps {
  logs: CombatLogEntry[];
  currentTurn?: 'player' | 'enemy';
  onClearLogs?: () => void;
}

type FilterCategory = 'all' | 'player' | 'enemy' | 'system';

export const BattleLogWindow: React.FC<BattleLogWindowProps> = ({
  logs,
  currentTurn = 'player',
  onClearLogs,
}) => {
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [isScrolledUp, setIsScrolledUp] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const endAnchorRef = useRef<HTMLDivElement>(null);

  // Filtragem das crônicas conforme categoria selecionada
  const filteredLogs = useMemo(() => {
    if (filter === 'all') return logs;
    return logs.filter((log) => log.sender === filter);
  }, [logs, filter]);

  // Rola automaticamente para o fim se autoScroll estiver ativo
  useEffect(() => {
    if (autoScroll && !isScrolledUp) {
      endAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll, isScrolledUp, filter]);

  // Detecta se o jogador rolou para cima manualmente para ler registros antigos
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    // Se a distância for maior que 40px, o usuário rolou para cima
    if (distanceFromBottom > 40) {
      setIsScrolledUp(true);
    } else {
      setIsScrolledUp(false);
    }
  };

  const scrollToBottom = () => {
    setIsScrolledUp(false);
    endAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Cálculo da opacidade com efeito fading-out para entradas mais antigas
  const getEntryOpacity = (index: number, total: number) => {
    const distanceFromLatest = total - 1 - index;
    if (distanceFromLatest <= 0) return 1.0; // Entrada mais recente: 100% nítida
    if (distanceFromLatest === 1) return 0.95;
    if (distanceFromLatest === 2) return 0.85;
    if (distanceFromLatest === 3) return 0.74;
    if (distanceFromLatest === 4) return 0.62;
    if (distanceFromLatest === 5) return 0.52;
    if (distanceFromLatest === 6) return 0.44;
    if (distanceFromLatest === 7) return 0.38;
    return Math.max(0.24, 1 - distanceFromLatest * 0.08); // Desvanecimento progressivo até mínimo legível
  };

  const getBadgeStyle = (log: CombatLogEntry) => {
    if (log.type === 'crit') {
      return {
        badge: '✦ CRÍTICO',
        classes: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
        textColor: 'text-amber-200',
        borderLeft: 'border-l-4 border-amber-400 bg-amber-950/25',
      };
    }
    if (log.type === 'dodge') {
      return {
        badge: '💨 ESQUIVA',
        classes: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
        textColor: 'text-sky-200',
        borderLeft: 'border-l-4 border-sky-400 bg-sky-950/25',
      };
    }
    if (log.type === 'shield') {
      return {
        badge: '🛡️ BLOQUEIO',
        classes: 'bg-yellow-600/20 text-yellow-300 border-yellow-500/40',
        textColor: 'text-yellow-100',
        borderLeft: 'border-l-4 border-yellow-500 bg-yellow-950/20',
      };
    }
    if (log.type === 'heal') {
      return {
        badge: '💚 CURA',
        classes: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
        textColor: 'text-emerald-200',
        borderLeft: 'border-l-4 border-emerald-500 bg-emerald-950/20',
      };
    }
    if (log.type === 'bleed') {
      return {
        badge: '🩸 SANGRAMENTO',
        classes: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        textColor: 'text-rose-300',
        borderLeft: 'border-l-4 border-rose-600 bg-rose-950/30',
      };
    }
    if (log.sender === 'player') {
      return {
        badge: '⚔️ ALARIC',
        classes: 'bg-amber-600/15 text-amber-300 border-amber-600/30',
        textColor: 'text-amber-200/90',
        borderLeft: 'border-l-2 border-amber-500/50 bg-[#16120b]',
      };
    }
    if (log.sender === 'enemy') {
      return {
        badge: '👹 INIMIGO',
        classes: 'bg-red-950/50 text-red-300 border-red-700/40',
        textColor: 'text-red-300',
        borderLeft: 'border-l-2 border-red-600/60 bg-[#170e0e]',
      };
    }
    return {
      badge: '📜 ORDEM',
      classes: 'bg-stone-800 text-stone-300 border-stone-600/40',
      textColor: 'text-stone-300 italic',
      borderLeft: 'border-l-2 border-stone-600/50 bg-[#12100d]',
    };
  };

  return (
    <div className="bg-[#110e0a] border border-[#523e1b] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.6)] overflow-hidden">
      {/* Header do Battle Log */}
      <div className="px-4 py-3 bg-gradient-to-r from-[#1a140d] via-[#16110a] to-[#1a140d] border-b border-[#3d2f16] flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300">
            <Scroll className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold font-cinzel uppercase tracking-wider text-[#f3d484]">
                Battle Log
              </h3>
              <span className="text-[10px] text-[#a88636] font-mono hidden sm:inline">
                • Crônica de Combate
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#2a2012] border border-[#68501c] text-[#f3d484] text-[9px] font-mono font-bold">
                {filteredLogs.length} eventos
              </span>
            </div>
            <p className="text-[10px] text-[#8e7a5c] leading-none mt-0.5 hidden md:block">
              Registro textual das ações com desvanecimento dinâmico de entradas antigas
            </p>
          </div>
        </div>

        {/* Filtros por Categoria e Controles */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center bg-[#1b150f] p-0.5 rounded-lg border border-[#3e2e14] text-[10px]">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-0.5 rounded transition-colors font-medium ${
                filter === 'all'
                  ? 'bg-[#4a3617] text-[#f3d484] font-bold shadow-sm'
                  : 'text-[#9c8a70] hover:text-[#e0cfab]'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('player')}
              className={`px-2 py-0.5 rounded transition-colors font-medium ${
                filter === 'player'
                  ? 'bg-amber-900/60 text-amber-200 font-bold shadow-sm'
                  : 'text-[#9c8a70] hover:text-amber-200'
              }`}
            >
              Alaric
            </button>
            <button
              onClick={() => setFilter('enemy')}
              className={`px-2 py-0.5 rounded transition-colors font-medium ${
                filter === 'enemy'
                  ? 'bg-red-950 text-red-200 font-bold shadow-sm'
                  : 'text-[#9c8a70] hover:text-red-300'
              }`}
            >
              Inimigo
            </button>
            <button
              onClick={() => setFilter('system')}
              className={`px-2 py-0.5 rounded transition-colors font-medium ${
                filter === 'system'
                  ? 'bg-stone-800 text-stone-200 font-bold shadow-sm'
                  : 'text-[#9c8a70] hover:text-stone-300'
              }`}
            >
              Sistema
            </button>
          </div>

          {onClearLogs && (
            <button
              onClick={onClearLogs}
              title="Limpar registros antigos"
              className="px-2 py-1 bg-[#1e1710] hover:bg-[#2b2014] border border-[#4d3a18] text-[#a88636] hover:text-[#f3d484] text-[10px] rounded-md transition-colors"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Janela de Rolagem com Efeito de Desvanecimento (Fade-out) */}
      <div className="relative">
        {/* Máscara de gradiente suave no topo para reforçar o desvanecimento dos registros que sobem */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#110e0a] via-[#110e0a]/80 to-transparent z-10" />

        {/* Container rolável das crônicas */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="h-56 max-h-56 overflow-y-auto px-4 py-3 font-mono text-xs space-y-2 select-text scrollbar-thin scrollbar-thumb-[#4a391a] scrollbar-track-[#120f0b]"
        >
          {filteredLogs.length === 0 ? (
            <div className="py-8 text-center text-stone-500 italic text-xs">
              Nenhum evento registrado nesta categoria.
            </div>
          ) : (
            filteredLogs.map((log, index) => {
              const isLatest = index === filteredLogs.length - 1;
              const opacity = getEntryOpacity(index, filteredLogs.length);
              const styling = getBadgeStyle(log);

              return (
                <div
                  key={log.id}
                  style={{ opacity }}
                  className={`group relative transition-opacity duration-500 ease-out rounded-md p-2 text-xs leading-relaxed border border-[#2b2112]/50 ${styling.borderLeft} ${
                    isLatest ? 'ring-1 ring-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.08)]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold border tracking-wider font-mono ${styling.classes}`}
                      >
                        {styling.badge}
                      </span>
                      {log.timestamp && (
                        <span className="text-[10px] text-[#6d5b43] font-mono select-none">
                          [{log.timestamp}]
                        </span>
                      )}
                    </div>

                    {isLatest && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-400/20 shrink-0 animate-pulse">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Recente</span>
                      </span>
                    )}
                  </div>

                  <div className={`mt-1 pl-0.5 text-xs ${styling.textColor}`}>
                    {log.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={endAnchorRef} />
        </div>

        {/* Botão flutuante "Ir para o mais recente" quando o usuário rolou para cima */}
        {isScrolledUp && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-2.5 right-4 z-20 px-2.5 py-1 bg-amber-600/90 hover:bg-amber-500 text-black text-[11px] font-bold rounded-full shadow-lg border border-amber-300 flex items-center gap-1.5 transition-all transform active:scale-95 animate-bounce"
          >
            <ArrowDown className="w-3 h-3" />
            <span>Ver mais recente</span>
          </button>
        )}
      </div>

      {/* Rodapé informativo discreto */}
      <div className="px-3 py-1.5 bg-[#0d0a07] border-t border-[#261d0f] flex items-center justify-between text-[10px] text-[#7d694d]">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Monitoramento de combate ativo</span>
        </span>
        <span className="font-mono text-[#5a4b37]">
          Turno: {currentTurn === 'player' ? 'Sire Alaric' : 'Inimigo'}
        </span>
      </div>
    </div>
  );
};
