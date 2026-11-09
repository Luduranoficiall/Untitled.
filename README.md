# ⚔️ Crônicas de Sire Alaric — RPG Tático Dark Fantasy

---

### 📋 Descrição Rápida para o Repositório (GitHub / GitLab About)

> **Crônicas de Sire Alaric** é um RPG tático medieval dark fantasy desenvolvido com React 19, Vite e Tailwind CSS. Combate estratégico por turnos, sistema de elixires com buffs temporários, bestiário ilustrado, motor de áudio procedural com Web Audio API nativo e efeitos visuais de impacto visceral.

---

## 📖 Índice

- [Visão Geral do Jogo](#-visão-geral-do-jogo)
- [O Conceito de RPG Tático Dark Fantasy](#-o-conceito-de-rpg-tático-dark-fantasy)
  - [O que define o Dark Fantasy Tático?](#o-que-define-o-dark-fantasy-tático)
  - [A Filosofia em "Crônicas de Sire Alaric"](#a-filosofia-em-crônicas-de-sire-alaric)
  - [A Dualidade: Luz Sagrada vs. Opressão Profana](#a-dualidade-luz-sagrada-vs-opressão-profana)
  - [Pilares Táticos e Sobrevivência](#pilares-táticos-e-sobrevivência)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Como Rodar o Projeto Localmente](#-como-rodar-o-projeto-localmente)
  - [Pré-requisitos](#pré-requisitos)
  - [Passo a Passo](#passo-a-passo)
  - [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Sistemas & Mecânicas Principais](#-sistemas--mecânicas-principais)
  - [Arena de Combate](#1-arena-de-combate-por-turnos)
  - [Estilhaço Crítico no Inimigo](#2-sistema-de-estilhaço-crítico-no-inimigo-shatter-fx)
  - [Partículas de Sangue Sombrio no Inimigo](#3-sistema-de-partículas-sangue-sombrio-no-inimigo-dark-blood-fx--jolt)
  - [Poções de Aprimoramento e Buffs](#4-sistema-de-efeitos-de-estado-status-buffs-em-batalha)
  - [Feedback de Dano no Retrato de Alaric](#5-feedback-de-dano-no-retrato-de-sire-alaric-shake--red-flash)
  - [Música de Combate Procedural](#6-sistema-de-música-de-fundo-dinâmica--procedural-battlemusicengine)
  - [Bestiário Medieval](#7-bestiário-medieval-e-fraquezas)
  - [Bazar de Valéria](#8-bazar-de-mercadorias-de-valéria)
  - [Motor de Efeitos Sonoros](#9-motor-de-efeitos-sonoros-procedurais)
- [Expansão e Customização](#-expansão-e-customização)
- [Licença e Créditos](#-licença)

---

## 🛡️ Visão Geral do Jogo

**Crônicas de Sire Alaric** transporta o jogador para os ermos decaídos do reino de **Solis**, uma terra outrora gloriosa que definha sob uma névoa amaldiçoada e hordas de criaturas abissais.

O jogador assume o manto de **Sire Alaric**, um veterano paladino da venerável **Ordem Dourada**. Armado com sua lâmina reluzente, fé inabalável e conhecimentos alquímicos, Alaric deve patrulhar ruínas esquecidas, expurgar monstruosidades arcanas e desvendar os segredos por trás da praga que assola o mundo.

O jogo foi construído do zero como uma **Single Page Application (SPA)** moderna, combinando alta performance, fidelidade visual de alto padrão e uma arquitetura limpa sem necessidade de assets gráficos ou sonoros pesados externos.

---

## 🌑 O Conceito de RPG Tático Dark Fantasy

O subgênero **Dark Fantasy Tactical RPG** (RPG Tático de Fantasia Sombria) difere profundamente da alta fantasia tradicional (*High Fantasy*). Enquanto na alta fantasia os heróis operam como semideuses infalíveis em mundos vibrantes, o Dark Fantasy enraíza sua narrativa na **fragilidade humana, no sacrifício, no realismo moral e na opressão constante**.

### O que define o Dark Fantasy Tático?

1. **Vulnerabilidade e Mortalidade:**
   O combate não é um desfile de poder irresponsável, mas uma disputa de atrito onde qualquer erro pode ser fatal. Os pontos de vida (PV) e mana (PM) são recursos preciosos e escassos.
2. **Moralidade Cinzenta e Decadência:**
   Cenários corrompidos, fortalezas em ruínas, monstros que outrora foram homens honrados e deuses que parecem ter abandonado os mortais.
3. **Custo de Oportunidade Tático:**
   Em um combate tático genuíno, cada turno possui um peso imenso. Decidir entre desferir um golpe, erguer o escudo para absorver um impacto esmagador ou consumir um frasco alquímico envolve um cálculo rigoroso de risco versus recompensa.

### A Filosofia em "Crônicas de Sire Alaric"

Em *Crônicas de Sire Alaric*, esses princípios são traduzidos diretamente nas linhas de código e no design de jogo:

- **Opressão Visual e Atmosférica:**  
  A interface utiliza tons profundos de grafite, bronze envelhecido e carmesim escuro, remetendo a pergaminhos e armaduras desgastadas pelo tempo. O sistema de clima procedural (chuva torrencial, neblina rastejante de mortos-vivos e cinzas vulcânicas) reforça o sentimento de perigo iminente.
- **Sobrevivência sob Pressão:**  
  Quando a vida de Alaric cai abaixo do limiar crítico de 30%, o sistema ativa o modo de **Dicas Táticas Emergenciais**, alertando o jogador sobre os riscos reais de morte iminente e recomendando ações decisivas (cura com *Imposição de Mãos*, postura de guarda ou retirada estratégica com bomba de fumaça).
- **Sem Magia Gratuita:**  
  O clássico *Castigo Divino* (*Holy Smite*) inflige dano massivo e penetração sagrada, mas seu custo drena boa parte da reserva de mana de Alaric, exigindo sabedoria sobre o momento exato de conjuração.

### A Dualidade: Luz Sagrada vs. Opressão Profana

A estética do jogo é impulsionada pelo contraste violento entre a **Luz Dourada** e a **Corrupção Carmesim**:

- Quando Alaric acerta um golpe crítico, a arena é banhada por feixes de luz dourada reluzente com centelhas e uma ressonância harmônica sagrada.
- Quando a abominação inimiga desfere um golpe esmagador, a tela treme com um flash carmesim corrompido e partículas de trevas acompanhadas por um estrondo soturno.

### Pilares Táticos e Sobrevivência

| Pilar Tático | Manifestação no Jogo |
| :--- | :--- |
| **Economia de Ações** | Usar um item consome o turno da rodada; atacar sem avaliar a intenção do inimigo pode resultar em contra-ataque letal. |
| **Mitigação Ativa** | A ação *Erguer Escudo* não anula o dano, mas absorve 65% do impacto direto, salvando o herói de golpes letais. |
| **Química Alquímica** | Poções temporárias fornecem aumentos precisos de Força, Destreza ou Constituição por exatamente 3 turnos, premiando o planejamento prévio. |
| **Estudo das Fraquezas** | O **Bestiário** expõe as fraquezas elementais (Fogo, Luz Sagrada, Contusão). Inimigos mortos-vivos sucumbem com o dobro de eficácia à fé de Alaric. |
| **Condições Severas** | A condição de *Hemorragia Severa* drena o sangue do cavaleiro a cada turno caso não seja purificada a tempo. |

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído empregando o estado da arte do ecossistema moderno de desenvolvimento frontend:

- **[React 19](https://react.dev/):** Biblioteca para interfaces de usuário, utilizando hooks avançados (`useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`) para orquestrar o estado global da campanha e o ciclo de combate.
- **[Vite](https://vitejs.dev/):** Build tool ultrarrápido com Hot Module Replacement (HMR) e empacotamento otimizado para produção.
- **[Tailwind CSS v4](https://tailwindcss.com/):** Framework utilitário de CSS de nova geração, aproveitando paletas temáticas (`amber`, `stone`, `red`, `zinc`), transições dinâmicas de combate e animações customizadas.
- **[TypeScript 5.x](https://www.typescriptlang.org/):** Tipagem estrita de todos os modelos de dados: atributos, fórmulas de dano, status de combate, catálogo de itens e registros de bestiário.
- **[Lucide React](https://lucide.dev/):** Biblioteca de iconografia limpa e consistente para representar armas, armaduras, consumíveis, magias e estatísticas.
- **Web Audio API Nativo:** Motor de síntese sonora programática via osciladores (`sine`, `triangle`, `sawtooth`) e geradores de ruído branco, dispensando completamente o carregamento de arquivos de áudio pesados.
- **Arte Procedural em SVG:** Ilustrações completas de personagens, monstros e cenários geradas via componentes vetoriais em código puro.

---

## 🚀 Como Rodar o Projeto Localmente

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- **Node.js** (versão `18.0.0` ou superior recomendada)
- **npm** (versão `9.0.0` ou superior) ou gerenciador equivalente (**pnpm**, **yarn**)

### Passo a Passo

1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com/seu-cliente/cronicas-de-sire-alaric.git
   cd cronicas-de-sire-alaric
   ```

2. **Instalar as Dependências:**
   ```bash
   npm install
   ```

3. **Iniciar o Ambiente de Desenvolvimento:**
   ```bash
   npm run dev
   ```
   O servidor iniciará instantaneamente. Abra seu navegador e navegue até:
   ```
   http://localhost:3000
   ```

4. **Verificar Qualidade do Código (Linting & TypeScript):**
   ```bash
   npm run lint
   ```

5. **Gerar Build de Produção:**
   ```bash
   npm run build
   ```
   Os arquivos otimizados e minificados serão gerados no diretório `/dist`.

6. **Visualizar a Build de Produção Localmente:**
   ```bash
   npm run preview
   ```

---

## 📂 Estrutura de Pastas

```
cronicas-de-sire-alaric/
├── index.html                   # Entrada HTML principal com tipografia Cinzel e metatags
├── metadata.json                # Configuração e permissões do projeto
├── package.json                 # Manifesto de dependências e scripts de execução
├── tsconfig.json                # Configurações do compilador TypeScript
├── vite.config.ts               # Configuração do Vite e plugins
└── src/
    ├── main.tsx                 # Ponto de montagem da raiz React (StrictMode)
    ├── App.tsx                  # Hub central: controle de abas, estado persistido e HUD
    ├── types/
    │   └── game.ts              # Modelagem de dados: Hero, Enemy, Item, Buff, Quest, etc.
    ├── data/
    │   ├── initialData.ts       # Valores iniciais de Alaric, itens do bazar e missões
    │   └── bestiaryData.ts      # Banco de conhecimento: lore, estatísticas e fraquezas
    ├── utils/
    │   └── audio.ts             # Motor de áudio sintetizado em tempo real (Web Audio API)
    └── components/
        ├── Artwork.tsx          # Ilustrações vetoriais em SVG (Alaric, Valéria e Inimigos)
        ├── BattleLogWindow.tsx  # Janela de Battle Log com desvanecimento dinâmico e filtros
        ├── BattleView.tsx       # Arena de combate, menu de elixires, clima e logs
        ├── BestiaryView.tsx     # Enciclopédia de monstros derrotados com fraquezas
        ├── BuffActivationFX.tsx # Efeitos visuais de ativação de buffs (partículas, auras, ondas de choque e sigilos rúnicos)
        ├── CharacterSheet.tsx   # Ficha de atributos (d20-style), slots de equipamentos
        ├── CriticalBurstFX.tsx  # Partículas e feixes de acertos críticos (dourado/carmesim)
        ├── EnemyShatterFX.tsx   # Animação de estilhaço (shatter) e brilho avermelhado de alto contraste sobre o sprite do inimigo
        ├── SmokeEscapeFX.tsx    # Efeito cinematográfico de bomba de fumaça alquímica
        └── WeatherOverlay.tsx   # Camada atmosférica de clima (chuva, névoa, cinzas)
```

---

## 🎮 Sistemas & Mecânicas Principais

### 1. Arena de Combate por Turnos
- **Ações Estratégicas:**
  - `Golpe de Lâmina`: Dano físico com escalamento de Força e bônus de armas equipadas.
  - `Castigo Divino`: Ataque sagrado devastador que ignora mitigação e garante acerto crítico.
  - `Imposição de Mãos`: Restauração solar de PV com purificação imediata da condição de *Hemorragia*.
  - `Erguer Escudo`: Posição de guarda defensiva reduzindo 65% do próximo dano sofrido.
- **Feedback Audiovisual Imediato:** Números flutuantes de dano, flashes críticos, partículas e tremor de tela sincronizados aos sintetizadores de áudio.

### 2. Animação de Estilhaço, Brilho Crítico e Energia Dourada (`EnemyShatterFX` & `GoldenAscensionParticlesFX`)
- **Impacto Visual de Alto Contraste:** Sempre que Sire Alaric desfere um golpe crítico (*Golpe Crítico* ou *Castigo Divino*), uma explosão de estilhaço de vidro e cristais rubi é disparada diretamente sobre o sprite do inimigo, acompanhada pela ascensão majestosa da luz sagrada.
- **Camadas Visuais do Efeito:**
  - **Clarão Avermelhado Strobe:** Pulso carmesim de alta saturação e brilho com `mix-blend-color-dodge`, iluminando a silhueta do monstro.
  - **Partículas de Energia Dourada Ascendentes (`GoldenAscensionParticlesFX`):** 22 orbes luminosos e estrelas de 4 pontas de luz solar que sobem suavemente da base do quadro (`animate-golden-energy-rise` e `animate-golden-sparkle`), com halo radiante dourado (`animate-golden-base-glow`) e feixes solares verticais que complementam o flash vermelho, enfatizando a graça e o sucesso do golpe do paladino.
  - **Fissuras e Teia de Fraturas (SVG Crack Web):** Linhas de rachadura brancas e rubras ramificadas que se espalham instantaneamente a partir do ponto de impacto central.
  - **Estilhaços Poligonais Físicos (Flying Glass Shards):** 22 fragmentos geométricos facetados procedurais que são arremessados radialmente em alta velocidade com rotação angular e gradientes de cristal rubi.
  - **Jolt Cinético no Sprite:** Tremor violento com aberração de contraste e brilho aplicado ao container do inimigo (`animate-enemy-crit-jolt`).
  - **Emblema de Estilhaço:** Selo temático animado `"Estilhaço Crítico!"` que coroa o impacto.
  - **Áudio Sintetizado (`playShatterCrit`):** Síntese em Web Audio API combinando golpe subsônico de perfuração, ruído branco filtrado de quebra de vidro e harmônicos vítreos estridentes.

### 3. Sistema de Partículas 'Sangue Sombrio' no Inimigo (Dark Blood FX & Jolt)
- **Violência Tática Visceral:** Ao sofrer dano físico pesado, acertos críticos ou golpes imbuídos por elixires de força, a silhueta do monstro expulsa jatos e partículas de sangue sombrio e ichor corrompido, complementando o tremor (`animate-enemy-crit-jolt`).
- **Camadas das Partículas de Sangue (`DarkBloodParticlesFX`):**
  - **Jatos Parabólicos em Alta Velocidade (`animate-dark-blood-spurt`):** 16 a 26 gotas alongadas e coágulos com gradientes carmesins profundos (`#dc2626` a `#150205` e preto abissal), dotadas de inércia física, rotação e atrito gravitacional descendente.
  - **Corte de Lâmina e Dilaceração Vetorial (`animate-dark-slash-gash`):** Rasgo estilizado de corte profundo no centro do sprite, simulando o golpe afiado da lâmina de Alaric penetrando a armadura ou couraça da criatura.
  - **Vapor de Miasma Carmesim (`animate-dark-blood-mist`):** Névoa volátil avermelhada e escura que se expande do ponto de impacto e se dissipa no ar.
  - **Estrias de Sangue Escorrendo (`animate-dark-blood-drip`):** Rastros viscosos que escorrem verticalmente ao longo da moldura da besta.
  - **Áudio de Dilaceração de Carne (`playDarkBloodSlash`):** Síntese em Web Audio API combinando impacto subsônico, ruído passa-faixa rasgando tecido e squelch visceral de sangue.
  - **Níveis de Intensidade:** *Heavy* (golpe físico bem-sucedido), *Brutal* (potencializado por Força Elevada ou Castigo Divino) e *Critical* (acerto crítico fulminante com badge rúnico de `"Dilaceração Crítica!"`).

### 4. Sistema de Efeitos de Estado (Status Buffs em Batalha)
- **Menu Rápido de Combate:** Acesso ao alforge de consumíveis durante o confronto para ingerir elixires táticos com 3 turnos de duração.
- **Efeitos de Estado e Elixires Disponíveis:**
  - **Força Elevada** (*Elixir de Força Elevada*): Concede +40% de dano extra em todos os ataques e +5 de FOR por 3 turnos.
  - **Agilidade dos Ventos** (*Tônico de Agilidade*): Concede +30% de chance de esquiva contra golpes inimigos e +6 de DES por 3 turnos.
  - **Armadura de Ferro** (*Elixir de Armadura de Ferro*): Concede +8 de Defesa e mitigação direta contra impactos severos por 3 turnos.
- **Efeitos Visuais de Ativação sob o Retrato de Alaric (`BuffActivationFX`):**
  - **Força:** Explosão de brasas carmesins/rubi em ascensão vertical, onda de choque concêntrica e sigilo rúnico solar flamejante.
  - **Agilidade:** Turbilhão de correntes de ar ciano/azul celestial, rastros de velocidade radiantes e faíscas cintilantes ao redor do quadro.
  - **Armadura:** Barreira dourada de égide radiante com selo rúnico protetor, diamantes de luz solar e centelhas metálicas defensivas.
  - **Aura Persistente:** Halo sutil respirante e borda reluzente contínua sob o retrato de Alaric durante toda a vigência do efeito.
- **HUD Dedicado sob o Retrato de Alaric:** Painel temático com insígnias rúnicas coloridas (carmesim para Força, ciano para Agilidade, âmbar para Armadura), detalhando estatísticas e contadores visuais de turnos restantes (`3T`, `2T`, `1T`).
- **Controle e Alertas de Expiração:** Decaimento automático a cada ciclo de combate, com badge pulsante de "Último Turno!" e registros de alerta no `BattleLog` com efeitos sonoros quando o efeito se dissipa.

### 5. Feedback de Dano no Retrato de Sire Alaric (Shake & Red Flash)
- **Tremor Cinético de Impacto (`animate-alaric-damage-shake`):** Recuo físico angular e vibração instantânea acionados sempre que Alaric sofre dano direto em combate ou dano por sangramento contínuo.
- **Flash Carmesim de Sangue (`animate-alaric-damage-flash`):** Overlay estroboscópico rubi de alto contraste com vinheta de sangue, rastro vetorial de corte e borda incandescente (`border-red-600 shadow-[0_0_35px_rgba(220,38,38,0.9)]`), proporcionando resposta visual visceral à perda de pontos de vida.
- **Sincronia Total de Combate:** Reage tanto a ataques corpo a corpo e golpes especiais brutais de monstros quanto a tiques periódicos de *Hemorragia Severa*.

### 6. Sistema de Música de Fundo Dinâmica & Procedural (`BattleMusicEngine`)
- **Síntese Sonora 100% Nativa (Web Audio API):** Gera trilhas sonoras orquestrais e dark fantasy em tempo real no navegador do jogador, sem carregamento de arquivos de áudio pesados, sem latência e imune a falhas de rede.
- **Trilhas Sonoras Adaptativas por Arquétipo de Inimigo:**
  - 🐾 **Fúria da Besta Anciã** (*Quimera e Feras das Fendas*): Tambores de guerra tribais pesados (55-68Hz), baixo arisco em Ré menor, estalos ósseos rítmicos e percussão primitiva.
  - 👻 **Réquiem das Almas Afogadas** (*Espíritos e Mortos-Vivos do Pântano*): Acordes etéreos com detune coral, sinos fúnebres de ressonância gélida e filtros ressonantes de névoa abissal.
  - ⚔️ **Marcha do Paladino Decaído** (*Chefes e Lorde Malakor*): Marcha marcial gótica imponente, timbales de guerra, acentos metálicos e arpejos de latão sombrio em progressão dramática.
- **Camada Dinâmica de Alta Tensão (Vida Crítica < 30%):**
  - **Aceleração Rítmica:** Aumento imediato do andamento (BPM) para transmitir urgência e pânico tático.
  - **Pulso Cardíaco Sub-grave (*Heartbeat*):** Batimento cardíaco duplo sintetizado (*lub-dub* a 24-52Hz) que reverbera continuamente durante o combate em perigo de morte.
  - **Drone de Trítono Dissonante:** Frequência harmônica aguda que coroa o clímax da batalha.
- **Controles Integrados no Combate:** Badge visual no cabeçalho indicando a trilha ativa, estado de tensão extrema e botão de alternância rápida de áudio.

### 7. Bestiário Medieval Avançado & Dossiê de Espécies
- **Inspeção Detalhada e Dossiê Completo:** O jogador pode clicar em qualquer criatura do catálogo para abrir sua ficha tática aprofundada, com filtros por status (`Todos`, `Derrotados`, `Não Vencidos`) e insígnia de abates totais.
- **Matriz de Fraquezas & Resistências Elementais:**
  - Multiplicadores quantificados de dano (ex: *Luz Sagrada +50%*, *Fogo +30%*, *Contusão +20%* vs. *Lâmina de Ferro -40%*, *Miasma/Trevas -65%* e imunidades a *Veneno/Hemorragia*).
  - Justificativa biológica e lore de cada resistência/vulnerabilidade.
  - Recomendação de tipo de armamento ideal (ex: *Martelo de Guerra Sagrado*, *Tocha Solar & Lâmina Prateada*) e Dica Tática de Campo assinada por Sire Alaric.
- **Histórico de Derrotas da Espécie (`bestiaryKills`):**
  - Registro de vitórias persistido em `localStorage` sob a chave `sire_alaric_bestiary_v1`.
  - **Patentes de Maestria de Caça:** Progressão dinâmica baseada no número de abates (*Iniciado na Caça*, *Caçador Veterano*, *Exterminador Implacável*, *Mestre Algoz da Espécie*) com barra de progresso visual.
  - **Espólios Totais Acumulados:** Estimativa de riqueza e experiência conquistadas daquela espécie (Moedas de Ouro, Gemas Raras e Pontos de Experiência).
  - **Relatório de Contenção & Ameaça:** Nível de contenção nos ermos de Solis baseado no volume de abates.
  - **Registro Canônico de Vitórias:** Detalhes da primeira e mais recente vitória contra o monstro.
- **Desafio Rápido no Campo de Batalha:** Botão integrado para iniciar combate direto contra a criatura selecionada na Arena.

### 8. Bazar de Mercadorias de Valéria
- Negociação mercantil com a intendente Valéria.
- Economia dupla baseada em **Moedas de Ouro** (comércio geral) e **Gemas Raras** (artefatos lendários).
- Filtros por categoria: Lâminas, Escudos, Armaduras, Acessórios e Poções Alquímicas.

### 9. Motor de Efeitos Sonoros Procedurais
- Desenvolvido puramente em **Web Audio API**:
  - `playSwordClash()`: Lâminas se cruzando com eco metálico.
  - `playHolyCriticalHit()`: Acerto crítico reluzente com ressonância harmônica sagrada.
  - `playShatterCrit()`: Estilhaço violento de cristais vítreos com impacto subsônico e estalidos agudos.
  - `playDarkBloodSlash()`: Corte profundo e dilaceração de carne com espirro de sangue sombrio.
  - `playSmiteSpell()`: Glissando ascendente de energia sagrada.
  - `playHealSpell()`: Acorde sereno de bênção restauradora.
  - `playMonsterHit()` / `playDarkCriticalHit()`: Impactos carmesins corrompidos e estrondosos.
  - `playCoins()`: Tintilar límpido de moedas de ouro.
  - `playSmokeEscape()`: Detonação e chiado de fumaça alquímica.

---

## 🔧 Expansão e Customização

O projeto foi estruturado para receber novas funcionalidades de forma modular:

1. **Adicionar Novos Monstros:**  
   Basta registrar uma nova entrada em `src/data/bestiaryData.ts` e referenciar o render correspondente no componente `Artwork.tsx`.
2. **Criar Novos Equipamentos e Poções:**  
   Basta acrescentar novos itens no array de catálogo em `src/data/initialData.ts`, definindo o tipo (`weapon`, `armor`, `potion`), raridade e modificadores de atributo.
3. **Novas Magias e Habilidades:**  
   O componente `BattleView.tsx` conta com funções desacopladas de cálculo de turno (`executeHeroTurn`), permitindo adicionar novas magias ao menu de ações sem quebrar o equilíbrio do combate.

---

## 📄 Licença

Este software é um produto de encomenda para o cliente. Código-fonte proprietário com todos os direitos reservados.
