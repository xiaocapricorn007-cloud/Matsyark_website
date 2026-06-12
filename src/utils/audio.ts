/**
 * Pure programmatic Web Audio API Synthesizer for high-luxury UI micro-interactions.
 * No external media file requests, entirely code-synthesized, light-speed, secure.
 */

class UIPlaySynth {
  private ctx: AudioContext | null = null;
  public enabled: boolean = false;

  constructor() {
    // Lazy initialized on user activity
  }

  private initCtx() {
    if (this.ctx) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    } catch {
      // Audio not supported or blocked
    }
  }

  /**
   * Subtle high-class feedback hum on hover
   */
  public playHover() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(150, this.ctx.currentTime); // low pitch premium vibration
      osc.frequency.exponentialRampToValueAtTime(105, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {
      // Ignore audio thread block
    }
  }

  /**
   * Sub-bass synthetic toggle tick
   */
  public playClick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(350, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.18);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    } catch {
      // Ignore audio block
    }
  }

  /**
   * Majestic soft ascending chime on custom selections
   */
  public playChime() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const biquad = this.ctx.createBiquadFilter();

      osc.connect(biquad);
      biquad.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5 string
      osc.frequency.exponentialRampToValueAtTime(783.99, this.ctx.currentTime + 0.45); // slide to G5

      biquad.type = "peaking";
      biquad.frequency.setValueAtTime(600, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.45);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.45);
    } catch {
      // Ignore audio block
    }
  }
}

export const audioSynth = new UIPlaySynth();
