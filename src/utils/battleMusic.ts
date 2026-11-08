/**
 * Sistema de Música de Fundo Dinâmica Sintetizada em Web Audio API.
 * Gera trilhas sonoras orquestrais/dark fantasy puras no navegador, sem arquivos externos.
 * Varia conforme o tipo de criatura (Quimera, Espectro, Chefe Corrompido) e a intensidade do combate.
 */

import { sounds } from './audio';

export type CombatTrackId = 'beast' | 'spectral' | 'boss';

export interface CombatTrackInfo {
  id: CombatTrackId;
  title: string;
  subtitle: string;
  icon: string;
  mood: string;
}

export const TRACK_INFO: Record<CombatTrackId, CombatTrackInfo> = {
  beast: {
    id: 'beast',
    title: 'Fúria da Besta Anciã',
    subtitle: 'Passo dos Corvos · Tensão Primitiva',
    icon: '🐾',
    mood: 'Ritmo selvagem e tambores de guerra pesados',
  },
  spectral: {
    id: 'spectral',
    title: 'Réquiem das Almas Afogadas',
    subtitle: 'Pântano dos Murmúrios · Névoa Abissal',
    icon: '👻',
    mood: 'Coros etéreos de desespero e órgão sombrio',
  },
  boss: {
    id: 'boss',
    title: 'Marcha do Paladino Decaído',
    subtitle: 'Cripta Ancestral · Confronto com Lorde Malakor',
    icon: '⚔️',
    mood: 'Gótico imponente com marcha épica e acordes menores',
  },
};

class BattleMusicEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTrack: CombatTrackId = 'beast';
  private isLowHp: boolean = false;
  private masterGain: GainNode | null = null;
  private loopTimer: number | null = null;
  private heartbeatTimer: number | null = null;
  private step: number = 0;
  private isMutedByUser: boolean = false;
  private volume: number = 0.22; // Volume ambiente equilibrado

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    if (this.ctx && !this.masterGain) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.effectiveVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  private get effectiveVolume(): number {
    if (this.isMutedByUser || sounds.isMuted) return 0;
    return this.volume;
  }

  public getTrackForEnemy(enemyId: string): CombatTrackId {
    if (enemyId === 'corrupted_lord' || enemyId.includes('lord') || enemyId.includes('boss')) {
      return 'boss';
    }
    if (enemyId === 'swamp_wraith' || enemyId.includes('wraith') || enemyId.includes('ghost') || enemyId.includes('espectro')) {
      return 'spectral';
    }
    return 'beast';
  }

  public getCurrentTrackInfo(): CombatTrackInfo {
    return TRACK_INFO[this.currentTrack];
  }

  public isMusicActive(): boolean {
    return this.isPlaying && !this.isMutedByUser && !sounds.isMuted;
  }

  public toggleMute(): boolean {
    this.isMutedByUser = !this.isMutedByUser;
    this.syncMasterVolume();
    return this.isMutedByUser;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.syncMasterVolume();
  }

  private syncMasterVolume(fadeTime: number = 0.1) {
    if (!this.masterGain || !this.ctx) return;
    try {
      const targetGain = this.effectiveVolume;
      this.masterGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + fadeTime);
    } catch {
      // AudioContext fallback
    }
  }

  /**
   * Inicia a trilha sonora adaptada ao inimigo e à intensidade de batalha.
   */
  public start(enemyId: string, isLowHp: boolean = false) {
    this.init();
    const track = this.getTrackForEnemy(enemyId);

    // Se já estiver tocando a mesma faixa com mesmo estado de intensidade, não reinicia
    if (this.isPlaying && this.currentTrack === track && this.isLowHp === isLowHp) {
      return;
    }

    this.stop(false);
    this.currentTrack = track;
    this.isLowHp = isLowHp;
    this.isPlaying = true;
    this.step = 0;

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(this.effectiveVolume, this.ctx.currentTime + 0.8);
    }

    this.scheduleNextBeat();
    this.startHeartbeatLoop();
  }

  /**
   * Atualiza dinamicamente a intensidade de combate (ex: vida abaixo de 30%).
   */
  public updateIntensity(isLowHp: boolean) {
    if (this.isLowHp !== isLowHp) {
      this.isLowHp = isLowHp;
      if (this.isPlaying) {
        // Reinicia o pulso do batimento cardíaco imediatamente
        this.startHeartbeatLoop();
      }
    }
  }

  /**
   * Pára a música com desvanecimento suave (fade-out).
   */
  public stop(fade: boolean = true) {
    if (this.loopTimer) {
      window.clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    if (this.heartbeatTimer) {
      window.clearTimeout(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    if (this.isPlaying && fade && this.masterGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.linearRampToValueAtTime(0.001, now + 0.6);
      } catch {
        // Fallback
      }
    }

    this.isPlaying = false;
  }

  /* =========================================================================
   * AGENDADOR DE BEATS PROCEDURAIS
   * ========================================================================= */

  private scheduleNextBeat() {
    if (!this.isPlaying) return;

    // Tempo base (BPM) ajustado pela urgência/intensidade
    let baseIntervalMs = 280; // ~107 BPM base

    if (this.currentTrack === 'boss') {
      baseIntervalMs = this.isLowHp ? 220 : 260; // Mais rápido e marcial
    } else if (this.currentTrack === 'spectral') {
      baseIntervalMs = this.isLowHp ? 280 : 340; // Mais arrastado e fúnebre
    } else {
      // beast
      baseIntervalMs = this.isLowHp ? 230 : 275;
    }

    this.playBeatStep(this.step);
    this.step = (this.step + 1) % 16;

    this.loopTimer = window.setTimeout(() => {
      this.scheduleNextBeat();
    }, baseIntervalMs);
  }

  private playBeatStep(step: number) {
    if (!this.ctx || !this.masterGain || this.isMutedByUser || sounds.isMuted) return;

    try {
      if (this.currentTrack === 'boss') {
        this.renderBossStep(step);
      } else if (this.currentTrack === 'spectral') {
        this.renderSpectralStep(step);
      } else {
        this.renderBeastStep(step);
      }

      // Se em perigo extremo, sintetizar agudo de tensão dissonante a cada 8 tempos
      if (this.isLowHp && step % 8 === 0) {
        this.playHighTensionDrone();
      }
    } catch {
      // Audio fallback
    }
  }

  /* =========================================================================
   * TRILHA 1: BESTA / QUIMERA (Tambores tribais, percussão abafada, baixo arisco)
   * ========================================================================= */
  private renderBeastStep(step: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Tambor de guerra primitivo nos tempos 0, 4, 8, 12 + ghost note no 10
    if (step === 0 || step === 4 || step === 8 || step === 12 || (this.isLowHp && step === 10)) {
      this.synthWarDrum(now, step === 0 ? 0.35 : 0.22, step === 0 ? 55 : 68);
    }

    // Baixo rítmico selvagem em Ré menor (D1: 36.7Hz, F1: 43.6Hz, G1: 49.0Hz, A1: 55.0Hz)
    const notes = [36.7, 36.7, 43.65, 36.7, 49.0, 36.7, 55.0, 43.65];
    const freq = notes[step % notes.length];
    if (step % 2 === 0) {
      this.synthBassPluck(now, freq, 0.16, 'sawtooth', 0.22);
    }

    // Estalo de ossos/chocalho nos tempos ímpares
    if (step % 2 === 1) {
      this.synthPercNoise(now, 0.04, 3200);
    }
  }

  /* =========================================================================
   * TRILHA 2: ESPECTRAL / PÂNTANO (Órgão fúnebre, drones etéreos, sino do além)
   * ========================================================================= */
  private renderSpectralStep(step: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Acorde etéreo lento que muda a cada 8 tempos (E Menor / C Menor)
    if (step === 0) {
      // Mi menor / Sol / Si (E2: 82.4Hz, B2: 123.4Hz, G3: 196Hz)
      this.synthSpectralChord(now, [82.41, 123.47, 196.0], 1.8, 0.15);
    } else if (step === 8) {
      // Dó / Mi bemol / Sol (C2: 65.4Hz, G2: 98.0Hz, Eb3: 155.56Hz)
      this.synthSpectralChord(now, [65.41, 98.0, 155.56], 1.8, 0.15);
    }

    // Sino gélido do além nos tempos 2 e 10
    if (step === 2 || step === 10) {
      this.synthTollBell(now, step === 2 ? 659.25 : 587.33, 0.12);
    }

    // Sussurro de névoa nos contratempos
    if (step % 4 === 2) {
      this.synthWindSigh(now, 0.08);
    }
  }

  /* =========================================================================
   * TRILHA 3: CHEFE / LORDE MALAKOR (Marcha gótica, metais escuros, timbales)
   * ========================================================================= */
  private renderBossStep(step: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Batida marcial pesada (Timbale/Impacto nos tempos 0, 3, 6, 8, 12)
    if (step === 0 || step === 6 || step === 8 || step === 12 || (this.isLowHp && step === 14)) {
      this.synthWarDrum(now, step === 0 ? 0.42 : 0.28, step === 0 ? 48 : 62);
      this.synthMetalClashAccent(now, 0.08);
    }

    // Linha de baixo imperial com sintetizador duplo (Dó menor: C2, Eb2, G2, Ab2)
    const bossBass = [
      65.41, 65.41, 77.78, 65.41,
      82.41, 65.41, 98.0, 103.83,
      65.41, 77.78, 82.41, 98.0,
      103.83, 98.0, 77.78, 65.41,
    ];
    const bassFreq = bossBass[step];
    this.synthBassPluck(now, bassFreq, 0.22, 'sawtooth', 0.28);

    // Arpejo de latão gótico nos tempos pares
    if (step % 4 === 0) {
      const brassFreq = bassFreq * 2;
      this.synthBrassChord(now, [brassFreq, brassFreq * 1.5], 0.35, 0.14);
    }
  }

  /* =========================================================================
   * SINTETIZADORES DE INSTRUMENTOS VIRTUAIS (NATIVO WEB AUDIO API)
   * ========================================================================= */

  /** Tambor de Guerra Sub-grave */
  private synthWarDrum(time: number, gainVol: number, startFreq: number = 60) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq * 1.6, time);
    osc.frequency.exponentialRampToValueAtTime(28, time + 0.22);

    gain.gain.setValueAtTime(gainVol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.24);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.25);
  }

  /** Baixo dedilhado metálico */
  private synthBassPluck(time: number, freq: number, gainVol: number, wave: OscillatorType, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = wave;
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, time);
    filter.frequency.exponentialRampToValueAtTime(110, time + duration);

    gain.gain.setValueAtTime(gainVol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  /** Acorde etéreo espectral sustentado */
  private synthSpectralChord(time: number, freqs: number[], duration: number, gainVol: number) {
    if (!this.ctx || !this.masterGain) return;
    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      // Leve desafinação analógica para efeito de coral fantasmagórico
      const detune = idx === 0 ? 0 : idx === 1 ? -6 : 8;
      osc.frequency.setValueAtTime(freq, time);
      osc.detune.setValueAtTime(detune, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(gainVol, time + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + duration);
    });
  }

  /** Sino gótico agudo */
  private synthTollBell(time: number, freq: number, gainVol: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(gainVol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.7);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.72);
  }

  /** Respiração/névoa espectral filtrada */
  private synthWindSigh(time: number, gainVol: number) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.4);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(650, time);
    filter.frequency.exponentialRampToValueAtTime(320, time + 0.4);
    filter.Q.setValueAtTime(4, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(gainVol, time + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.4);
  }

  /** Latão gótico imperial */
  private synthBrassChord(time: number, freqs: number[], duration: number, gainVol: number) {
    if (!this.ctx || !this.masterGain) return;
    freqs.forEach((freq) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, time);
      filter.frequency.exponentialRampToValueAtTime(250, time + duration);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(gainVol, time + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + duration);
    });
  }

  /** Estalo percussivo tribal */
  private synthPercNoise(time: number, gainVol: number, freq: number = 2800) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.05);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(freq, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainVol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.05);
  }

  /** Acento metálico marcial */
  private synthMetalClashAccent(time: number, gainVol: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(940, time);
    osc.frequency.exponentialRampToValueAtTime(140, time + 0.09);

    gain.gain.setValueAtTime(gainVol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.1);
  }

  /** Drone dissonante de alta tensão ativado em perigo de morte */
  private playHighTensionDrone() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Intervalo de trítono (Tritone do Diabo: C5 = 523Hz e F#5 = 740Hz)
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(739.99, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.07, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.95);
  }

  /* =========================================================================
   * CAMADA DE PULSO CARDÍACO (HEARTBEAT) PARA VIDA CRÍTICA (<30% HP)
   * ========================================================================= */
  private startHeartbeatLoop() {
    if (this.heartbeatTimer) {
      window.clearTimeout(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    if (!this.isPlaying) return;

    if (this.isLowHp) {
      this.triggerHeartbeatDoubleThump();
      // Batimento cardíaco acelerado (950ms intervalo ~63 bpm duplo)
      this.heartbeatTimer = window.setTimeout(() => {
        this.startHeartbeatLoop();
      }, 900);
    }
  }

  private triggerHeartbeatDoubleThump() {
    if (!this.ctx || !this.masterGain || this.isMutedByUser || sounds.isMuted) return;
    const now = this.ctx.currentTime;

    // Primeiro baque (Lub)
    this.synthHeartThump(now, 0.35, 52);
    // Segundo baque (Dub) após 180ms
    this.synthHeartThump(now + 0.18, 0.28, 44);
  }

  private synthHeartThump(time: number, vol: number, baseFreq: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * 1.5, time);
    osc.frequency.exponentialRampToValueAtTime(24, time + 0.16);

    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.19);
  }
}

export const battleMusic = new BattleMusicEngine();
