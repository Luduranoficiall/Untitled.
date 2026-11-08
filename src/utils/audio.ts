/**
 * Motor de áudio sintetizado em Web Audio API.
 * 100% nativo no navegador, sem dependências externas ou arquivos pesados.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Ignorar caso bloqueado por autoplay policy
    }
  }

  public playSwordClash() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Golpe metálico
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);

      // Ruído branco filtrado para impacto de lâmina
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, now);
      filter.Q.setValueAtTime(3, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
      whiteNoise.start(now);
      whiteNoise.stop(now + 0.15);
    } catch {
      // Audio fallback
    }
  }

  public playSmiteSpell() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Glissando ascendente de energia sagrada
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + i * 0.04 + 0.25);

        gain.gain.setValueAtTime(0, now + i * 0.04);
        gain.gain.linearRampToValueAtTime(0.15, now + i * 0.04 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.35);
      });
    } catch {
      // Audio fallback
    }
  }

  public playHealSpell() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Acorde suave de bênção
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.01, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.05 + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.4);
      });
    } catch {
      // Audio fallback
    }
  }

  public playCoins() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [1800, 2400, 3100].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.15, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.12);
      });
    } catch {
      // Audio fallback
    }
  }

  public playLevelUpFanfare() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.18, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      });
    } catch {
      // Audio fallback
    }
  }

  public playMonsterHit() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.22);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Audio fallback
    }
  }

  public playHolyCriticalHit() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Harmônicos sagrados ressonantes
      [587.33, 880, 1174.66, 1760].forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.02);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.2, now + i * 0.02 + 0.35);

        gain.gain.setValueAtTime(0.2, now + i * 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.02 + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.02);
        osc.stop(now + i * 0.02 + 0.5);
      });

      // Impacto estrondoso de corte dourado
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sawtooth';
      sub.frequency.setValueAtTime(180, now);
      sub.frequency.exponentialRampToValueAtTime(45, now + 0.25);
      subGain.gain.setValueAtTime(0.35, now);
      subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 0.25);
    } catch {
      // Audio fallback
    }
  }

  public playDarkCriticalHit() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Estrondo grave e dissonante
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sawtooth';
      sub.frequency.setValueAtTime(95, now);
      sub.frequency.exponentialRampToValueAtTime(25, now + 0.45);
      subGain.gain.setValueAtTime(0.4, now);
      subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 0.45);

      // Ruído estilhaçador sombrio
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(320, now);
      osc2.frequency.linearRampToValueAtTime(70, now + 0.3);
      gain2.gain.setValueAtTime(0.2, now);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.3);
    } catch {
      // Audio fallback
    }
  }

  public playSmokeEscape() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Rajada de ruído filtrado de fumaça / puff
      const bufferSize = this.ctx.sampleRate * 0.45;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(150, now + 0.4);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.45);
    } catch {
      // Audio fallback
    }
  }

  public playShatterCrit() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Grave impacto de perfuração crítica
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'triangle';
      sub.frequency.setValueAtTime(140, now);
      sub.frequency.exponentialRampToValueAtTime(32, now + 0.35);
      subGain.gain.setValueAtTime(0.35, now);
      subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 0.35);

      // 2. Estilhaço de vidro / cristal afiado (ruído branco filtrado)
      const bufferSize = this.ctx.sampleRate * 0.35;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const shatterNoise = this.ctx.createBufferSource();
      shatterNoise.buffer = buffer;

      const hpFilter = this.ctx.createBiquadFilter();
      hpFilter.type = 'highpass';
      hpFilter.frequency.setValueAtTime(2400, now);
      hpFilter.frequency.exponentialRampToValueAtTime(1200, now + 0.3);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.32, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      shatterNoise.connect(hpFilter);
      hpFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      shatterNoise.start(now);
      shatterNoise.stop(now + 0.35);

      // 3. Tímpano de estilhaço vítreo (3 harmônicos agudos discordantes)
      [2800, 3600, 4700].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.015);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + idx * 0.015 + 0.22);
        gain.gain.setValueAtTime(0.18, now + idx * 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.015 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.015);
        osc.stop(now + idx * 0.015 + 0.25);
      });
    } catch {
      // Audio fallback
    }
  }

  /**
   * Som de golpe físico pesado com espirro de sangue sombrio e dilaceração de carne.
   */
  public playDarkBloodSlash() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Impacto contundente de corte profundo (baque grave)
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'triangle';
      sub.frequency.setValueAtTime(160, now);
      sub.frequency.exponentialRampToValueAtTime(38, now + 0.22);
      subGain.gain.setValueAtTime(0.3, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 0.25);

      // 2. Ruído de corte rasgando carne (filtro passa-faixa com modulação)
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.25);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(950, now);
      filter.frequency.exponentialRampToValueAtTime(350, now + 0.2);
      filter.Q.setValueAtTime(2.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.28, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.23);

      // 3. Squelch/esguicho de sangue viscoso (FM modulation leve)
      const squelch = this.ctx.createOscillator();
      const squelchGain = this.ctx.createGain();
      squelch.type = 'sawtooth';
      squelch.frequency.setValueAtTime(380, now);
      squelch.frequency.exponentialRampToValueAtTime(90, now + 0.16);

      squelchGain.gain.setValueAtTime(0.18, now);
      squelchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      squelch.connect(squelchGain);
      squelchGain.connect(this.ctx.destination);
      squelch.start(now);
      squelch.stop(now + 0.17);
    } catch {
      // Audio fallback
    }
  }
}

export const sounds = new SoundEngine();
