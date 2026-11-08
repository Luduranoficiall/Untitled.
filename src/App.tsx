import React, { useState, useEffect } from 'react';
import { ActiveTab, AttributeKey, Attributes, Character, Enemy, EquipmentSlots, Item, Quest } from './types/game';
import { INITIAL_CHARACTER, INITIAL_ENEMIES, INITIAL_ITEMS, INITIAL_QUESTS, BAZAAR_INVENTORY } from './data/initialData';
import { CharacterView } from './components/CharacterView';
import { QuestView } from './components/QuestView';
import { BattleView } from './components/BattleView';
import { BazaarView } from './components/BazaarView';
import { InventoryView } from './components/InventoryView';
import { BestiaryView } from './components/BestiaryView';
import { LevelUpModal } from './components/LevelUpModal';
import { sounds } from './utils/audio';
import {
  Shield,
  Scroll,
  Swords,
  ShoppingBag,
  Backpack,
  BookOpen,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  RotateCcw,
  Sparkles,
  Coins,
  Gem,
} from 'lucide-react';

const STORAGE_KEY_CHAR = 'sire_alaric_char_v1';
const STORAGE_KEY_QUESTS = 'sire_alaric_quests_v1';
const STORAGE_KEY_BESTIARY = 'sire_alaric_bestiary_v1';

export default function App() {
  const [character, setCharacter] = useState<Character>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHAR);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_CHARACTER;
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUESTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_QUESTS;
  });

  const [bestiaryKills, setBestiaryKills] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BESTIARY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { shadow_chimera: 1 };
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('character');
  const [activeEnemy, setActiveEnemy] = useState<Enemy>(INITIAL_ENEMIES.shadow_chimera);
  const [activeQuestForBattle, setActiveQuestForBattle] = useState<Quest | null>(null);
  const [isLevelUpOpen, setIsLevelUpOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'responsive' | 'mobile_frame'>('responsive');

  // Sincronização com LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHAR, JSON.stringify(character));
    } catch {}
  }, [character]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_QUESTS, JSON.stringify(quests));
    } catch {}
  }, [quests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BESTIARY, JSON.stringify(bestiaryKills));
    } catch {}
  }, [bestiaryKills]);

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const handleResetGame = () => {
    if (window.confirm('Deseja reiniciar a jornada de Sire Alaric? Todos os atributos e inventário voltarão aos valores iniciais.')) {
      sounds.playClick();
      setCharacter(INITIAL_CHARACTER);
      setQuests(INITIAL_QUESTS);
      setBestiaryKills({ shadow_chimera: 1 });
      setActiveEnemy(INITIAL_ENEMIES.shadow_chimera);
      setActiveTab('character');
      localStorage.removeItem(STORAGE_KEY_CHAR);
      localStorage.removeItem(STORAGE_KEY_QUESTS);
      localStorage.removeItem(STORAGE_KEY_BESTIARY);
    }
  };

  // Equipar Item
  const handleEquipItem = (item: Item, inventoryIndex: number) => {
    if (item.type === 'consumable') return;
    const slotKey = (item.type === 'weapon' ? 'weapon' :
      item.type === 'armor' ? 'armor' :
      item.type === 'helmet' ? 'helmet' :
      item.type === 'boots' ? 'boots' :
      item.type === 'gloves' ? 'gloves' : 'accessory') as keyof EquipmentSlots;

    const previousEquipped = character.equipment[slotKey];
    const newInventory = [...character.inventory];
    newInventory.splice(inventoryIndex, 1);
    if (previousEquipped) {
      newInventory.push(previousEquipped);
    }

    setCharacter((prev) => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [slotKey]: item,
      },
      inventory: newInventory,
    }));
  };

  // Desequipar Item
  const handleUnequipItem = (slot: keyof EquipmentSlots) => {
    const item = character.equipment[slot];
    if (!item) return;

    setCharacter((prev) => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [slot]: null,
      },
      inventory: [...prev.inventory, item],
    }));
  };

  // Usar Item Consumível
  const handleUseItem = (item: Item, inventoryIndex?: number) => {
    let newHp = character.hp;
    let newMp = character.mp;
    let newConditions = [...character.conditions];

    if (item.consumableEffect?.healHp) {
      newHp = Math.min(character.maxHp, character.hp + item.consumableEffect.healHp);
    }
    if (item.consumableEffect?.healMp) {
      newMp = Math.min(character.maxMp, character.mp + item.consumableEffect.healMp);
    }
    if (item.consumableEffect?.cureBleed) {
      newConditions = newConditions.filter((c) => c.severity !== 'critico');
    }

    let newInventory = [...character.inventory];
    if (inventoryIndex !== undefined) {
      newInventory.splice(inventoryIndex, 1);
    } else {
      const idx = newInventory.findIndex((i) => i.id === item.id);
      if (idx !== -1) newInventory.splice(idx, 1);
    }

    setCharacter((prev) => ({
      ...prev,
      hp: newHp,
      mp: newMp,
      conditions: newConditions,
      inventory: newInventory,
    }));
  };

  // Descartar Item
  const handleDiscardItem = (index: number) => {
    const newInventory = [...character.inventory];
    newInventory.splice(index, 1);
    setCharacter((prev) => ({ ...prev, inventory: newInventory }));
  };

  // Bazar: Comprar Item
  const handleBuyItem = (item: Item) => {
    if (character.gold < item.price) return;
    setCharacter((prev) => ({
      ...prev,
      gold: prev.gold - item.price,
      inventory: [...prev.inventory, item],
    }));
  };

  // Bazar: Vender Item
  const handleSellItem = (index: number) => {
    const item = character.inventory[index];
    if (!item) return;
    const sellPrice = Math.floor(item.price * 0.6);

    const newInventory = [...character.inventory];
    newInventory.splice(index, 1);

    setCharacter((prev) => ({
      ...prev,
      gold: prev.gold + sellPrice,
      inventory: newInventory,
    }));
  };

  // Missões
  const handleAcceptQuest = (questId: string) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, status: 'active' } : q))
    );
  };

  const handleStartQuestBattle = (quest: Quest) => {
    const targetEnemy = INITIAL_ENEMIES[quest.enemyId] || INITIAL_ENEMIES.shadow_chimera;
    setActiveEnemy({ ...targetEnemy });
    setActiveQuestForBattle(quest);
    setActiveTab('battle');
  };

  const handleClaimReward = (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;

    sounds.playLevelUpFanfare();

    let newExp = character.exp + quest.rewardExp;
    let newLevel = character.level;
    let newStatPoints = character.statPoints;
    let expNext = character.expNext;

    while (newExp >= expNext) {
      newExp -= expNext;
      newLevel += 1;
      newStatPoints += 2;
      expNext = Math.round(expNext * 1.25);
    }

    const newInventory = [...character.inventory];
    if (quest.rewardItem) {
      newInventory.push(quest.rewardItem);
    }

    setCharacter((prev) => ({
      ...prev,
      gold: prev.gold + quest.rewardGold,
      gems: prev.gems + quest.rewardGems,
      exp: newExp,
      level: newLevel,
      statPoints: newStatPoints,
      expNext: expNext,
      inventory: newInventory,
    }));

    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, status: 'completed' } : q))
    );
  };

  // Vitória em Batalha
  const handleBattleVictory = (enemy: Enemy) => {
    let newExp = character.exp + enemy.lootExp;
    let newLevel = character.level;
    let newStatPoints = character.statPoints;
    let expNext = character.expNext;

    while (newExp >= expNext) {
      newExp -= expNext;
      newLevel += 1;
      newStatPoints += 2;
      expNext = Math.round(expNext * 1.25);
      setIsLevelUpOpen(true);
    }

    setCharacter((prev) => ({
      ...prev,
      gold: prev.gold + enemy.lootGold,
      gems: prev.gems + enemy.lootGems,
      exp: newExp,
      level: newLevel,
      statPoints: newStatPoints,
      expNext: expNext,
    }));

    // Registrar abate no Bestiário de Solis
    setBestiaryKills((prev) => ({
      ...prev,
      [enemy.id]: (prev[enemy.id] || 0) + 1,
    }));

    // Se a batalha foi fruto de uma quest ativa, marcar como concluída
    if (activeQuestForBattle) {
      handleClaimReward(activeQuestForBattle.id);
      setActiveQuestForBattle(null);
    }
  };

  const handleChallengeFromBestiary = (enemy: Enemy) => {
    setActiveEnemy({ ...enemy });
    setActiveTab('battle');
  };

  // Subir de Nível
  const handleConfirmLevelUp = (allocated: Partial<Attributes>, pointsSpent: number) => {
    setCharacter((prev) => {
      const updatedAttrs = { ...prev.attributes };
      (Object.keys(allocated) as AttributeKey[]).forEach((key) => {
        if (allocated[key]) {
          updatedAttrs[key] += allocated[key]!;
        }
      });

      const conIncrease = allocated.con || 0;
      const wisIncrease = allocated.wis || 0;
      const bonusHp = conIncrease * 10;
      const bonusMp = wisIncrease * 8;

      return {
        ...prev,
        statPoints: prev.statPoints - pointsSpent,
        attributes: updatedAttrs,
        maxHp: prev.maxHp + bonusHp,
        hp: prev.hp + bonusHp,
        maxMp: prev.maxMp + bonusMp,
        mp: prev.mp + bonusMp,
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0a08] text-[#ede4d1] flex flex-col">
      {/* TOP BAR CONTRACT: Zone 1 (Brand) — Zone 2 (4-5 Nav Links) — Zone 3 (Primary Action) */}
      <header className="sticky top-0 z-40 bg-[#120f0b]/95 backdrop-blur border-b border-[#3d3119] px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single Text Element Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              sounds.playClick();
              setActiveTab('character');
            }}
            className="text-lg sm:text-xl font-bold tracking-tight text-[#f3d484] whitespace-nowrap hover:text-[#fff2c2] transition-colors font-cinzel"
          >
            Sire Alaric RPG
          </a>
          <span className="hidden md:inline-block text-xs px-2 py-0.5 bg-[#251e14] text-[#a88636] border border-[#68501c] rounded">
            Nív. {character.level}
          </span>
        </div>

        {/* Zone 2: Navigation Links (single line, whitespace-nowrap) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-semibold text-[#bdae93]">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('character');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'character' ? 'text-[#f3d484] font-bold underline underline-offset-4 decoration-[#c59b27]' : 'hover:text-[#f3d484]'
            }`}
          >
            <Shield className="w-4 h-4 text-[#c59b27]" />
            Perfil & Status
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('quests');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'quests' ? 'text-[#f3d484] font-bold underline underline-offset-4 decoration-[#c59b27]' : 'hover:text-[#f3d484]'
            }`}
          >
            <Scroll className="w-4 h-4 text-[#c59b27]" />
            Diário de Missões
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('battle');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'battle' ? 'text-[#f3d484] font-bold underline underline-offset-4 decoration-[#c59b27]' : 'hover:text-[#f3d484]'
            }`}
          >
            <Swords className="w-4 h-4 text-[#c59b27]" />
            Campo de Batalha
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('bazaar');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'bazaar' ? 'text-[#f3d484] font-bold underline underline-offset-4 decoration-[#c59b27]' : 'hover:text-[#f3d484]'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#c59b27]" />
            Bazar de Valéria
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('inventory');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'inventory' ? 'text-[#f3d484] font-bold underline underline-offset-4 decoration-[#c59b27]' : 'hover:text-[#f3d484]'
            }`}
          >
            <Backpack className="w-4 h-4 text-[#c59b27]" />
            Mochila
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('bestiary');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'bestiary' ? 'text-[#f3d484] font-bold underline underline-offset-4 decoration-[#c59b27]' : 'hover:text-[#f3d484]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#c59b27]" />
            Bestiário
          </button>
        </nav>

        {/* Zone 3: Primary Action & Status Indicators */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Ouro e Gemas */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1 px-2.5 py-1 bg-[#201910] border border-[#68501c] rounded-md text-amber-300">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              {character.gold}
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-[#14232c] border border-cyan-800/60 rounded-md text-cyan-300">
              <Gem className="w-3.5 h-3.5 text-cyan-400" />
              {character.gems}
            </span>
          </div>

          {/* Toggle de Modo Celular (reproduzindo o mockup do YouTube) */}
          <button
            onClick={() => {
              sounds.playClick();
              setViewMode(viewMode === 'responsive' ? 'mobile_frame' : 'responsive');
            }}
            title={viewMode === 'responsive' ? 'Alternar para Modo Smartphone' : 'Alternar para Painel Completo'}
            className="p-2 bg-[#201910] hover:bg-[#302619] border border-[#68501c] text-[#a88636] hover:text-[#f3d484] rounded-lg transition-colors"
          >
            {viewMode === 'responsive' ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
          </button>

          {/* Áudio Sintetizado Web Audio */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'Ativar Efeitos Sonoros' : 'Mutar Efeitos Sonoros'}
            className="p-2 bg-[#201910] hover:bg-[#302619] border border-[#68501c] text-[#a88636] hover:text-[#f3d484] rounded-lg transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Botão de Evolução Rápida se houver pontos */}
          {character.statPoints > 0 ? (
            <button
              onClick={() => {
                sounds.playClick();
                setIsLevelUpOpen(true);
              }}
              className="px-3.5 py-1.5 text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-yellow-300 rounded-lg shadow hover:brightness-110 transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Subir Nível (+{character.statPoints})</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sounds.playSwordClash();
                setActiveTab('battle');
              }}
              className="px-3.5 py-1.5 text-xs font-bold text-black bg-[#c59b27] hover:bg-[#d4af37] rounded-lg shadow transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Batalhar</span>
            </button>
          )}
        </div>
      </header>

      {/* Navegação Inferior para Telas Mobile */}
      <div className="lg:hidden sticky top-[57px] z-30 bg-[#120f0b] border-b border-[#3d3119] px-2 py-1.5 flex items-center justify-around gap-1 overflow-x-auto">
        {[
          { id: 'character', label: 'Personagem', icon: Shield },
          { id: 'quests', label: 'Missões', icon: Scroll },
          { id: 'battle', label: 'Batalha', icon: Swords },
          { id: 'bazaar', label: 'Bazar', icon: ShoppingBag },
          { id: 'inventory', label: 'Mochila', icon: Backpack },
          { id: 'bestiary', label: 'Bestiário', icon: BookOpen },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              sounds.playClick();
              setActiveTab(id as ActiveTab);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === id
                ? 'bg-[#c59b27] text-black shadow'
                : 'text-[#a88636] hover:text-[#f3d484]'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Conteúdo Principal (Suporte a Painel Expandido ou Mockup de Celular do Protótipo) */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 flex justify-center items-start">
        {viewMode === 'mobile_frame' ? (
          /* Moldura de Smartphone (exatamente como visto no vídeo ao lado dos boards!) */
          <div className="w-full max-w-sm bg-[#120f0b] border-4 border-[#3d3119] rounded-[36px] shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col p-3 relative">
            <div className="w-24 h-4 bg-[#251e14] rounded-full mx-auto mb-3" />
            <div className="max-h-[750px] overflow-y-auto px-1 pb-4">
              {activeTab === 'character' && (
                <CharacterView
                  character={character}
                  onUseItem={handleUseItem}
                  onOpenLevelUp={() => setIsLevelUpOpen(true)}
                  onNavigateToTab={setActiveTab}
                />
              )}
              {activeTab === 'quests' && (
                <QuestView
                  quests={quests}
                  onAcceptQuest={handleAcceptQuest}
                  onStartQuestBattle={handleStartQuestBattle}
                  onClaimReward={handleClaimReward}
                />
              )}
              {activeTab === 'battle' && (
                <BattleView
                  character={character}
                  enemy={activeEnemy}
                  onCharacterUpdate={(up) => setCharacter((prev) => ({ ...prev, ...up }))}
                  onVictory={handleBattleVictory}
                  onFlee={() => setActiveTab('character')}
                  onUseItem={handleUseItem}
                />
              )}
              {activeTab === 'bazaar' && (
                <BazaarView
                  character={character}
                  bazaarItems={BAZAAR_INVENTORY}
                  onBuyItem={handleBuyItem}
                  onSellItem={handleSellItem}
                />
              )}
              {activeTab === 'inventory' && (
                <InventoryView
                  character={character}
                  onEquipItem={handleEquipItem}
                  onUnequipItem={handleUnequipItem}
                  onUseItem={handleUseItem}
                  onDiscardItem={handleDiscardItem}
                />
              )}
              {activeTab === 'bestiary' && (
                <BestiaryView
                  killsRecord={bestiaryKills}
                  onChallengeEnemy={handleChallengeFromBestiary}
                />
              )}
            </div>
            <div className="w-32 h-1 bg-[#3d3119] rounded-full mx-auto mt-2" />
          </div>
        ) : (
          /* Painel Expandido Desktop de 1440px */
          <div className="w-full max-w-6xl mx-auto">
            {activeTab === 'character' && (
              <CharacterView
                character={character}
                onUseItem={handleUseItem}
                onOpenLevelUp={() => setIsLevelUpOpen(true)}
                onNavigateToTab={setActiveTab}
              />
            )}
            {activeTab === 'quests' && (
              <QuestView
                quests={quests}
                onAcceptQuest={handleAcceptQuest}
                onStartQuestBattle={handleStartQuestBattle}
                onClaimReward={handleClaimReward}
              />
            )}
            {activeTab === 'battle' && (
              <BattleView
                character={character}
                enemy={activeEnemy}
                onCharacterUpdate={(up) => setCharacter((prev) => ({ ...prev, ...up }))}
                onVictory={handleBattleVictory}
                onFlee={() => setActiveTab('character')}
                onUseItem={handleUseItem}
              />
            )}
            {activeTab === 'bazaar' && (
              <BazaarView
                character={character}
                bazaarItems={BAZAAR_INVENTORY}
                onBuyItem={handleBuyItem}
                onSellItem={handleSellItem}
              />
            )}
            {activeTab === 'inventory' && (
              <InventoryView
                character={character}
                onEquipItem={handleEquipItem}
                onUnequipItem={handleUnequipItem}
                onUseItem={handleUseItem}
                onDiscardItem={handleDiscardItem}
              />
            )}
            {activeTab === 'bestiary' && (
              <BestiaryView
                killsRecord={bestiaryKills}
                onChallengeEnemy={handleChallengeFromBestiary}
              />
            )}
          </div>
        )}
      </main>

      {/* Modal de Subida de Nível */}
      <LevelUpModal
        character={character}
        isOpen={isLevelUpOpen}
        onClose={() => setIsLevelUpOpen(false)}
        onConfirmLevelUp={handleConfirmLevelUp}
      />

      {/* Rodapé Tranquilo com Opção de Reiniciar */}
      <footer className="bg-[#0e0c09] border-t border-[#251e14] py-4 px-6 text-center text-xs text-[#7d6e59] flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>Crônicas de Sire Alaric · A Luz da Ordem Dourada Resiste</span>
        <button
          onClick={handleResetGame}
          className="text-[#a88636] hover:text-[#f3d484] flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reiniciar Campanha (Reset)</span>
        </button>
      </footer>
    </div>
  );
}
