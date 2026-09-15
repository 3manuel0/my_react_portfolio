import React, { useCallback, useEffect, useRef, useState } from "react";
import { useOsSound } from "../../context/OsSoundContext";
import { AppIcon } from "../AppIcons";

// Fully self-contained chiptune player: each "track" is a tiny bar/beat pattern
// that gets pre-rendered into an AudioBuffer and looped. No external audio
// files, so it works offline and sidesteps licensing entirely.

interface Note {
  freq: number;
  start: number;
  dur: number;
}

interface TrackDef {
  id: string;
  name: string;
  meta: string;
  bpm: number;
  bars: number;
  melody: Note[];
  bass: Note[];
  percEvery: number;
}

const midiHz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

// Raw note builder: each token is [MIDI pitch, lengthInSixteenths].
// 4 = quarter note, 2 = eighth, 8 = half, 1 = sixteenth, 6 = dotted quarter.
function notes(tokens: Array<[number, number]>, start = 0): Note[] {
  const out: Note[] = [];
  let t = start;
  for (const [midi, dur] of tokens) {
    out.push({ freq: midiHz(midi), start: t / 4, dur: dur / 4 });
    t += dur;
  }
  return out;
}

// One accompaniment bar: eighth-note root/fifth chiptune pulse.
function pulseBar(root: number, fifth: number): Array<[number, number]> {
  return [root, fifth, root, fifth, root, fifth, root, fifth].map((n) => [
    n,
    2,
  ]);
}

// Repeat a token pattern n times.
function rep<T>(arr: T[], n: number): T[] {
  const out: T[] = [];
  for (let i = 0; i < n; i++) out.push(...arr);
  return out;
}

// ---- Korobeiniki (Tetris Theme A). A minor. Transcription from the
// canonical folk melody: e4. gis8 b4 gis8 e8 | a4. c8 e4 d8 c8 |
// b4. c8 d4 e4 | c4 a4 a2 || f4. g8 a4 g8 f8 | e4. f8 e4 d8 c8 |
// b4. c8 d4 e4 | c4 a4 a2
const tetrisA: Array<[number, number]> = [
  [64, 6],
  [68, 2],
  [71, 4],
  [68, 2],
  [64, 2],
  [69, 6],
  [72, 2],
  [76, 4],
  [74, 2],
  [72, 2],
  [71, 6],
  [72, 2],
  [74, 4],
  [76, 4],
  [72, 4],
  [69, 4],
  [69, 8],
];
const tetrisV2: Array<[number, number]> = [
  [65, 6],
  [67, 2],
  [69, 4],
  [67, 2],
  [65, 2],
  [64, 6],
  [65, 2],
  [64, 4],
  [62, 2],
  [60, 2],
  [59, 6],
  [60, 2],
  [62, 4],
  [64, 4],
  [60, 4],
  [57, 4],
  [57, 8],
];

const tetrisMel = notes([...tetrisA, ...tetrisA, ...tetrisV2]);

// Driving A pedal bass like the Game Boy (A2 - A3 octave pump).
const tetrisBass = notes(rep([[45, 2], [45, 2], [57, 2], [45, 2]], 9));

// ---- Ode to Joy (Beethoven, Symphony No. 9). D major.
const odeMel = notes([
  [76, 4], [76, 4], [78, 4], [79, 4],
  [79, 4], [78, 4], [76, 4], [74, 4],
  [73, 4], [73, 4], [74, 4], [76, 4],
  [76, 4], [74, 8],
  [76, 4], [76, 4], [78, 4], [79, 4],
  [79, 4], [78, 4], [76, 4], [74, 4],
  [73, 4], [73, 4], [74, 4], [76, 4],
  [74, 4], [73, 8],
]);

// Chords per bar: D D G D | G G A D, quarter-pulse roots.
const odeBass = notes([
  ...pulseBar(38, 45),
  ...pulseBar(38, 45),
  ...pulseBar(43, 50),
  ...pulseBar(38, 45),
  ...pulseBar(43, 50),
  ...pulseBar(43, 50),
  ...pulseBar(45, 52),
  ...pulseBar(38, 45),
]);

// ---- Für Elise (Beethoven). A minor, the famous opening motif.
const eliseP1: Array<[number, number]> = [
  [76, 2],
  [75, 1],
  [76, 2],
  [75, 1],
  [76, 2],
  [71, 1],
  [74, 2],
  [72, 1],
  [69, 3],
];
const eliseP2: Array<[number, number]> = [
  [72, 2],
  [76, 1],
  [81, 2],
  [83, 1],
  [76, 2],
  [80, 1],
  [76, 3],
];
const eliseRise: Array<[number, number]> = [
  [72, 2],
  [76, 1],
  [81, 2],
  [83, 1],
  [84, 2],
  [83, 1],
  [81, 2],
  [80, 1],
];
const eliseMel = notes([
  ...eliseP1,
  ...eliseP2,
  ...eliseRise,
  ...eliseP1,
  ...eliseP2,
  ...eliseRise,
]);

// Gentle A-minor roots under the piano line.
const eliseBass = notes([
  [45, 4], [45, 4], [52, 4], [52, 4],
  [45, 4], [45, 4], [52, 4], [52, 4],
  [48, 4], [48, 4], [52, 4], [52, 4],
  [45, 4], [45, 4], [52, 4], [52, 4],
  [45, 4], [45, 4], [52, 4], [52, 4],
  [48, 4], [48, 4], [52, 4], [52, 4],
]);

// ---- Canon in D (Pachelbel). The famous progression D A Bm F#m | G D G A.
const canonQA: Array<[number, number]> = [
  [74, 4],
  [69, 4],
  [71, 4],
  [66, 4],
  [67, 4],
  [62, 4],
  [67, 4],
  [69, 4],
];
const canonQB: Array<[number, number]> = [
  [71, 4],
  [66, 4],
  [68, 4],
  [63, 4],
  [64, 4],
  [71, 4],
  [64, 4],
  [66, 4],
];
const canonQC: Array<[number, number]> = [
  [69, 4],
  [64, 4],
  [66, 4],
  [61, 4],
  [62, 4],
  [69, 4],
  [62, 4],
  [64, 4],
];
const canonMel = notes([...canonQA, ...canonQA, ...canonQB, ...canonQC]);

const canonBass = notes([
  ...pulseBar(38, 45),
  ...pulseBar(45, 52),
  ...pulseBar(47, 54),
  ...pulseBar(42, 49),
  ...pulseBar(43, 50),
  ...pulseBar(38, 45),
  ...pulseBar(43, 50),
  ...pulseBar(45, 52),
]);

const TRACKS: TrackDef[] = [
  {
    id: "tetris",
    name: "korobeiniki_tetris_a.ch8",
    meta: "A minor · 140 BPM · folk",
    bpm: 140,
    bars: 9,
    melody: tetrisMel,
    bass: tetrisBass,
    percEvery: 1,
  },
  {
    id: "joy",
    name: "ode_to_joy.ch8",
    meta: "D major · 132 BPM · Beethoven",
    bpm: 132,
    bars: 8,
    melody: odeMel,
    bass: odeBass,
    percEvery: 1,
  },
  {
    id: "elise",
    name: "fur_elise.ch8",
    meta: "A minor · 116 BPM · Beethoven",
    bpm: 116,
    bars: 6,
    melody: eliseMel,
    bass: eliseBass,
    percEvery: 999,
  },
  {
    id: "canon",
    name: "canon_in_d.ch8",
    meta: "D major · 96 BPM · Pachelbel",
    bpm: 96,
    bars: 8,
    melody: canonMel,
    bass: canonBass,
    percEvery: 4,
  },
];

function synthesize(ctx: AudioContext, track: TrackDef): AudioBuffer {
  const sr = ctx.sampleRate;
  const beatSec = 60 / track.bpm;
  const beats = track.bars * 4;
  const duration = beats * beatSec;
  const len = Math.max(1, Math.ceil(duration * sr));
  const buf = ctx.createBuffer(2, len, sr);
  const L = buf.getChannelData(0);
  const R = buf.getChannelData(1);

  let mPhase = 0;
  let bPhase = 0;

  // Deterministic LCG noise so re-rendering a track sounds identical.
  let noiseState = 12345;

  for (let i = 0; i < len; i++) {
    const t = i / sr;
    const beat = t / beatSec;

    let mFreq = 0;
    for (const n of track.melody) {
      if (beat >= n.start && beat < n.start + n.dur) {
        mFreq = n.freq;
        break;
      }
    }
    let bFreq = 0;
    for (const n of track.bass) {
      if (beat >= n.start && beat < n.start + n.dur) {
        bFreq = n.freq;
        break;
      }
    }

    mPhase = (mPhase + mFreq / sr) % 1;
    bPhase = (bPhase + bFreq / sr) % 1;

    let out = 0;
    if (mFreq) out += (mPhase < 0.5 ? 1 : -1) * 0.17;
    if (bFreq) {
      const tri = 1 - 4 * Math.abs(bPhase - 0.5);
      out += tri * 0.3;
    }

    // Percussion: decaying noise click on every percEvery beats.
    const beatInCycle = beat % track.percEvery;
    if (beatInCycle < 0.09) {
      noiseState = (noiseState * 1103515245 + 12345) & 0x7fffffff;
      const noise = (noiseState / 0x7fffffff) * 2 - 1;
      out += noise * Math.exp(-beatInCycle * 45) * 0.16;
    }

    out = Math.tanh(out * 1.1);
    L[i] = R[i] = out;
  }
  return buf;
}

interface SoundState {
  ctx: AudioContext | null;
  master: GainNode | null;
  source: AudioBufferSourceNode | null;
  startedAt: number;
}

const fmt = (s: number) => {
  const total = Math.max(0, Math.floor(s));
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

const MediaPlayerApp: React.FC = () => {
  const { gain } = useOsSound();
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const sound = useRef<SoundState>({
    ctx: null,
    master: null,
    source: null,
    startedAt: 0,
  });
  const playingRef = useRef(false);
  playingRef.current = playing;

  const track = TRACKS[trackIdx];

  useEffect(() => {
    return () => {
      // App window closed (or StrictMode fake-unmount): stop audio cleanly.
      const s = sound.current;
      if (s.source) {
        try {
          s.source.onended = null;
          s.source.stop();
        } catch {
          /* already stopped */
        }
      }
      if (s.ctx && s.ctx.state !== "closed") s.ctx.close();
      sound.current = { ctx: null, master: null, source: null, startedAt: 0 };
      playingRef.current = false;
    };
  }, []);

  useEffect(() => {
    const s = sound.current;
    if (s.master) s.master.gain.value = gain;
  }, [gain]);

  const startTrack = useCallback(
    (idx: number, autoPlay: boolean) => {
      const s = sound.current;
      let ctx = s.ctx;
      if (!ctx || ctx.state === "closed") {
        const Ctor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        ctx = new Ctor();
        s.ctx = ctx;
        s.master = ctx.createGain();
        s.master.gain.value = gain;
        s.master.connect(ctx.destination);
      } else if (ctx.state === "suspended") {
        void ctx.resume();
      }

      if (s.source) {
        try {
          s.source.onended = null;
          s.source.stop();
        } catch {
          /* noop */
        }
        s.source = null;
      }

      if (!autoPlay) {
        setPlaying(false);
        setProgress(0);
        return;
      }

      const buffer = synthesize(ctx, TRACKS[idx]);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      src.connect(s.master!);
      s.source = src;
      s.startedAt = ctx.currentTime;
      src.onended = () => {
        s.source = null;
        if (playingRef.current) setPlaying(false);
      };
      src.start();
      setPlaying(true);
      setProgress(0);
    },
    [gain],
  );

  useEffect(() => {
    if (!playing) return;
    let raf: number;
    const loop = () => {
      const s = sound.current;
      const ctx = s.ctx;
      if (ctx && s.source) {
        const beatSec = 60 / track.bpm;
        const total = track.bars * 4 * beatSec;
        const pos = (ctx.currentTime - s.startedAt + total) % total;
        setProgress(pos / total);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, track]);

  const togglePlay = () => {
    if (playing) {
      sound.current.source?.stop();
      setPlaying(false);
    } else {
      startTrack(trackIdx, true);
    }
  };

  const selectTrack = (idx: number) => {
    setTrackIdx(idx);
    startTrack(idx, true);
  };

  const skip = (dir: 1 | -1) => {
    const next = (trackIdx + dir + TRACKS.length) % TRACKS.length;
    setTrackIdx(next);
    startTrack(next, playing);
  };

  const durationSec = (track.bars * 4 * 60) / track.bpm;

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#0d1219]">
      <div className="flex items-center gap-2 border-b border-os-border px-3 py-2">
        <AppIcon name="music" size={15} />
        <p className="font-mono text-[0.66rem] font-bold text-os-text">
          media://local
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
        {/* Now playing */}
        <div className="border border-os-border bg-os-surface2/40 p-3">
          <p className="font-mono text-[0.55rem] text-os-dim">now playing</p>
          <p className="mt-0.5 truncate text-sm font-bold text-os-green">
            {track.name}
          </p>
          <p className="font-mono text-[0.55rem] text-os-dim">{track.meta}</p>

          <div
            className="mt-2.5 h-2 w-full border border-os-border bg-os-bg"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
          >
            <div
              className="h-full bg-os-accent transition-[width] duration-200"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between font-mono text-[0.52rem] text-os-dim">
            <span>{fmt(progress * durationSec)}</span>
            <span>{fmt(durationSec)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            aria-label="Previous track"
            title="Previous"
            onClick={() => skip(-1)}
            className="flex h-9 w-9 items-center justify-center border border-os-border text-os-text hover:border-os-accent hover:text-os-accent"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M1 1 L1 11 A1 1 0 0 1 0 11 L0 1 A1 1 0 0 1 1 1 Z M11 1 L11 11 L4 6 Z" />
            </svg>
          </button>
          <button
            type="button"
            aria-label={playing ? "Pause" : "Play"}
            onClick={togglePlay}
            className="flex h-11 w-11 items-center justify-center border border-os-accent bg-os-accent/10 text-[0.7rem] font-bold text-os-accent hover:bg-os-accent hover:text-black"
          >
            {playing ? (
              <span className="flex gap-1" aria-hidden="true">
                <span className="block h-3.5 w-1 bg-current" />
                <span className="block h-3.5 w-1 bg-current" />
              </span>
            ) : (
              <span
                className="block"
                aria-hidden="true"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "10px solid currentColor",
                  borderTop: "7px solid transparent",
                  borderBottom: "7px solid transparent",
                  marginLeft: 3,
                }}
              />
            )}
          </button>
          <button
            type="button"
            aria-label="Next track"
            title="Next"
            onClick={() => skip(1)}
            className="flex h-9 w-9 items-center justify-center border border-os-border text-os-text hover:border-os-accent hover:text-os-accent"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M1 1 L8 6 L1 11 Z M9 1 L9 11 A1 1 0 0 1 10 11 L10 1 A1 1 0 0 1 9 1 Z" />
            </svg>
          </button>
          <span className="ml-2 font-mono text-[0.55rem] text-os-dim">
            {playing ? "playing" : "paused"}
          </span>
        </div>

        {/* Playlist */}
        <div className="mt-auto border-t border-os-border pt-2">
          <p className="mb-1 font-mono text-[0.55rem] uppercase tracking-widest text-os-dim">
            playlist
          </p>
          {TRACKS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => selectTrack(i)}
              className={`flex w-full items-center gap-2 px-1.5 py-1.5 text-left text-[0.64rem] transition-colors ${
                i === trackIdx
                  ? "bg-os-blue/15 text-os-blue"
                  : "text-os-text hover:bg-os-blue/10"
              }`}
            >
              <span className="font-mono text-[0.55rem] text-os-dim">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="truncate font-bold">{t.name}</span>
              <span className="ml-auto font-mono text-[0.52rem] text-os-dim">
                {t.bpm} BPM
              </span>
              {i === trackIdx && playing && (
                <span className="block h-1.5 w-1.5 bg-os-green" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaPlayerApp;