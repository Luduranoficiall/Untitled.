# Plano de Implementação: Sistema de Efeitos de Estado em Batalha

Implementação do sistema de **Efeitos de Estado (Status Buffs)** na tela de combate (`BattleView`), permitindo que Sire Alaric consuma elixires táticos que concedem bônus temporários como **Força Elevada**, **Agilidade** e **Armadura de Ferro**, com contadores visuais de turnos sob o retrato do herói e alertas no Battle Log.

---

## 1. Modificações Propostas

### A. Tipos de Dados (`src/types/game.ts`)
- **Aprimoramento da interface `ActiveBuff`**:
  - `id`: identificador único do efeito (`strength_boost`, `agility_boost`, `iron_armor_boost`).
  - `name`: Nome em português (*Força Elevada*, *Agilidade dos Ventos*, *Armadura de Ferro*).
  - `description`: Descrição detalhada do efeito para exibição em tooltip.
  - `icon`: Ícone correspondente (espadas cruzadas, vento/pássaro, escudo de ferro).
  - `turnsRemaining`: Contador de turnos restantes.
  - `damageMultiplier` / `flatDamageBonus`: Multiplicador ou acréscimo de dano infligido.
  - `dodgeBonusPercentage`: Acréscimo percentual de chance de esquiva contra ataques inimigos.
  - `defenseBonus`: Redução direta de dano sofrido ou bônus de armadura.
  - `themeColor`: Cor de destaque do brilho rúnico (vermelho-carmesim para força, esmeralda/ciano para agilidade, âmbar/ouro para armadura).
- **Ajuste em `ConsumableEffect`**:
  - Garantir compatibilidade direta para poções que ativam buffs de combate.

### B. Dados Iniciais e Loja (`src/data/initialData.ts`)
- **Novas Poções Táticas de Efeito**:
  - **Elixir de Força Elevada**: Concede *Força Elevada* (+40% de dano e +3 de FOR por 3 turnos).
  - **Tônico de Agilidade**: Concede *Agilidade dos Ventos* (+30% de chance de esquiva e +3 de DES por 3 turnos).
  - **Elixir da Armadura de Ferro**: Concede *Armadura de Ferro* (+6 de Defesa e proteção reforçada por 3 turnos).
- Adição dessas poções ao inventário inicial de Sire Alaric e ao catálogo do Mercador/Bazar para aquisição.

### C. Interface de Combate (`src/components/BattleView.tsx`)
- **HUD de Efeitos Ativos sob o Retrato de Sire Alaric**:
  - Container estilizado no tema dark fantasy (pergaminho envelhecido, bordas douradas, fundo escuro texturizado) posicionado logo abaixo da barra de vida/mana de Alaric.
  - Badges individuais para cada buff com:
    - Ícone ilustrativo com brilho pulsante condizente com a cor temática.
    - Nome do buff e contador de turnos (`3t`, `2t`, `1t`) com badge de destaque.
    - Tooltip ao passar o cursor ou tocar, detalhando exatamente o bônus concedido e a descrição imersiva.
- **Mecânica de Combate Aplicada**:
  - **No Ataque de Alaric**: Se *Força Elevada* estiver ativa, calcula bônus extra de dano, exibe efeito sonoro de impacto crítico e registra mensagem destacada no `BattleLogWindow` (*"A Força Elevada guia a lâmina de Sire Alaric, desferindo um golpe avassalador!"*).
  - **No Ataque Inimigo**: Se *Agilidade* estiver ativa, a chance de esquiva é incrementada. Em caso de esquiva por agilidade, exibe feedback no log (*"Sire Alaric desvia com incrível agilidade do golpe inimigo!"*).
  - **Na Redução de Dano**: Se *Armadura de Ferro* estiver ativa, o dano recebido sofre redução adicional e o log registra a absorção de impacto.
- **Controle de Turnos e Expiração**:
  - Ao final de cada rodada de combate (após o turno do inimigo), os turnos restantes decrementam.
  - Quando um efeito atinge 0 turnos, é removido e um log de alerta de sistema é gerado no `BattleLogWindow` (*"O efeito de [Nome do Buff] se dissipou."*), acompanhado de suave efeito sonoro.

---

## 2. Plano de Validação
- **Compilação e Verificação de Tipos**: Execução de `lint_applet` e `compile_applet`.
- **Validação Visual e Funcional**:
  - Testar uso de cada poção no menu de consumíveis durante a batalha.
  - Verificar renderização dos badges de estado sob o retrato do herói com seus contadores.
  - Confirmar aplicação dos bônus no cálculo de dano e esquiva.
  - Verificar redução de turnos a cada rodada e o alerta de expiração no histórico de combate.
