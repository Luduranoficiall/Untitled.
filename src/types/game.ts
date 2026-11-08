export type AttributeKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export interface Attributes {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export type ItemType = 'weapon' | 'armor' | 'helmet' | 'boots' | 'gloves' | 'accessory' | 'consumable';
export type ItemRarity = 'comum' | 'raro' | 'epico' | 'lendario';

export interface TemporaryBuffConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  durationTurns: number;
  statBonuses: {
    str?: number;
    dex?: number;
    con?: number;
    defense?: number;
  };
  damageMultiplier?: number;
  flatDamageBonus?: number;
  dodgeBonusPercentage?: number;
  defenseBonus?: number;
  type?: 'strength' | 'agility' | 'armor' | 'custom';
}

export interface ActiveBuff {
  id: string;
  name: string;
  description: string;
  icon: string;
  turnsRemaining: number;
  statBonuses: {
    str?: number;
    dex?: number;
    con?: number;
    defense?: number;
  };
  damageMultiplier?: number;
  flatDamageBonus?: number;
  dodgeBonusPercentage?: number;
  defenseBonus?: number;
  type?: 'strength' | 'agility' | 'armor' | 'custom';
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  price: number;
  gemPrice?: number;
  description: string;
  stats?: {
    attack?: number;
    defense?: number;
    str?: number;
    con?: number;
    wis?: number;
    dex?: number;
    int?: number;
    cha?: number;
    maxHpBonus?: number;
    maxMpBonus?: number;
  };
  consumableEffect?: {
    healHp?: number;
    healMp?: number;
    cureBleed?: boolean;
    temporaryBuff?: string;
    buff?: TemporaryBuffConfig;
  };
  icon: string;
}

export type QuestStatus = 'available' | 'active' | 'completed';
export type QuestDifficulty = 'Fácil' | 'Moderada' | 'Arriscada' | 'Lendária';

export interface Quest {
  id: string;
  title: string;
  subtitle: string;
  category: 'Principal' | 'Secundária' | 'Lendária';
  description: string;
  location: string;
  difficulty: QuestDifficulty;
  rewardGold: number;
  rewardGems: number;
  rewardExp: number;
  rewardItem?: Item;
  status: QuestStatus;
  enemyId: string;
}

export interface StatusCondition {
  id: string;
  name: string;
  severity: 'leve' | 'critico' | 'positivo';
  description: string;
  hpDrainPerTurn?: number;
  icon: string;
}

export interface EquipmentSlots {
  weapon: Item | null;
  armor: Item | null;
  helmet: Item | null;
  boots: Item | null;
  gloves: Item | null;
  accessory: Item | null;
}

export interface Character {
  name: string;
  title: string;
  race: string;
  characterClass: string;
  level: number;
  exp: number;
  expNext: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  stamina: number;
  maxStamina: number;
  gold: number;
  gems: number;
  statPoints: number;
  attributes: Attributes;
  equipment: EquipmentSlots;
  inventory: Item[];
  conditions: StatusCondition[];
  biography: string;
}

export interface EnemyMove {
  name: string;
  damageMultiplier: number;
  causesBleed?: boolean;
  flavorText: string;
}

export interface Enemy {
  id: string;
  name: string;
  title: string;
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  specialMove: EnemyMove;
  lootGold: number;
  lootExp: number;
  lootGems: number;
  lootItem?: Item;
  avatarSvg: string;
  quote: string;
}

export interface BestiaryEntry {
  enemyId: string;
  name: string;
  title: string;
  category: 'Fera Antiga' | 'Espírito' | 'Corrompido' | 'Lorde Abissal';
  lore: string;
  weakness: string;
  resistance: string;
  tacticalTip: string;
  location: string;
  stats: {
    level: number;
    hp: number;
    attack: number;
    defense: number;
  };
  possibleDrops: {
    name: string;
    chance: string;
    icon: string;
  }[];
}

export type ActiveTab = 'character' | 'quests' | 'battle' | 'bazaar' | 'inventory' | 'bestiary';

export type CombatLogType = 'damage' | 'heal' | 'crit' | 'bleed' | 'dodge' | 'buff' | 'shield' | 'system';

export interface CombatLogEntry {
  id: string;
  sender: 'player' | 'enemy' | 'system';
  text: string;
  type?: CombatLogType;
  timestamp?: string;
  turn?: number;
  highlight?: string;
}
