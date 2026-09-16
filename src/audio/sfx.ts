/* eslint-disable @typescript-eslint/no-explicit-any */
// Synthesized retro UI sound effects. No audio files: every blip is generated
// with WebAudio oscillators/envelopes so it ships for free and works offline.
// All sounds are sub-second and respect the master volume from OsSoundContext.

export type SfxName =
  | "startup"
  | "open"
  | "close"
  | "minimize"
  | "maximize"
  | "restore"
  | "click"
  | "error"
  | "notify";

type FireFx = (ctx: AudioContext, out: GainNode, t0: number) => void;

let noiseBuffer: AudioBuffer | null = null;

function getNoise(ctx: AudioContext): AudioBuffer {
  if (!noiseBuffer || noiseBuffer.sampleRate !== ctx.sampleRate) {
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuffer.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

/** Short oscillator blip with attack + exponential decay. */
function blip(
  ctx: AudioContext,
  out: GainNode,
  type: OscillatorType,
  f0: number,
  f1: number,
  dur: number,
  peak: number,
  t0: number,
) {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(Math.max(1, f0), t0);
  if (f1 !== f0) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t0 + dur);
  }
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(out);
  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}

/** Filtered-noise "tick" — subtle UI click. */
function tick(ctx: AudioContext, out: GainNode, t0: number) {
  const src = ctx.createBufferSource();
  src.buffer = getNoise(ctx);
  const flt = ctx.createBiquadFilter();
  flt.type = "lowpass";
  flt.frequency.value = 5200;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(0.06, t0 + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.04);
  src.connect(flt).connect(g).connect(out);
  src.start(t0);
  src.stop(t0 + 0.06);
}

const FX: Record<SfxName, FireFx> = {
  // Power-on arpeggio (C5 E5 G5 C6 + a triangle tail).
  startup: (ctx, out, t0) => {
    const seq = [523.25, 659.25, 783.99, 1046.5];
    seq.forEach((f, i) =>
      blip(ctx, out, "square", f, f, 0.11, 0.09, t0 + i * 0.08),
    );
    blip(ctx, out, "triangle", 1046.5, 1568, 0.24, 0.055, t0 + seq.length * 0.08);
  },
  open: (ctx, out, t0) => blip(ctx, out, "square", 420, 880, 0.1, 0.08, t0),
  close: (ctx, out, t0) => blip(ctx, out, "square", 760, 300, 0.13, 0.07, t0),
  minimize: (ctx, out, t0) => blip(ctx, out, "square", 430, 240, 0.09, 0.06, t0),
  maximize: (ctx, out, t0) => blip(ctx, out, "square", 240, 460, 0.09, 0.06, t0),
  restore: (ctx, out, t0) => blip(ctx, out, "square", 300, 500, 0.08, 0.05, t0),
  click: (ctx, out, t0) => tick(ctx, out, t0),
  error: (ctx, out, t0) => {
    blip(ctx, out, "square", 165, 165, 0.09, 0.07, t0);
    blip(ctx, out, "square", 130, 130, 0.1, 0.07, t0 + 0.1);
  },
  notify: (ctx, out, t0) => {
    blip(ctx, out, "sine", 880, 880, 0.1, 0.08, t0);
    blip(ctx, out, "sine", 1318, 1318, 0.16, 0.06, t0 + 0.09);
  },
};

class SfxEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private volume = 1;
  private pending: SfxName[] = [];

  /** Set the master gain (0..1). Keep in sync with OsSoundContext. */
  setVolume(v: number) {
    const clamped = Math.min(1, Math.max(0, v));
    this.volume = clamped;
    if (this.ctx && this.master) {
      this.master.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.015);
    }
  }

  /**
   * Create/resume the AudioContext. Browsers only allow audio after a user
   * gesture, so call this from pointer/key handlers. Queued sounds flush
   * once the context reaches the "running" state.
   */
  unlock() {
    if (this.ctx && this.ctx.state === "running") {
      this.flush();
      return;
    }
    if (!this.ctx) {
      const Ctor =
        globalThis.AudioContext ??
        (globalThis as any).webkitAudioContext;
      if (!Ctor) return;
      const ctx = new Ctor();
      const master = ctx.createGain();
      master.gain.value = this.volume;
      master.connect(ctx.destination);
      this.ctx = ctx;
      this.master = master;
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume().then(() => this.flush());
    }
  }

  /** Queue and play a sound (safe to call before any user interaction). */
  play(name: SfxName) {
    this.pending.push(name);
    this.unlock();
  }

  private flush() {
    if (!this.ctx || this.ctx.state !== "running" || !this.master) return;
    const queued = this.pending;
    this.pending = [];
    const t0 = this.ctx.currentTime + 0.005;
    for (const name of queued) FX[name](this.ctx, this.master, t0);
  }
}

export const sfx = new SfxEngine();