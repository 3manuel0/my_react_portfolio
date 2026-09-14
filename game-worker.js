// game-worker.js — Web Worker that runs the raylib 2D platformer via OffscreenCanvas.
// Provides DOM shims so wasmlib.js + raylib.js run without a real document.

const GAME_ORIGIN = "https://3manuel0.github.io/2dPlatformerGame/";

// Workers have no `window` — alias it to `self` so wasmlib/raylib globals work
self.window = self;

// ---------------------------------------------------------------
// 1.  Fetch interception — rewrite relative URLs to the game origin
// ---------------------------------------------------------------
const _origFetch = self.fetch.bind(self);
self.fetch = function (input, init) {
  const url = typeof input === "string" ? input : input && input.url;
  if (url && !url.startsWith("http") && !url.startsWith("blob:")) {
    input = GAME_ORIGIN + url.replace(/^\.\//, "");
  }
  return _origFetch(input, init);
};

// ---------------------------------------------------------------
// 2.  Save/load relay.
//     The web build of the game reads/writes wasm memory directly and the
//     page script persisted it to localStorage. Workers can't touch
//     localStorage, so we cache the save here and tell the main thread to
//     persist it. The main thread feeds the initial save back via
//     { type: "save-data" }.
// ---------------------------------------------------------------
let _saveCache = { playerX: null, playerY: null, cameraX: null, hp: null };

function _saveNow() {
  try {
    self.postMessage({ type: "save", data: { ..._saveCache } });
  } catch (e) {
    console.warn("[game] save relay failed:", e);
  }
}

// Safety stub — workers have no localStorage; the page script used it, the
// glue itself doesn't. Any unexpected access returns null instead of throwing.
self.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  get length() {
    return 0;
  },
  key: () => null,
};

// Called by the game's env (loadSavedGame) with (player_ptr, camera_ptr).
self.loadSave = (player_ptr, camera_ptr) => {
  if (typeof wasm === "undefined" || !wasm?.instance) return;
  try {
    const buffer = wasm.instance.exports.memory.buffer;
    const px = parseFloat(_saveCache.playerX);
    const py = parseFloat(_saveCache.playerY);
    const cx = parseFloat(_saveCache.cameraX);
    const hp = parseInt(_saveCache.hp, 10);
    new Float32Array(buffer, player_ptr, 1).set([Number.isFinite(px) ? px : 0]);
    new Float32Array(buffer, player_ptr + 4, 1).set([Number.isFinite(py) ? py : 0]);
    new Float32Array(buffer, camera_ptr, 1).set([Number.isFinite(cx) ? cx : 0]);
    new Uint32Array(buffer, player_ptr + 16 + 16 + 4, 1).set([
      Number.isFinite(hp) ? hp : 1000,
    ]);
  } catch (e) {
    console.warn("[game] loadSave failed:", e);
  }
};

// Called by the game's env (saveGame) with (player_ptr, camera_ptr).
self.SaveGamejs = (player_ptr, camera_ptr) => {
  if (typeof wasm === "undefined" || !wasm?.instance) return;
  try {
    const buffer = wasm.instance.exports.memory.buffer;
    const [x, y] = new Float32Array(buffer, player_ptr, 2);
    const [camx] = new Float32Array(buffer, camera_ptr, 1);
    const [hp] = new Uint32Array(buffer, player_ptr + 16 + 16 + 4, 1);
    _saveCache = {
      playerX: String(x),
      playerY: String(y),
      cameraX: String(camx),
      hp: String(hp),
    };
    _saveNow();
  } catch (e) {
    console.warn("[game] SaveGamejs failed:", e);
  }
};

// ---------------------------------------------------------------
// 3.  Image shim — fetch + createImageBitmap in the worker
// ---------------------------------------------------------------
class WorkerImage {
  constructor() {
    this._src = "";
    this._bitmap = null;
    this._ready = false;
    this._loadCallbacks = [];
    this._w = 0;
    this._h = 0;
  }
  get src() {
    return this._src;
  }
  set src(val) {
    this._src = val;
    this._ready = false;
    const abs = val.startsWith("http") ? val : GAME_ORIGIN + val.replace(/^\.\//, "");
    fetch(abs)
      .then((r) => r.blob())
      .then((b) => createImageBitmap(b))
      .then((bmp) => {
        this._bitmap = bmp;
        this._w = bmp.width;
        this._h = bmp.height;
        this._ready = true;
        for (const cb of this._loadCallbacks) cb();
      })
      .catch((err) => console.warn("[game] image load failed:", this._src, err));
  }
  get width() {
    return this._w;
  }
  get height() {
    return this._h;
  }
  addEventListener(_evt, cb) {
    this._loadCallbacks.push(cb);
  }
}
self.Image = WorkerImage;

// Audio shim — the game's LoadMusicStream does `new Audio(path)` and
// UpdateMusicStream calls `audio.play()` every frame. Workers have no audio,
// so we relay only real state changes to the main thread which owns an
// HTMLAudioElement. Play is posted once (the main thread loops it).
let _audioState = { src: null, volume: 1, loop: false, started: false };
self.Audio = class {
  constructor(src) {
    this._src = null;
    if (src != null) this.src = src;
  }
  get src() {
    return this._src;
  }
  set src(val) {
    this._src = val;
    _audioState.src = val;
    _audioState.started = false;
    self.postMessage({ type: "audio", cmd: "load", src: val });
  }
  play() {
    if (!_audioState.started) {
      _audioState.started = true;
      self.postMessage({ type: "audio", cmd: "play", src: this._src });
    }
    return Promise.resolve();
  }
  pause() {
    _audioState.started = false;
    self.postMessage({ type: "audio", cmd: "pause" });
  }
  set volume(v) {
    if (v !== _audioState.volume) {
      _audioState.volume = v;
      self.postMessage({ type: "audio", cmd: "volume", volume: v });
    }
  }
  get volume() {
    return _audioState.volume;
  }
  set loop(v) {
    if (!!v !== _audioState.loop) {
      _audioState.loop = !!v;
      self.postMessage({ type: "audio", cmd: "loop", loop: !!v });
    }
  }
  get loop() {
    return _audioState.loop;
  }
};

// Events like KeyboardEvent/MouseEvent don't exist in Workers — shim them.
// The game's glue only reads e.code/e.key (keyboard) and e.button/e.clientX/e.clientY (mouse).
if (typeof KeyboardEvent === "undefined") {
  self.KeyboardEvent = class extends Event {
    constructor(type, props = {}) {
      super(type, props);
      this.code = props.code ?? "";
      this.key = props.key ?? "";
    }
  };
}
if (typeof MouseEvent === "undefined") {
  self.MouseEvent = class extends Event {
    constructor(type, props = {}) {
      super(type, props);
      this.button = props.button ?? 0;
      this.clientX = props.clientX ?? 0;
      this.clientY = props.clientY ?? 0;
    }
  };
}

// rAF polyfill — workers have no requestAnimationFrame. Instead of a fixed
// setTimeout (which jitters), the MAIN THREAD drives the loop: its real
// requestAnimationFrame posts { type:"tick", timestamp } on each vsync.
// The shim just stores the callback; the tick message fires it.
let _pendingRafCb = null;
let _pendingRafId = 0;
self.requestAnimationFrame = function (cb) {
  _pendingRafCb = cb;
  return ++_pendingRafId;
};
self.cancelAnimationFrame = function () {
  _pendingRafCb = null;
};

// ---------------------------------------------------------------
// 4.  OffscreenCanvas backing + live canvas shim
//     raylib.js does   canvas = document.getElementById("canvas");
//                      ctx = canvas.getContext("2d");     → must be real
//                      InitWindow:  canvas.width = w;    → writes through
//                      GetMousePosition: ctx.canvas.getBoundingClientRect()
//
//     getContext("2d") returns a Proxy that dynamically delegates
//     to _ctx once the OffscreenCanvas arrives via postMessage,
//     eliminating any microtask/macrotask race on startup.
// ---------------------------------------------------------------
let _offscreen = null;
let _ctx = null;
let _displayRect = { width: 800, height: 600 };

const canvasShim = {
  get width() {
    return _offscreen ? _offscreen.width : 800;
  },
  set width(v) {
    if (_offscreen) _offscreen.width = v;
  },
  get height() {
    return _offscreen ? _offscreen.height : 600;
  },
  set height(v) {
    if (_offscreen) _offscreen.height = v;
  },
  getContext(type) {
    if (type !== "2d") return null;
    // Return a Proxy so raylib can capture ctx = getContext("2d") even before
    // the OffscreenCanvas message arrives. Once _ctx is set the proxy delegates
    // to the real patched 2d context.
    return new Proxy(
      {},
      {
        get(_t, prop) {
          if (prop === "canvas") return canvasShim;
          if (prop === "__patched") return !!_ctx;
          if (!_ctx) {
            // Before _ctx arrives, silently no-op so raylib can run
            // InitWindow and register listeners without crashing.
            return typeof prop === "symbol" ? undefined : () => {};
          }
          const val = _ctx[prop];
          return typeof val === "function" ? val.bind(_ctx) : val;
        },
        set(_t, prop, value) {
          if (_ctx) _ctx[prop] = value;
          return true;
        },
      },
    );
  },
  getBoundingClientRect() {
    return { left: 0, top: 0, width: _displayRect.width, height: _displayRect.height };
  },
  addEventListener() {},
};

// Patch drawImage to unwrap WorkerImage → ImageBitmap, and expose the
// shim as ctx.canvas so GetMousePosition's getBoundingClientRect works.
// NEVER forwards an invalid source to the native method — whatever comes in
// that isn't a ready bitmap/canvas is skipped with a warning instead of
// throwing (a crash here killed the whole game loop before).
function patchCtx(ctx) {
  if (!ctx || ctx.__patched) return;
  const orig = ctx.drawImage.bind(ctx);
  ctx.drawImage = function (img, ...rest) {
    if (img === null || img === undefined) {
      // Texture slot not filled yet — silent skip.
      return;
    }
    if (img instanceof WorkerImage) {
      if (!img._bitmap) return; // image not loaded yet — skip silently
      return orig(img._bitmap, ...rest);
    }
    // In a worker the only valid native sources are ImageBitmap and
    // OffscreenCanvas — everything else would throw, so skip it:
    if (img instanceof ImageBitmap || img instanceof OffscreenCanvas) {
      return orig(img, ...rest);
    }
    console.warn("[game] drawImage skipped (unsupported image arg):", img);
    return;
  };
  try {
    Object.defineProperty(ctx, "canvas", {
      value: canvasShim,
      writable: false,
      configurable: true,
    });
  } catch (_e) {
    /* noop */
  }
  ctx.__patched = true;
}

// Fake document.getElementById — returns the objects raylib.js expects.
// Stubs are cached so assignments stick (e.g. #play.onclick).
const _elementStubs = {};

function _makeElementStub() {
  return {
    style: {},
    display: "block",
    onclick: null,
    addEventListener() {},
  };
}

self.document = {
  getElementById: function (id) {
    if (id === "canvas") return canvasShim;
    if (!_elementStubs[id]) _elementStubs[id] = _makeElementStub();
    return _elementStubs[id];
  },
};

// ---------------------------------------------------------------
// 5.  Messages from the main thread
// ---------------------------------------------------------------
self.onmessage = function (e) {
  const d = e.data;

  if (d.type === "tick") {
    // Main thread's real requestAnimationFrame fires this on each vsync.
    if (_pendingRafCb) {
      const cb = _pendingRafCb;
      _pendingRafCb = null;
      cb(d.timestamp);
    }
    return;
  }

  if (d.type === "canvas") {
    try {
      _offscreen = d.canvas;
      _ctx = _offscreen.getContext("2d");
      patchCtx(_ctx);
      self.postMessage({ type: "ready" });
    } catch (err) {
      console.error("[game] failed to initialise OffscreenCanvas:", err);
      self.postMessage({ type: "error", message: String(err) });
    }
    return;
  }

  if (d.type === "save-data") {
    // Pre-populate the save cache (from localStorage on the main thread).
    const s = d.data ?? {};
    _saveCache = {
      playerX: s.playerX ?? null,
      playerY: s.playerY ?? null,
      cameraX: s.cameraX ?? null,
      hp: s.hp ?? null,
    };
    return;
  }

  if (d.type === "resize") {
    _displayRect = { width: d.width, height: d.height };
    return;
  }

  if (d.type === "keydown") {
    self.dispatchEvent(
      new KeyboardEvent("keydown", { code: d.code, key: d.key, cancelable: true })
    );
    return;
  }

  if (d.type === "keyup") {
    self.dispatchEvent(
      new KeyboardEvent("keyup", { code: d.code, key: d.key, cancelable: true })
    );
    return;
  }

  if (d.type === "mousedown") {
    self.dispatchEvent(
      new MouseEvent("mousedown", { button: d.button, clientX: d.x, clientY: d.y, cancelable: true })
    );
    return;
  }

  if (d.type === "mousemove") {
    self.dispatchEvent(
      new MouseEvent("mousemove", { clientX: d.x, clientY: d.y, cancelable: true })
    );
    return;
  }

  if (d.type === "mouseup") {
    self.dispatchEvent(
      new MouseEvent("mouseup", { button: d.button, clientX: d.x, clientY: d.y, cancelable: true })
    );
    return;
  }
};

// ---------------------------------------------------------------
// 6.  Load the real game glue — YOUR files, untouched.
//     Same references the deployed game page uses.
// ---------------------------------------------------------------
importScripts(
  "https://cdn.jsdelivr.net/gh/3manuel0/gamelib@latest/wasmlib.js",
  "https://cdn.jsdelivr.net/gh/3manuel0/gamelib/raylib.js"
);

// raylib.js sets  playing=true  via  #play.onclick  synchronously at the end.
// Auto-trigger it once the glue has finished setting the handler.
setTimeout(function () {
  const playEl = document.getElementById("play");
  if (playEl && playEl.onclick) playEl.onclick();
}, 200);
