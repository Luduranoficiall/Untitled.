import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ActiveBuff, Character, Enemy, Item, CombatLogEntry } from '../types/game';
import { BESTIARY_DATA } from '../data/bestiaryData';
import { SireAlaricPortrait, EnemyArtwork } from './Artwork';
import { CriticalBurstFX, CriticalType } from './CriticalBurstFX';
import { SmokeEscapeFX } from './SmokeEscapeFX';
import { WeatherOverlay, getWeatherForEnemy } from './WeatherOverlay';
import { BattleLogWindow } from './BattleLogWindow';
import { BuffActivationFX, PersistentBuffAura, BuffFXType } from './BuffActivationFX';
import { EnemyShatterFX } from './EnemyShatterFX';
import { DarkBloodParticlesFX, BloodIntensity } from './DarkBloodParticlesFX';
import { GoldenAscensionParticlesFX } from './GoldenAscensionParticlesFX';
import { Swords, Shield, Heart, Zap, Sparkles, AlertTriangle, ArrowLeft, Trophy, Skull, Footprints, Lightbulb, RefreshCw, CloudRain, X, Music, Volume2, VolumeX } from 'lucide-react';
import { sounds } from '../utils/audio';
import { battleMusic, TRACK_INFO } from '../utils/battleMusic';

interface BattleViewProps {
  character: Character;
  enemy: Enemy;
  onCharacterUpdate: (updated: Partial<Character>) => void;
  onVictory: (enemy: Enemy) => void;
  onFlee: () => void;
  onUseItem: (item: Item) => void;
}

export const BattleView: React.FC<BattleViewProps> = ({
  character,
  enemy,
  onCharacterUpdate,
  onVictory,
  onFlee,
  onUseItem,
}) => {
  const [enemyHp, setEnemyHp] = useState<number>(enemy.hp);
  const [turn, setTurn] = useState<'player' | 'enemy'>('player');
  const [isActing, setIsActing] = useState<boolean>(false);
  const [shieldActive, setShieldActive] = useState<boolean>(false);
  const [battleState, setBattleState] = useState<'in_progress' | 'victory' | 'defeat'>('in_progress');
  const [floatingText, setFloatingText] = useState<{ target: 'player' | 'enemy'; text: string; color: string } | null>(null);
  const [criticalFX, setCriticalFX] = useState<CriticalType | null>(null);
  const [buffActivationFX, setBuffActivationFX] = useState<{ type: BuffFXType; name: string } | null>(null);
  const [enemyShatterCount, setEnemyShatterCount] = useState<number>(0);
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);
  const [isFleeing, setIsFleeing] = useState<boolean>(false);
  const [isWeatherEnabled, setIsWeatherEnabled] = useState<boolean>(true);
  const [activeBuffs, setActiveBuffs] = useState<ActiveBuff[]>([]);
  const [isConsumablesOpen, setIsConsumablesOpen] = useState<boolean>(false);
  const [alaricDamageTrigger, setAlaricDamageTrigger] = useState<number>(0);
  const [isMusicMuted, setIsMusicMuted] = useState<boolean>(!battleMusic.isMusicActive());
  const [enemyBloodFX, setEnemyBloodFX] = useState<{ key: number; intensity: BloodIntensity } | null>(null);
  const [isEnemyJolting, setIsEnemyJolting] = useState<boolean>(false);
  const [goldenEnergyCritKey, setGoldenEnergyCritKey] = useState<number>(0);

  const isLowHp = character.hp < character.maxHp * 0.3;
  const currentMusicTrackId = battleMusic.getTrackForEnemy(enemy.id);
  const musicTrackInfo = TRACK_INFO[currentMusicTrackId];

  // Cálculo agregado de bônus concedidos por elixires e poções temporárias ativas
  const buffBonuses = useMemo(() => {
    let str = 0;
    let dex = 0;
    let con = 0;
    let defense = 0;
    let damageMultiplier = 1.0;
    let flatDamageBonus = 0;
    let dodgeBonus = 0;

    activeBuffs.forEach((b) => {
      if (b.statBonuses?.str) str += b.statBonuses.str;
      if (b.statBonuses?.dex) dex += b.statBonuses.dex;
      if (b.statBonuses?.con) con += b.statBonuses.con;
      if (b.statBonuses?.defense) defense += b.statBonuses.defense;
      if (b.defenseBonus) defense += b.defenseBonus;
      if (b.damageMultiplier && b.damageMultiplier > 1) {
        damageMultiplier *= b.damageMultiplier;
      }
      if (b.flatDamageBonus) flatDamageBonus += b.flatDamageBonus;
      if (b.dodgeBonusPercentage) dodgeBonus += b.dodgeBonusPercentage;
    });

    return { str, dex, con, defense, damageMultiplier, flatDamageBonus, dodgeBonus };
  }, [activeBuffs]);

  const consumablesInInventory = useMemo(() => {
    return character.inventory.filter((i) => i.type === 'consumable');
  }, [character.inventory]);

  const weatherInfo = useMemo(() => getWeatherForEnemy(enemy.id), [enemy.id]);

  const triggerScreenShake = () => {
    setIsScreenShaking(true);
    setTimeout(() => setIsScreenShaking(false), 480);
  };

  const triggerEnemyHitJolt = (intensity: BloodIntensity = 'heavy') => {
    setIsEnemyJolting(false);
    requestAnimationFrame(() => {
      setIsEnemyJolting(true);
    });
    setEnemyBloodFX({ key: Date.now(), intensity });
    sounds.playDarkBloodSlash();
    setTimeout(() => {
      setIsEnemyJolting(false);
    }, 550);
  };

  const handleTriggerFlee = () => {
    if (isFleeing) return;
    setIsFleeing(true);
    battleMusic.stop(true);
    sounds.playSmokeEscape();
    addLog({
      sender: 'player',
      text: '💨 Sire Alaric detona uma bomba de fumaça sagrada e recua com prudência para o acampamento!',
    });
    setTimeout(() => {
      onFlee();
    }, 950);
  };

  const [combatLog, setCombatLog] = useState<CombatLogEntry[]>([
    {
      id: 'log_0',
      sender: 'system',
      text: `${enemy.name} surge com ferocidade em meio à névoa! "${enemy.quote}"`,
      type: 'system',
      timestamp: new Date().toLocaleTimeString('pt-BR', { minute: '2-digit', second: '2-digit' }),
    },
  ]);

  const addLog = (entry: Omit<CombatLogEntry, 'id' | 'timestamp'>) => {
    const timeStr = new Date().toLocaleTimeString('pt-BR', { minute: '2-digit', second: '2-digit' });
    setCombatLog((prev) => [
      ...prev,
      {
        ...entry,
        id: `log_${Date.now()}_${Math.random()}`,
        timestamp: timeStr,
      },
    ]);
  };

  const triggerFloatingText = (target: 'player' | 'enemy', text: string, color: string) => {
    setFloatingText({ target, text, color });
    setTimeout(() => {
      setFloatingText(null);
    }, 1200);
  };

  // Turno do Inimigo (IA automática com delay de 750ms)
  useEffect(() => {
    if (turn === 'enemy' && battleState === 'in_progress') {
      const timer = setTimeout(() => {
        executeEnemyTurn();
      }, 850);
      return () => clearTimeout(timer);
    }
  }, [turn, battleState]);

  // Gerenciamento dinâmico da trilha sonora conforme o monstro e o estado de combate
  useEffect(() => {
    if (battleState === 'in_progress') {
      battleMusic.start(enemy.id, isLowHp);
      setIsMusicMuted(!battleMusic.isMusicActive());
    } else {
      battleMusic.stop(true);
    }

    return () => {
      battleMusic.stop(true);
    };
  }, [enemy.id, battleState]);

  // Atualização em tempo real de tensão musical quando a vida fica crítica (<30%)
  useEffect(() => {
    if (battleState === 'in_progress') {
      battleMusic.updateIntensity(isLowHp);
    }
  }, [isLowHp, battleState]);

  const executeEnemyTurn = () => {
    // Verificar se o jogador tem Hemorragia Severa e aplicar dano contínuo
    const bleedCondition = character.conditions.find((c) => c.severity === 'critico');
    let updatedPlayerHp = character.hp;

    if (bleedCondition && bleedCondition.hpDrainPerTurn) {
      const bleedDmg = bleedCondition.hpDrainPerTurn;
      updatedPlayerHp = Math.max(1, updatedPlayerHp - bleedDmg);
      setAlaricDamageTrigger((prev) => prev + 1);
      sounds.playClick();
      addLog({
        sender: 'system',
        text: `🩸 Hemorragia Severa drena ${bleedDmg} PV de Sire Alaric!`,
        type: 'bleed',
      });
      triggerFloatingText('player', `-${bleedDmg} Sangramento`, '#ef4444');
    }

    // Chance de Esquiva de Sire Alaric baseada na Destreza + Bônus de Agilidade ativa
    const totalDex = character.attributes.dex + buffBonuses.dex;
    const baseDodge = Math.min(0.24, Math.max(0.10, (totalDex - 10) * 0.015));
    const totalDodgeChance = Math.min(0.75, baseDodge + buffBonuses.dodgeBonus);
    const isAlaricDodged = Math.random() < totalDodgeChance;

    if (isAlaricDodged) {
      sounds.playSmokeEscape();
      triggerFloatingText('player', 'ESQUIVOU!', '#38bdf8');
      const hasAgilityBuff = buffBonuses.dodgeBonus > 0;
      addLog({
        sender: 'player',
        text: hasAgilityBuff
          ? `💨 Sire Alaric desvia graciosamente! Sob efeito do Tônico de Agilidade, seus reflexos sobrenaturais evitam totalmente o golpe de ${enemy.name}.`
          : `💨 Sire Alaric dodges the attack! Com reflexos velozes e passos precisos, o golpe de ${enemy.name} corta apenas o ar.`,
        type: 'dodge',
      });

      // Passa a vez para o jogador
      setTurn('player');
      setIsActing(false);
      return;
    }

    // Decisão da IA do Monstro: Especial (35% de chance) ou Golpe Normal
    const isSpecial = Math.random() < 0.35;
    let baseDmg = enemy.attack;
    let attackName = 'um golpe selvagem';

    if (isSpecial) {
      baseDmg = Math.round(enemy.attack * enemy.specialMove.damageMultiplier);
      attackName = enemy.specialMove.name;
      setCriticalFX('dark');
      triggerScreenShake();
      sounds.playDarkCriticalHit();
    } else {
      sounds.playMonsterHit();
    }

    // Mitigação por Armadura de Alaric, Constituição e Elixir de Armadura de Ferro
    const playerDef =
      (character.equipment.armor?.stats?.defense || 0) +
      ((character.attributes.con + buffBonuses.con) / 2) +
      buffBonuses.defense;
    let finalDmg = Math.max(2, Math.round(baseDmg - playerDef * 0.4));

    if (shieldActive) {
      finalDmg = Math.max(1, Math.round(finalDmg * 0.35));
      setShieldActive(false);
      addLog({
        sender: 'player',
        text: `🛡️ Sire Alaric absorveu o impacto com o Escudo Sagrado! Dano reduzido para ${finalDmg}.`,
        type: 'shield',
      });
    }

    updatedPlayerHp = Math.max(0, updatedPlayerHp - finalDmg);
    setAlaricDamageTrigger((prev) => prev + 1);
    triggerFloatingText('player', `-${finalDmg} PV`, '#dc2626');

    if (isSpecial) {
      addLog({
        sender: 'enemy',
        text: `👹 ${enemy.name} desfere ${attackName}! Um golpe brutal e impiedoso atinge Sire Alaric causando ${finalDmg} de dano!`,
        type: 'damage',
      });
    } else {
      addLog({
        sender: 'enemy',
        text: `⚔️ ${enemy.name} avança com ferocidade, desferindo ${attackName} e causando ${finalDmg} de dano a Sire Alaric!`,
        type: 'damage',
      });
    }

    onCharacterUpdate({ hp: updatedPlayerHp });

    if (updatedPlayerHp <= 0) {
      setBattleState('defeat');
      battleMusic.stop(true);
      addLog({
        sender: 'system',
        text: '☠️ Sire Alaric foi subjugado pela escuridão! Seus votos de paladino impedem a morte definitiva, mas é preciso recuperar forças.',
        type: 'system',
      });
    }
 else {
      // Decrementar a duração dos elixires e poções temporárias ativas
      setActiveBuffs((prevBuffs) => {
        if (prevBuffs.length === 0) return prevBuffs;
        const nextBuffs: ActiveBuff[] = [];
        prevBuffs.forEach((b) => {
          const remaining = b.turnsRemaining - 1;
          if (remaining > 0) {
            nextBuffs.push({ ...b, turnsRemaining: remaining });
          } else {
            sounds.playClick();
            addLog({
              sender: 'system',
              text: `⏳ O efeito de [${b.name}] expirou e sua energia se dissipou de Sire Alaric.`,
              type: 'system',
            });
            triggerFloatingText('player', `${b.name} Expirou`, '#94a3b8');
          }
        });
        return nextBuffs;
      });

      setTurn('player');
      setIsActing(false);
    }
  };

  // Ações do Jogador
  const handlePlayerAttack = () => {
    if (turn !== 'player' || isActing || battleState !== 'in_progress') return;
    setIsActing(true);

    // Chance de Esquiva do Inimigo (ex: 12% para espectro/goblin, 8% para os demais)
    const enemyDodgeChance = enemy.id === 'espectro_abissal' ? 0.16 : 0.09;
    const isEnemyDodged = Math.random() < enemyDodgeChance;

    if (isEnemyDodged) {
      sounds.playClick();
      triggerFloatingText('enemy', 'ESQUIVOU!', '#94a3b8');
      addLog({
        sender: 'enemy',
        text: `💨 Enemy dodges the attack! ${enemy.name} esquiva-se velozmente, e a lâmina de Alaric corta apenas o vento.`,
        type: 'dodge',
      });
      setTimeout(() => {
        setTurn('enemy');
      }, 700);
      return;
    }

    // Dano baseado em Força + Dano da Arma + Multiplicador de Força Elevada
    const weaponAtk = character.equipment.weapon?.stats?.attack || 6;
    const totalStr = character.attributes.str + buffBonuses.str;
    const strBonus = Math.floor(totalStr / 2);
    // Destreza total incluindo Tônico de Agilidade concede bônus de chance crítica
    const totalDex = character.attributes.dex + buffBonuses.dex;
    const critBonus = Math.max(0, (totalDex - 12) * 0.02);
    const critChance = Math.min(0.65, 0.22 + critBonus);
    const isCrit = Math.random() < critChance;
    const critMult = isCrit ? 1.85 : 1.0;
    let rawDmg = (weaponAtk + strBonus + Math.floor(Math.random() * 5)) * critMult;
    if (buffBonuses.damageMultiplier > 1) {
      rawDmg *= buffBonuses.damageMultiplier;
    }
    rawDmg += buffBonuses.flatDamageBonus;
    const finalDmg = Math.max(4, Math.round(rawDmg - Math.floor(enemy.defense * 0.3)));

    const hasMightBuff = buffBonuses.damageMultiplier > 1;

    if (isCrit) {
      setCriticalFX('holy');
      sounds.playHolyCriticalHit();
      sounds.playShatterCrit();
      setEnemyShatterCount((prev) => prev + 1);
      setGoldenEnergyCritKey(Date.now());
      triggerEnemyHitJolt('critical');
    } else if (hasMightBuff) {
      sounds.playSwordClash();
      triggerEnemyHitJolt('brutal');
    } else {
      sounds.playSwordClash();
      triggerEnemyHitJolt('heavy');
    }

    const newEnemyHp = Math.max(0, enemyHp - finalDmg);
    setEnemyHp(newEnemyHp);
    triggerFloatingText(
      'enemy',
      `-${finalDmg} ${isCrit ? '✦ CRÍTICO!' : hasMightBuff ? '⚡ FORÇA!' : ''}`,
      isCrit ? '#f59e0b' : hasMightBuff ? '#f87171' : '#ef4444'
    );

    if (isCrit) {
      addLog({
        sender: 'player',
        text: `✦ Sire Alaric lands a mighty blow! ${hasMightBuff ? 'Imbuído de Força Elevada, seu' : 'Um'} golpe crítico reluzente abre uma ferida brutal em ${enemy.name}, fazendo jorrar sangue sombrio com ${finalDmg} de dano!`,
        type: 'crit',
      });
    } else if (hasMightBuff) {
      addLog({
        sender: 'player',
        text: `⚡ Força Elevada potencializa a investida! Sire Alaric dilacera a criatura em um espirro violento de sangue sombrio, causando ${finalDmg} de dano devastador contra ${enemy.name}!`,
        type: 'damage',
      });
    } else {
      addLog({
        sender: 'player',
        text: `⚔️ Sire Alaric desfere um corte pesado com ${character.equipment.weapon?.name || 'sua lâmina'}, rasgando a carne escura de ${enemy.name} em sangue sombrio com ${finalDmg} de dano!`,
        type: 'damage',
      });
    }

    checkEnemyDefeated(newEnemyHp);
  };

  const handleUseConsumableInBattle = (item: Item) => {
    if (turn !== 'player' || isActing || battleState !== 'in_progress') return;

    onUseItem(item);

    if (item.consumableEffect?.buff) {
      const buffConfig = item.consumableEffect.buff;
      setActiveBuffs((prev) => {
        const existingIdx = prev.findIndex((b) => b.id === buffConfig.id);
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            turnsRemaining: buffConfig.durationTurns,
            damageMultiplier: buffConfig.damageMultiplier,
            flatDamageBonus: buffConfig.flatDamageBonus,
            dodgeBonusPercentage: buffConfig.dodgeBonusPercentage,
            defenseBonus: buffConfig.defenseBonus,
            type: buffConfig.type,
          };
          return updated;
        } else {
          return [
            ...prev,
            {
              id: buffConfig.id,
              name: buffConfig.name,
              description: buffConfig.description,
              icon: buffConfig.icon,
              turnsRemaining: buffConfig.durationTurns,
              statBonuses: buffConfig.statBonuses,
              damageMultiplier: buffConfig.damageMultiplier,
              flatDamageBonus: buffConfig.flatDamageBonus,
              dodgeBonusPercentage: buffConfig.dodgeBonusPercentage,
              defenseBonus: buffConfig.defenseBonus,
              type: buffConfig.type,
            },
          ];
        }
      });
      const buffType: BuffFXType =
        buffConfig.type ||
        (buffConfig.id.includes('might')
          ? 'strength'
          : buffConfig.id.includes('swift')
          ? 'agility'
          : 'armor');
      setBuffActivationFX({ type: buffType, name: buffConfig.name });
      sounds.playHolyCriticalHit();
      triggerFloatingText('player', `✦ ${buffConfig.name}!`, '#fbbf24');
      addLog({
        sender: 'player',
        text: `⚗️ Sire Alaric ingere ${item.name}! Concede o efeito [${buffConfig.name}] (${buffConfig.description}) por ${buffConfig.durationTurns} turnos!`,
        type: 'buff',
      });
    } else {
      sounds.playHealSpell();
      if (item.consumableEffect?.healHp) {
        triggerFloatingText('player', `+${item.consumableEffect.healHp} PV`, '#34d399');
      }
      if (item.consumableEffect?.healMp) {
        triggerFloatingText('player', `+${item.consumableEffect.healMp} PM`, '#60a5fa');
      }
      addLog({
        sender: 'player',
        text: `🧪 Sire Alaric consumiu ${item.name}!`,
        type: 'heal',
      });
    }

    setIsConsumablesOpen(false);

    // Beber um consumível consome a ação do turno e passa a vez para a criatura
    setIsActing(true);
    setTimeout(() => {
      setTurn('enemy');
    }, 600);
  };

  const handlePlayerSmite = () => {
    if (turn !== 'player' || isActing || battleState !== 'in_progress') return;
    if (character.mp < 15) {
      addLog({ sender: 'system', text: 'Mana insuficiente para Castigo Divino (Requer 15 PM)!', type: 'system' });
      return;
    }

    setIsActing(true);
    setCriticalFX('holy');
    sounds.playHolyCriticalHit();
    sounds.playShatterCrit();
    setEnemyShatterCount((prev) => prev + 1);
    setGoldenEnergyCritKey(Date.now());
    triggerEnemyHitJolt('brutal');

    const newMp = character.mp - 15;
    onCharacterUpdate({ mp: newMp });

    // Dano Sagrado penetra defesas e é sempre um acerto crítico abençoado!
    const wisBonus = Math.floor(character.attributes.wis * 1.5);
    const holyDmg = Math.round(28 + wisBonus + Math.random() * 10);
    const newEnemyHp = Math.max(0, enemyHp - holyDmg);

    setEnemyHp(newEnemyHp);
    triggerFloatingText('enemy', `-${holyDmg} SAGRADO!`, '#fbbf24');

    addLog({
      sender: 'player',
      text: `✨ Sire Alaric invoca o CASTIGO DIVINO! Um feixe sagrado rasga a escuridão causando ${holyDmg} de dano crítico purificador!`,
      type: 'crit',
    });

    checkEnemyDefeated(newEnemyHp);
  };

  const handlePlayerHeal = () => {
    if (turn !== 'player' || isActing || battleState !== 'in_progress') return;
    if (character.mp < 12) {
      addLog({ sender: 'system', text: 'Mana insuficiente para Imposição de Mãos (Requer 12 PM)!', type: 'system' });
      return;
    }

    setIsActing(true);
    sounds.playHealSpell();

    const healAmount = 40 + Math.floor(character.attributes.wis * 1.2);
    const newHp = Math.min(character.maxHp, character.hp + healAmount);
    const newMp = character.mp - 12;

    // Remove hemorragia severa
    const cleanedConditions = character.conditions.filter((c) => c.severity !== 'critico');

    onCharacterUpdate({
      hp: newHp,
      mp: newMp,
      conditions: cleanedConditions,
    });

    triggerFloatingText('player', `+${healAmount} PV`, '#34d399');

    addLog({
      sender: 'player',
      text: `💚 Imposição de Mãos! Sire Alaric canaliza a graça solar restaurando ${healAmount} PV e curando ferimentos abertos.`,
      type: 'heal',
    });

    // Passa o turno para o inimigo
    setTimeout(() => {
      setTurn('enemy');
    }, 600);
  };

  const handleShieldStance = () => {
    if (turn !== 'player' || isActing || battleState !== 'in_progress') return;
    setIsActing(true);
    sounds.playClick();
    setShieldActive(true);

    addLog({
      sender: 'player',
      text: '🛡️ Sire Alaric assume postura defensiva inabalável com o escudo de Solis! Próximo ataque inimigo será bloqueado.',
      type: 'shield',
    });

    setTimeout(() => {
      setTurn('enemy');
    }, 500);
  };

  const checkEnemyDefeated = (newEnemyHp: number) => {
    if (newEnemyHp <= 0) {
      setBattleState('victory');
      battleMusic.stop(true);
      sounds.playLevelUpFanfare();
      addLog({
        sender: 'system',
        text: `🏆 VITÓRIA! ${enemy.name} foi derrotado por Sire Alaric!`,
      });
      onVictory(enemy);
    } else {
      setTimeout(() => {
        setTurn('enemy');
      }, 700);
    }
  };

  const usablePotion = character.inventory.find(
    (i) => i.consumableEffect?.healHp || i.consumableEffect?.healMp || i.consumableEffect?.cureBleed
  );

  const enemyHpPercent = Math.min(100, Math.max(0, (enemyHp / enemy.maxHp) * 100));
  const playerHpPercent = Math.min(100, Math.max(0, (character.hp / character.maxHp) * 100));

  const [activeTipIdx, setActiveTipIdx] = useState<number>(0);

  // Lista de Dicas Táticas baseadas nas fraquezas do inimigo e recursos vitais
  const tacticalTips = useMemo(() => {
    const list: {
      title: string;
      text: string;
      actionText?: string;
      actionType?: 'heal' | 'shield' | 'potion' | 'flee';
    }[] = [];

    const bestiaryEntry = BESTIARY_DATA[enemy.id];

    if (bestiaryEntry) {
      list.push({
        title: `Ponto Fraco de ${enemy.name}`,
        text: `Fraqueza Crítica: ${bestiaryEntry.weakness} Concentre seus recursos ofensivos nesta brecha!`,
      });
      list.push({
        title: `Conselho Tático Específico`,
        text: `${bestiaryEntry.tacticalTip}`,
      });
    }

    if (character.mp >= 12) {
      list.push({
        title: 'Graça Sagrada Disponível',
        text: 'Você possui mana sagrada suficiente! Execute "Imposição de Mãos" para restaurar +40 PV e dissipar hemorragias.',
        actionText: 'Conjurar Imposição de Mãos (12 MP)',
        actionType: 'heal',
      });
    }

    const potion = character.inventory.find((i) => i.consumableEffect?.healHp);
    if (potion) {
      list.push({
        title: 'Consumível Vital na Mochila',
        text: `Você possui ${potion.name}! Beba agora para recuperar vida sem esperar pelo próximo golpe inimigo.`,
        actionText: `Beber ${potion.name}`,
        actionType: 'potion',
      });
    }

    list.push({
      title: 'Mitigação com Escudo Sagrado',
      text: 'Com vida em estado crítico, erga o Escudo de Solis para reduzir em 65% o próximo dano inimigo e ganhar fôlego.',
      actionText: 'Erguer Escudo Protetor',
      actionType: 'shield',
    });

    list.push({
      title: 'Retirada Estratégica da Ordem',
      text: 'Não sacrifique sua vida em vão. Lance a Bomba de Fumaça para recuar com honra ao acampamento e recompor suas forças.',
      actionText: 'Lançar Bomba de Fumaça & Fugir',
      actionType: 'flee',
    });

    return list;
  }, [enemy.id, character.mp, character.inventory]);

  const currentTip = tacticalTips[activeTipIdx % tacticalTips.length];

  return (
    <div className={`space-y-6 relative ${isFleeing ? 'animate-arena-fade pointer-events-none' : ''}`}>
      {isFleeing && <SmokeEscapeFX />}

      {/* Barra de Navegação do Combate */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleTriggerFlee}
          disabled={isFleeing}
          className="flex items-center gap-1.5 text-xs text-[#a88636] hover:text-[#f3d484] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retornar ao Acampamento</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Indicador e Controle de Música de Combate Adaptativa */}
          <button
            onClick={() => {
              const muted = battleMusic.toggleMute();
              setIsMusicMuted(muted);
            }}
            title={
              isMusicMuted
                ? 'Música de Combate Mutada (Clique para Ativar)'
                : `Trilha Sonora Dinâmica: ${musicTrackInfo.title} · ${musicTrackInfo.subtitle} (${isLowHp ? 'Alta Tensão: Batimentos e Ritmo Acelerados' : 'Ritmo Padrão'})`
            }
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-medium transition-all ${
              !isMusicMuted
                ? isLowHp
                  ? 'bg-rose-950/80 border-rose-500/80 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.35)] animate-pulse'
                  : 'bg-[#1e1913] border-[#8e6e23] text-amber-200 shadow-sm'
                : 'bg-[#14120e] border-[#3d3119] text-[#7d6b54] opacity-70'
            }`}
          >
            <span>{isMusicMuted ? '🔇' : musicTrackInfo.icon}</span>
            <span className="hidden sm:inline font-cinzel">
              {isMusicMuted ? 'Música Mutada' : musicTrackInfo.title}
            </span>
            {isLowHp && !isMusicMuted && (
              <span className="text-[9px] px-1 bg-red-900/90 text-red-200 rounded font-bold uppercase tracking-wider">
                Tensão
              </span>
            )}
          </button>

          {/* Indicador de Clima Dinâmico Conforme o Inimigo */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsWeatherEnabled((prev) => !prev);
            }}
            title={isWeatherEnabled ? 'Desativar efeitos de clima' : 'Ativar efeitos de clima'}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-medium transition-all ${
              isWeatherEnabled
                ? 'bg-[#1e1913] border-[#8e6e23] text-[#f3d484] shadow-sm'
                : 'bg-[#14120e] border-[#3d3119] text-[#7d6b54] line-through'
            }`}
          >
            <span>{weatherInfo.icon}</span>
            <span className="hidden sm:inline">{weatherInfo.label}</span>
          </button>

          <span
            className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
              turn === 'player'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
            }`}
          >
            {turn === 'player' ? 'Seu Turno de Ação' : 'Turno da Besta...'}
          </span>
        </div>
      </div>

      {/* Arena de Duelo (Visão Split dos Lutadores com Clima Dinâmico, Efeitos Críticos e Tremor) */}
      <div className={`relative rounded-2xl overflow-hidden ${isScreenShaking ? 'animate-screen-shake' : ''}`}>
        {/* Overlay de Clima Dinâmico (Chuva / Neblina / Cinzas) */}
        {isWeatherEnabled && <WeatherOverlay weather={weatherInfo.type} />}

        {criticalFX && (
          <CriticalBurstFX
            type={criticalFX}
            onComplete={() => setCriticalFX(null)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lado de Alaric */}
        <div className={`bg-[#18140f] border rounded-xl p-5 shadow-lg relative transition-all ${
          turn === 'player' ? 'border-[#c59b27] shadow-[0_0_20px_rgba(197,155,39,0.2)]' : 'border-[#3d3119]'
        }`}>
          {floatingText?.target === 'player' && (
            <div
              className="absolute top-4 right-4 text-base font-black px-3 py-1 rounded bg-black/80 border border-current shadow-lg animate-bounce z-30"
              style={{ color: floatingText.color }}
            >
              {floatingText.text}
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="relative shrink-0 flex items-center justify-center">
              <SireAlaricPortrait size="md" damageKey={alaricDamageTrigger} />
              <PersistentBuffAura activeBuffs={activeBuffs} />
              {buffActivationFX && (
                <BuffActivationFX
                  type={buffActivationFX.type}
                  buffName={buffActivationFX.name}
                  onComplete={() => setBuffActivationFX(null)}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-[#a88636]">Cavaleiro Sagrado</span>
              <h2 className="text-lg font-bold text-[#f3d484] truncate">{character.name}</h2>
              <div className="text-xs text-[#bdae93]">Nível {character.level} · Paladino</div>

              {/* HP Bar */}
              <div className="mt-2.5">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-red-400 font-semibold flex items-center gap-1">
                    <Heart className="w-3 h-3 text-red-500" /> HP
                  </span>
                  <span className="font-mono tabular-nums text-red-200">
                    {character.hp} / {character.maxHp}
                  </span>
                </div>
                <div className="h-2 w-full bg-[#241717] rounded-full overflow-hidden border border-red-950">
                  <div
                    className="h-full bg-gradient-to-r from-red-700 to-amber-500 transition-all duration-300"
                    style={{ width: `${playerHpPercent}%` }}
                  />
                </div>
              </div>

              {/* MP Bar */}
              <div className="mt-1.5">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-blue-400 font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-blue-400" /> MP
                  </span>
                  <span className="font-mono tabular-nums text-blue-200">
                    {character.mp} / {character.maxMp}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#121c2c] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-700 to-cyan-400 transition-all duration-300"
                    style={{ width: `${(character.mp / character.maxMp) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sistema de Efeitos de Estado (Buffs de Combate) sob o Retrato e HP */}
          <div className="mt-3.5 pt-3 border-t border-[#3d3119]/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37] font-cinzel">
                  Efeitos de Estado Ativos
                </span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${
                  activeBuffs.length > 0
                    ? 'bg-amber-950/90 text-amber-300 border-amber-600/70'
                    : 'bg-[#201910] text-[#8c7b64] border-[#3d3119]'
                }`}>
                  {activeBuffs.length} {activeBuffs.length === 1 ? 'ativo' : 'ativos'}
                </span>
              </div>

              {turn === 'player' && battleState === 'in_progress' && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsConsumablesOpen(true);
                  }}
                  className="text-[10px] text-amber-300 hover:text-amber-200 hover:underline flex items-center gap-1 transition-colors"
                  title="Abrir bolsa de elixires e poções"
                >
                  <span>⚗️</span>
                  <span>Usar Elixir</span>
                </button>
              )}
            </div>

            {activeBuffs.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {activeBuffs.map((buff) => {
                  const isLastTurn = buff.turnsRemaining === 1;
                  const isStrength = buff.type === 'strength' || buff.id.includes('might');
                  const isAgility = buff.type === 'agility' || buff.id.includes('swiftness');
                  const isArmor = buff.type === 'armor' || buff.id.includes('iron');

                  const colorStyles = isStrength
                    ? 'bg-gradient-to-r from-rose-950/70 via-[#2a1215] to-[#1e1315] border-rose-600/70 text-rose-200 shadow-[0_0_12px_rgba(225,29,72,0.18)]'
                    : isAgility
                    ? 'bg-gradient-to-r from-cyan-950/70 via-[#0e272b] to-[#121c22] border-cyan-500/70 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.18)]'
                    : isArmor
                    ? 'bg-gradient-to-r from-amber-950/70 via-[#292010] to-[#1a160d] border-amber-500/70 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.18)]'
                    : 'bg-gradient-to-r from-amber-950/50 to-[#18140f] border-amber-500/50 text-amber-200';

                  const badgeStyles = isLastTurn
                    ? 'bg-red-950 text-red-200 border-red-500 animate-pulse font-extrabold'
                    : isStrength
                    ? 'bg-rose-900/60 text-rose-300 border-rose-500/60'
                    : isAgility
                    ? 'bg-cyan-900/60 text-cyan-300 border-cyan-500/60'
                    : 'bg-amber-900/60 text-amber-300 border-amber-500/60';

                  return (
                    <div
                      key={buff.id}
                      className={`p-2 rounded-lg border transition-all relative group flex items-center justify-between gap-2.5 ${colorStyles}`}
                      title={`${buff.name}: ${buff.description} (${buff.turnsRemaining} turnos restantes)`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-md bg-black/40 border border-current/30 flex items-center justify-center text-sm shrink-0 shadow-inner">
                          {buff.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold truncate tracking-wide">
                              {buff.name}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1 text-[10px] opacity-90">
                            {buff.damageMultiplier && buff.damageMultiplier > 1 && (
                              <span className="font-semibold text-rose-300">
                                +{Math.round((buff.damageMultiplier - 1) * 100)}% Dano
                              </span>
                            )}
                            {buff.dodgeBonusPercentage && (
                              <span className="font-semibold text-cyan-300">
                                +{Math.round(buff.dodgeBonusPercentage * 100)}% Esquiva
                              </span>
                            )}
                            {buff.defenseBonus && (
                              <span className="font-semibold text-amber-300">
                                +{buff.defenseBonus} Defesa
                              </span>
                            )}
                            {buff.statBonuses?.str && (
                              <span className="text-[9px] text-[#f3d484]">
                                (+{buff.statBonuses.str} FOR)
                              </span>
                            )}
                            {buff.statBonuses?.dex && (
                              <span className="text-[9px] text-[#f3d484]">
                                (+{buff.statBonuses.dex} DES)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Contador de Turnos */}
                      <div className="flex items-center gap-1 shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border flex items-center gap-1 ${badgeStyles}`}>
                          <span>⏳</span>
                          <span>
                            {buff.turnsRemaining} {buff.turnsRemaining === 1 ? 'Turno' : 'Turnos'}
                          </span>
                        </span>
                        {isLastTurn && (
                          <span
                            className="hidden sm:inline-block px-1.5 py-0.5 bg-red-600/30 text-red-300 text-[9px] font-bold rounded border border-red-500/50 uppercase"
                            title="Este efeito expira ao final desta rodada!"
                          >
                            Último!
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-[#14100c] border border-[#2d2312] flex items-center justify-between text-[11px] text-[#8c7b64]">
                <div className="flex items-center gap-2">
                  <span className="text-sm opacity-60">⚗️</span>
                  <span>Sem buffs ativos. Beba elixires para +Força, +Agilidade ou +Armadura.</span>
                </div>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsConsumablesOpen(true);
                  }}
                  disabled={turn !== 'player' || isActing || battleState !== 'in_progress'}
                  className="px-2 py-0.5 rounded bg-[#251e14] hover:bg-[#382d1b] border border-[#523e1b] text-amber-300 hover:text-amber-200 text-[10px] font-bold shrink-0 transition-colors ml-2"
                >
                  Bolsa
                </button>
              </div>
            )}
          </div>

          {shieldActive && (
            <div className="mt-3 py-1.5 px-3 bg-amber-950/40 border border-amber-600/50 rounded-lg text-amber-300 text-xs flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Escudo levantado: 65% de mitigação no próximo golpe.</span>
            </div>
          )}
        </div>

        {/* Lado do Inimigo */}
        <div className={`bg-[#18140f] border rounded-xl p-5 shadow-lg relative transition-all ${
          turn === 'enemy' ? 'border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.25)]' : 'border-[#3d3119]'
        }`}>
          {floatingText?.target === 'enemy' && (
            <div
              className="absolute top-4 left-4 text-base font-black px-3 py-1 rounded bg-black/80 border border-current shadow-lg animate-bounce z-30"
              style={{ color: floatingText.color }}
            >
              {floatingText.text}
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className={`relative shrink-0 ${(enemyShatterCount > 0 || isEnemyJolting) ? 'animate-enemy-crit-jolt' : ''}`}>
              <EnemyArtwork enemyId={enemy.id} className="w-24 h-24 sm:w-28 sm:h-28" />
              {enemyBloodFX && (
                <DarkBloodParticlesFX
                  key={`blood_${enemyBloodFX.key}`}
                  intensity={enemyBloodFX.intensity}
                  onComplete={() => setEnemyBloodFX(null)}
                />
              )}
              {enemyShatterCount > 0 && (
                <EnemyShatterFX
                  key={enemyShatterCount}
                  onComplete={() => setEnemyShatterCount(0)}
                />
              )}
              {goldenEnergyCritKey > 0 && (
                <GoldenAscensionParticlesFX
                  key={`gold_${goldenEnergyCritKey}`}
                  onComplete={() => setGoldenEnergyCritKey(0)}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-red-400">Inimigo Desafiante</span>
              <h2 className="text-lg font-bold text-red-200 truncate">{enemy.name}</h2>
              <div className="text-xs text-[#bdae93]">Nível {enemy.level} · {enemy.title}</div>

              {/* Enemy HP */}
              <div className="mt-2.5">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-red-400 font-semibold flex items-center gap-1">
                    <Skull className="w-3 h-3 text-red-500" /> Vitalidade
                  </span>
                  <span className="font-mono tabular-nums text-red-200">
                    {enemyHp} / {enemy.maxHp}
                  </span>
                </div>
                <div className="h-2 w-full bg-[#241717] rounded-full overflow-hidden border border-red-950">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 transition-all duration-300"
                    style={{ width: `${enemyHpPercent}%` }}
                  />
                </div>
              </div>

              <div className="mt-2 text-[11px] text-[#a88636] italic">
                Ataque: {enemy.attack} · Defesa: {enemy.defense}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Sistema de Dicas Táticas (Aparece estritamente quando HP < 30%) */}
      {isLowHp && currentTip && (
        <div className="bg-gradient-to-r from-[#241708] via-[#1c1207] to-[#251009] border-2 border-amber-500/80 rounded-xl p-4 shadow-[0_0_24px_rgba(245,158,11,0.22)] relative overflow-hidden animate-in fade-in slide-in-from-top-2">
          {/* Luz ambiente de alerta */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300 shrink-0 mt-0.5 animate-pulse">
                <Lightbulb className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-700/60">
                    Vitalidade Crítica ({Math.round(playerHpPercent)}% HP)
                  </span>
                  <span className="text-xs font-bold text-amber-300 font-cinzel">
                    Conselho Tático: {currentTip.title}
                  </span>
                </div>

                <p className="text-xs text-[#ede4d1] mt-1.5 leading-relaxed">
                  {currentTip.text}
                </p>

                {currentTip.actionText && (
                  <div className="mt-2.5 flex items-center gap-2">
                    {currentTip.actionType === 'heal' && character.mp >= 12 && (
                      <button
                        onClick={handlePlayerHeal}
                        disabled={turn !== 'player' || isActing || battleState !== 'in_progress'}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-md shadow transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>{currentTip.actionText}</span>
                      </button>
                    )}
                    {currentTip.actionType === 'shield' && (
                      <button
                        onClick={handleShieldStance}
                        disabled={turn !== 'player' || isActing || battleState !== 'in_progress'}
                        className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs rounded-md shadow transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>{currentTip.actionText}</span>
                      </button>
                    )}
                    {currentTip.actionType === 'potion' && usablePotion && (
                      <button
                        onClick={() => {
                          sounds.playHealSpell();
                          onUseItem(usablePotion);
                        }}
                        className="px-3 py-1.5 bg-[#8e6e23] hover:bg-[#a87c22] text-black font-bold text-xs rounded-md shadow transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        <span>🧪</span>
                        <span>{currentTip.actionText}</span>
                      </button>
                    )}
                    {currentTip.actionType === 'flee' && (
                      <button
                        onClick={handleTriggerFlee}
                        disabled={isFleeing}
                        className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-200 font-bold text-xs rounded-md shadow transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        <span>💨</span>
                        <span>{currentTip.actionText}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveTipIdx((prev) => (prev + 1) % tacticalTips.length);
              }}
              title="Trocar conselho tático"
              className="px-2.5 py-1.5 rounded-lg bg-[#251e14] hover:bg-[#382d1b] border border-[#68501c] text-amber-300 hover:text-amber-200 transition-colors shrink-0 flex items-center gap-1.5 text-[11px]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Outro Conselho</span>
            </button>
          </div>
        </div>
      )}

      {/* Painel de Ações do Jogador */}
      <div className="bg-[#18140f] border border-[#785b20] rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-[#3d3119] mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#f3d484] flex items-center gap-2">
            <Swords className="w-4 h-4 text-[#c59b27]" />
            Comandos de Combate
          </h3>
          <span className="text-xs text-[#a88636]">
            {turn === 'player' ? 'Escolha sua jogada sagrada' : 'Aguarde o golpe da besta...'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Ataque Físico */}
          <button
            onClick={handlePlayerAttack}
            disabled={turn !== 'player' || isActing || battleState !== 'in_progress'}
            className="p-3 bg-[#201910] hover:bg-[#2c2214] disabled:opacity-50 disabled:pointer-events-none border border-[#8e6e23] rounded-lg text-left transition-all active:scale-95 group"
          >
            <div className="flex items-center justify-between text-[#f3d484] font-bold text-xs mb-1">
              <span className="flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5 text-amber-400" />
                Golpe Sagrado
              </span>
              <span className="text-[10px] text-amber-300 font-mono">0 MP</span>
            </div>
            <p className="text-[10px] text-[#bdae93] leading-tight">
              Ataque de corte com a lâmina do herói.
            </p>
          </button>

          {/* Castigo Divino */}
          <button
            onClick={handlePlayerSmite}
            disabled={turn !== 'player' || isActing || battleState !== 'in_progress' || character.mp < 15}
            className="p-3 bg-[#1d1b26] hover:bg-[#282538] disabled:opacity-50 disabled:pointer-events-none border border-amber-500/50 rounded-lg text-left transition-all active:scale-95 group"
          >
            <div className="flex items-center justify-between text-amber-200 font-bold text-xs mb-1">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                Castigo Divino
              </span>
              <span className="text-[10px] text-blue-300 font-mono">15 MP</span>
            </div>
            <p className="text-[10px] text-amber-100/70 leading-tight">
              Raio radiante que perfura couraças com dano sagrado.
            </p>
          </button>

          {/* Imposição de Mãos */}
          <button
            onClick={handlePlayerHeal}
            disabled={turn !== 'player' || isActing || battleState !== 'in_progress' || character.mp < 12}
            className="p-3 bg-[#12221b] hover:bg-[#1a3328] disabled:opacity-50 disabled:pointer-events-none border border-emerald-500/50 rounded-lg text-left transition-all active:scale-95 group"
          >
            <div className="flex items-center justify-between text-emerald-200 font-bold text-xs mb-1">
              <span className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-emerald-400" />
                Imposição de Mãos
              </span>
              <span className="text-[10px] text-blue-300 font-mono">12 MP</span>
            </div>
            <p className="text-[10px] text-emerald-100/70 leading-tight">
              Cura +40 PV e estanca hemorragias ativas.
            </p>
          </button>

          {/* Postura de Escudo */}
          <button
            onClick={handleShieldStance}
            disabled={turn !== 'player' || isActing || battleState !== 'in_progress'}
            className="p-3 bg-[#201910] hover:bg-[#2c2214] disabled:opacity-50 disabled:pointer-events-none border border-[#8e6e23] rounded-lg text-left transition-all active:scale-95 group"
          >
            <div className="flex items-center justify-between text-[#f3d484] font-bold text-xs mb-1">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                Erguer Escudo
              </span>
              <span className="text-[10px] text-amber-300 font-mono">0 MP</span>
            </div>
            <p className="text-[10px] text-[#bdae93] leading-tight">
              Reduz o próximo impacto inimigo em 65%.
            </p>
          </button>
        </div>

        {/* Ações de Suporte: Bolsa de Consumíveis, Poção Rápida e Fuga Tática */}
        <div className="mt-4 pt-3 border-t border-[#3d3119] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Botão de Abrir Bolsa de Consumíveis */}
            <button
              onClick={() => {
                sounds.playClick();
                setIsConsumablesOpen(true);
              }}
              disabled={turn !== 'player' || isActing || battleState !== 'in_progress'}
              className="px-3 py-1.5 bg-gradient-to-r from-[#2c1e0e] to-[#3a2710] hover:from-[#3a2710] hover:to-[#4e3415] disabled:opacity-50 disabled:pointer-events-none border border-[#c59b27]/70 text-[#f3d484] text-xs font-bold rounded-lg flex items-center gap-2 transition-all shadow-sm active:scale-95"
            >
              <span className="text-sm">⚗️</span>
              <span>Bolsa de Consumíveis</span>
              <span className="px-1.5 py-0.2 bg-[#c59b27]/30 text-amber-300 rounded font-mono text-[10px]">
                {consumablesInInventory.length}
              </span>
            </button>

            {/* Acesso Rápido ao Primeiro Consumível */}
            {usablePotion && (
              <button
                onClick={() => handleUseConsumableInBattle(usablePotion)}
                disabled={turn !== 'player' || isActing || battleState !== 'in_progress'}
                className="px-2.5 py-1.5 bg-[#8e6e23]/30 hover:bg-[#8e6e23]/50 disabled:opacity-50 disabled:pointer-events-none border border-[#8e6e23] text-amber-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                title={`Beber rapidamente ${usablePotion.name}`}
              >
                <span>{usablePotion.icon}</span>
                <span className="hidden sm:inline">Rápido: {usablePotion.name}</span>
                <span className="sm:hidden">Beber</span>
              </button>
            )}
          </div>

          <button
            onClick={handleTriggerFlee}
            disabled={isFleeing}
            className="px-3 py-1.5 bg-[#251e14] hover:bg-[#382d1b] border border-[#68501c] text-[#a88636] hover:text-[#f3d484] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ml-auto active:scale-95"
          >
            <span>💨</span>
            <span>Bomba de Fumaça (Fugir)</span>
          </button>
        </div>
      </div>

      {/* Janela de Battle Log com desvanecimento dinâmico */}
      <BattleLogWindow
        logs={combatLog}
        currentTurn={turn}
        onClearLogs={() => setCombatLog([])}
      />

      {/* Modal / Banner de Fim de Combate */}
      {battleState === 'victory' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18140f] border-2 border-[#c59b27] rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-[0_0_40px_rgba(197,155,39,0.4)] animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400 mx-auto flex items-center justify-center text-amber-300 mb-4">
              <Trophy className="w-8 h-8" />
            </div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#a88636]">Triunfo em Nome da Luz</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f3d484] my-1">
              Vitória em Batalha!
            </h2>
            <p className="text-xs text-[#c4b59d] mb-6">
              {enemy.name} tombou diante da convicção e da lâmina sagrada de Sire Alaric.
            </p>

            <div className="bg-[#120f0b] border border-[#3d3119] rounded-xl p-4 text-xs space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-[#a88636]">Ouro Saqueado:</span>
                <span className="text-amber-300 font-mono font-bold">+{enemy.lootGold} Moedas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a88636]">Gemas Raras:</span>
                <span className="text-cyan-300 font-mono font-bold">+{enemy.lootGems} Gemas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a88636]">Experiência Adquirida:</span>
                <span className="text-purple-300 font-mono font-bold">+{enemy.lootExp} XP</span>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playCoins();
                onFlee();
              }}
              className="w-full py-3 bg-gradient-to-r from-[#9e7417] to-[#d4af37] hover:from-[#b0831d] hover:to-[#e2ba58] text-black font-bold text-sm rounded-xl shadow-lg transition-all"
            >
              Coletar Despojos & Retornar
            </button>
          </div>
        </div>
      )}

      {battleState === 'defeat' && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18140f] border-2 border-red-700 rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-[0_0_40px_rgba(220,38,38,0.4)] animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-red-950 border border-red-500 mx-auto flex items-center justify-center text-red-400 mb-4">
              <Skull className="w-8 h-8" />
            </div>
            <span className="text-xs uppercase font-bold tracking-widest text-red-400">Recuo Necessário</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-red-200 my-1">
              Forças Exauridas
            </h2>
            <p className="text-xs text-[#c4b59d] mb-6">
              Sire Alaric foi resgatado pelos batedores da Ordem Dourada. Descanse no acampamento e equipe-se no Bazar de Valéria para uma nova investida.
            </p>

            <button
              onClick={() => {
                sounds.playHealSpell();
                onCharacterUpdate({ hp: Math.floor(character.maxHp * 0.5) });
                onFlee();
              }}
              className="w-full py-3 bg-red-700 hover:bg-red-600 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
            >
              Retornar e Reagrupar (Recuperar 50% HP)
            </button>
          </div>
        </div>
      )}

      {/* Modal de Consumíveis & Elixires de Aprimoramento */}
      {isConsumablesOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#18140f] border-2 border-[#c59b27] rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-[0_0_40px_rgba(197,155,39,0.3)]">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#3d3119] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 text-lg">
                  ⚗️
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#f3d484] font-cinzel">
                    Alforge de Consumíveis & Elixires
                  </h3>
                  <p className="text-[11px] text-[#a88636]">
                    Poções de aprimoramento duram 3 turnos na arena de combate
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.playClick();
                  setIsConsumablesOpen(false);
                }}
                className="w-8 h-8 rounded-lg bg-[#251e14] hover:bg-[#382d1b] border border-[#68501c] text-amber-300 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Consumables List */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {consumablesInInventory.length === 0 ? (
                <div className="text-center py-8 px-4 bg-[#120f0b] border border-[#2d2312] rounded-xl">
                  <div className="text-3xl mb-2">🧪</div>
                  <h4 className="text-sm font-bold text-[#e0cfab] mb-1">
                    Nenhum consumível disponível
                  </h4>
                  <p className="text-xs text-[#8c7b64] leading-relaxed max-w-xs mx-auto">
                    Sua bolsa está vazia. Adquira elixires de força, tônicos de agilidade e poções de cura no Bazar de Valéria no acampamento.
                  </p>
                </div>
              ) : (
                consumablesInInventory.map((item, idx) => {
                  const buff = item.consumableEffect?.buff;
                  const healHp = item.consumableEffect?.healHp;
                  const healMp = item.consumableEffect?.healMp;
                  const cureBleed = item.consumableEffect?.cureBleed;

                  return (
                    <div
                      key={`${item.id}_${idx}`}
                      className="bg-[#1e1812] border border-[#4d3a18] hover:border-[#8e6e23] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-[#2b2014] border border-[#6e531f] flex items-center justify-center text-xl shrink-0">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-[#f3d484] truncate">
                              {item.name}
                            </h4>
                            <span
                              className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border ${
                                item.rarity === 'epico'
                                  ? 'bg-purple-950/70 text-purple-300 border-purple-700/60'
                                  : item.rarity === 'raro'
                                  ? 'bg-blue-950/70 text-blue-300 border-blue-700/60'
                                  : 'bg-[#251e14] text-[#bdae93] border-[#4d3a18]'
                              }`}
                            >
                              {item.rarity}
                            </span>
                          </div>

                          <p className="text-[11px] text-[#bdae93] mt-0.5 line-clamp-2">
                            {item.description}
                          </p>

                          {/* Destaques de Efeitos */}
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {buff && (
                              <>
                                <span className="px-2 py-0.5 rounded bg-amber-950/90 border border-amber-500/70 text-amber-300 text-[10px] font-semibold flex items-center gap-1">
                                  <span>{buff.icon}</span>
                                  <span>{buff.name}</span>
                                  <span className="bg-amber-500/30 text-amber-200 px-1 rounded font-mono font-bold text-[9px]">
                                    {buff.durationTurns} Turnos
                                  </span>
                                </span>
                                {buff.damageMultiplier && buff.damageMultiplier > 1 && (
                                  <span className="px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-600/60 text-rose-300 text-[10px] font-semibold">
                                    +{Math.round((buff.damageMultiplier - 1) * 100)}% Dano Extra
                                  </span>
                                )}
                                {buff.dodgeBonusPercentage && (
                                  <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-600/60 text-cyan-300 text-[10px] font-semibold">
                                    +{Math.round(buff.dodgeBonusPercentage * 100)}% Esquiva
                                  </span>
                                )}
                                {buff.defenseBonus && (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-600/60 text-amber-300 text-[10px] font-semibold">
                                    +{buff.defenseBonus} Defesa
                                  </span>
                                )}
                              </>
                            )}
                            {healHp && (
                              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-[10px] font-semibold">
                                +{healHp} PV
                              </span>
                            )}
                            {healMp && (
                              <span className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-600/60 text-blue-300 text-[10px] font-semibold">
                                +{healMp} PM
                              </span>
                            )}
                            {cureBleed && (
                              <span className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-600/60 text-rose-300 text-[10px] font-semibold">
                                Estanca Hemorragia
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleUseConsumableInBattle(item)}
                        disabled={turn !== 'player' || isActing || battleState !== 'in_progress'}
                        className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#9e7417] to-[#d4af37] hover:from-[#b0831d] hover:to-[#e2ba58] disabled:opacity-50 disabled:pointer-events-none text-black font-extrabold text-xs rounded-lg shadow transition-all active:scale-95 shrink-0"
                      >
                        {buff ? 'Ingerir Elixir' : 'Beber Poção'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-[#3d3119] bg-[#120f0b] rounded-b-2xl flex items-center justify-between text-[11px] text-[#a88636]">
              <span>Ingerir um consumível conta como sua ação nesta rodada.</span>
              <button
                onClick={() => setIsConsumablesOpen(false)}
                className="text-xs text-[#f3d484] hover:underline"
              >
                Voltar aos Golpes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
