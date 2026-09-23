// Blog / notes content. Each entry is a light markdown-ish document rendered by
// the Notes app's tiny renderer:
//   - "# heading" / "## subheading"
//   - "> quote"
//   - "- list" / "- list"
//   - ``` fenced code blocks ```
//   - inline **bold**, `code`, and [label](url)
//
// Add a new object here (unique slug) and it shows up everywhere the app
// surfaces notes: desktop+phone icons via the app registry, the Files app,
// and `~/notes` in the terminal's virtual filesystem.

export interface Note {
  slug: string;
  title: string;
  /** ISO date, displayed as-is. */
  date: string;
  readMinutes: number;
  tags: string[];
  excerpt: string;
  content: string;
}

export const notes: Note[] = [
  {
    slug: "implementing-a-csv-parser-in-c",
    title: "Implementing a CSV Parser in C, Memory-Safe and Fast",
    date: "2026-03-20",
    readMinutes: 6,
    tags: ["C", "Parsing", "Performance"],
    excerpt:
      "Reading a CSV without strtok: load the file into memory, scan it once with a quote state, hand every field to the arena, and let string views do the slicing.",
    content: `[C3SV](https://github.com/3manuel0/C3SV) originally started without a solid foundation — I rewrote it once I had [Lib3man](https://github.com/3manuel0/Lib3man) to stand on. The goal is a CSV you load once into memory and treat as data structures, not text.

# The plan

- parse a file into a CSV struct in memory
- automatic type inference: string_view, int64, float64
- write the struct back as a CSV or JSON file

# Reading the file once

The whole file goes into one buffer, then it's scanned once to count columns and rows while tracking a quote state:

\`\`\`c
u8 is_quotes = false;
for (; mem[i] != '\n' && mem[i] != 0; i++) {
    if (mem[i] == '"' && is_quotes) is_quotes = false;
    else if (mem[i] == '"') is_quotes = true;
    if (mem[i] == ',' && !is_quotes) { /* field boundary */ }
}
\`\`\`

The \`"value, with comma"\` case is what kills naive \`strtok\` splitting — only a comma outside the quotes separates fields.

# Fields live in the arena

Every cell is a \`string_view\` allocated inside an [ArenaList](https://github.com/3manuel0/Lib3man) (\`MiB(250)\` at load time), so a field is a pointer + length and the whole table frees with one \`arenaList_free\`.

# Type inference

After the strings settle, each cell goes through \`get_type\`:

- \`sv_to_int64\` — manual parse with length and overflow guards
- \`sv_to_float64\` — digits, dot, then a hand-rolled \`e\` exponent so the parser never links \`-lm\`
- fallback: \`string_view\`

# Status

Working today: load to struct, quoted commas, int64/float64/string_view inference, JSON output, and writing the struct back to \`.csv\`. It's a learning project and not near complete — but it already feeds both [ml-from-scratch](https://github.com/3manuel0/ml-from-scratch) and the web version.

# Lessons

- Count rows/columns before allocating anything
- Split with a quote state, not a delimiter check
- An arena + string views turns parsing into slicing

[source code](https://github.com/3manuel0/C3SV) · C99, zero dependencies beyond Lib3man.`,
  },
  {
    slug: "learning-ml-from-scratch-in-c",
    title: "Learning Machine Learning From the Ground Up in C",
    date: "2026-05-20",
    readMinutes: 7,
    tags: ["C", "Machine Learning"],
    excerpt:
      "No numpy, no torch: linear regression and matrix code in C99, reading training data with the CSV parser I wrote myself.",
    content: `The rule of thumb that got me here: don't import what you haven't at least once written badly. The [ml-from-scratch](https://github.com/3manuel0/ml-from-scratch) project implements the math in plain C99 on top of Lib3man's Matrix and my own CSV parser.

# Feeding the data

Training examples come from a CSV read by [C3SV](https://github.com/3manuel0/C3SV):

\`\`\`c
CSV *csv = load_csv("test.csv");
f64 *values  = malloc(csv->numrows * sizeof(f64));
f64 *results = malloc(csv->numrows * sizeof(f64));
for (size_t i = 0; i < csv->numrows; i++) {
    values[i]  = (f64)csv_get_int_by_name(csv, i, sv_from_lit("x"));
    results[i] = csv_get_float_by_name(csv, i, sv_from_lit("y"));
}
linear_regressionLS(values, results, csv->numrows);
\`\`\`

# First pass: least squares

The closed form first — means first, then slope, then intercept:

\`\`\`c
f64 mean_x = calc_mean(values, count);
f64 mean_y = calc_mean(results, count);
f64 numerator = 0, denominator = 0;
for (size_t i = 0; i < count; i++) {
    numerator   += (values[i] - mean_x) * (results[i] - mean_y);
    denominator += (values[i] - mean_x) * (values[i] - mean_x);
}
if (denominator == 0) return;
f64 m = numerator / denominator;
f64 b = mean_y - m * mean_x;
\`\`\`

# Second pass: gradient descent

The raw loop — no momentum, no batching, and a learning rate small enough to be honest about the scale of the data:

\`\`\`c
f64 a = 0, b = 0, lr = 0.0000001;
for (size_t i = 0; i < iter; i++)
    for (size_t j = 0; j < count; j++) {
        f64 x = values[j], y = results[j];
        f64 error = (a * x + b) - y;
        a -= lr * error * x;
        b -= lr * error;
    }
\`\`\`

# Matrix work

Before a network step exists, the gadgets are exercised standalone: create, fill, copy, scale, add, sub, map, and \`matrix_randomize\` to seed weights. \`sigmoid\` and \`relu\` are used as map functions.

# Next up

A single-hidden-layer MLP with backprop — the bookkeeping (activations, deltas, pre-activations) is where the index arithmetic will hurt the most. That's the whole point.`,
  },
  {
    slug: "why-i-use-void-linux",
    title: "Why I Use Void Linux",
    date: "2025-10-12",
    readMinutes: 4,
    tags: ["Linux", "Void"],
    excerpt:
      "XBPS, runit, and a window manager setup small enough to see through — the OS as a tool, not an appliance.",
    content: `I drift toward tools I can see through, and Void is that for me: XBPS for packages and runit as the init, both small enough to read.

# What's in my dotfiles

The [dotfiles](https://github.com/3manuel0/dotfiles) repo is the actual setup I run:

- **qtile** as the window manager, with a decorated bar and custom key bindings
- **picom** as the compositor
- **alacritty** as the terminal
- **rofi** for launching, **dunst** for notifications
- **feh** fed by a stored wallpaper path, **btop** for resource views

The \`autostart.sh\` is the shape of an idle session: DPMS off, numlock fixed, nm-applet and a policykit agent running, picom and dunst up, and a couple of alacritty shells (htop + tty-clock) for the ambient desktop look.

# Why XBPS + runit

- \`xbps-install\` is fast and resolves dependencies at install time
- runit services are a directory with a \`run\` script — no unit compiler between you and the daemon
- \`xbps-static\` exists for booting into recovery when the main system breaks

For a student who wants to know what an init actually does, that's a feature.

# The trade-off

Less corporate polish, more you-check-the-docs. The docs are good.

> An init you can read is an init you'll never fear debugging at 2am.`,
  },
  {
    slug: "porting-raylib-to-the-browser-with-webassembly",
    title: "Porting a Raylib Game to the Browser Without Emscripten",
    date: "2026-04-12",
    readMinutes: 6,
    tags: ["C", "WebAssembly", "Raylib"],
    excerpt:
      "clang targets wasm32 directly and a hand-rolled JavaScript bridge links raylib's exported functions to the canvas — no emscripten in sight.",
    content: `Most raylib-web examples reach for emscripten, which builds everything for you. I went the other way: compile with plain clang and write the browser half by hand. It's how I actually learned what a wasm import/export is.

# The compile command

\`\`\`sh
clang --target=wasm32 --no-standard-libraries \
  -I./include -Wl,--export-all -Wl,--no-entry \
  -Wl,--allow-undefined -DPLATFORM_WEB -o game.wasm game.c
\`\`\`

No libc, no startup. \`--allow-undefined\` is on because raylib's functions are provided by the browser side at instantiation time.

# The JS bridge

[gamelib](https://github.com/3manuel0/gamelib) is the reusable half: \`raylib.js\` binds raylib's exported functions to the canvas (input keys are mapped onto the raylib \`KeyboardKey\` enum) and \`wasmlib.js\` provides a \`printf\` plus string helpers. The game only exposes \`GameFrame()\`, so the same C file runs on desktop with a \`while (!WindowShouldClose())\` loop and in the browser with whatever the page drives.

# Imports you didn't implement fail loudly

\`\`\`js
make_environment: (env) => new Proxy(env, {
  get(target, prop) {
    if (env[prop] !== undefined) return env[prop].bind(env);
    return (...args) => {
      throw new Error(\`NOT IMPLEMENTED: \${prop}\`);
    };
  }
})
\`\`\`

The unhandled import is a discovery tool, not an error.

# Reading strings out of wasm

\`\`\`js
const get_str = (str_ptr) => {
  const buffer = wasm.instance.exports.memory.buffer;
  const mem = new Uint8Array(buffer);
  let len = 0;
  while (mem[str_ptr + len] != 0) len++;
  return new TextDecoder().decode(new Uint8Array(buffer, str_ptr, len));
};
\`\`\`

# Credit

The approach is inspired by [Tsoding's](https://www.youtube.com/@TsodingDaily) raylib-wasm stream — adapting it was my way in. The [2d platformer](https://3manuel0.github.io/2dPlatformerGame/) was the first real target of this bridge, and [FToP](https://github.com/3manuel0/FToP) uses the same idea for a file-to-PNG tool.

[source: raylib_wasm](https://github.com/3manuel0/raylib_wasm) · [source: gamelib](https://github.com/3manuel0/gamelib)`,
  },
  {
    slug: "arenas-and-string-views-a-tiny-memory-toolkit",
    title: "Arenas and String Views: A Tiny Memory Toolkit",
    date: "2026-09-10",
    readMinutes: 5,
    tags: ["C", "Memory"],
    excerpt:
      "The Arena, ArenaList, string view and string buffer at the bottom of everything I ship in C — including the bugs I wrote while learning them.",
    content: `[Lib3man](https://github.com/3manuel0/Lib3man) started as \`can I hand-roll this and learn it\` and became the base of every other C project here. Two ideas carry it: the arena and the length-based string.

# Arena

All allocations are bump-pointer slices out of one big block:

\`\`\`c
typedef struct {
  void *memory;    // the block we own
  void *address;   // bump pointer
  size_t capacity;
  size_t cur_size;
} Arena;
\`\`\`

\`arena_Alloc\` aligns the request (16 on 64-bit, selected via \`UINTPTR_MAX\`), hands back a pointer, and bumps. \`arena_reset\` just rewinds the cursor. \`arena_free\` is a single \`free\`.

# ArenaList

Because one arena isn't always big enough, there's a linked list of arenas that doubles capacity when the head is full:

\`\`\`c
typedef struct ArenaList {
  Arena arena;
  struct ArenaList *prev;
  struct ArenaList *next;
} ArenaList;
\`\`\`

\`arenaList_free\` walks back through \`prev\` and frees everything in one pass.

# String view

\`sv\` is a pointer + length. Slicing is pointer arithmetic, never a copy:

\`\`\`c
typedef struct {
  char *str;
  size_t len;
} string_view;
typedef string_view sv;
\`\`\`

The parsers lean on it hard — \`sv_to_int64\` and \`sv_to_float64\` parse and reject numbers by hand, and the float one implements \`1e-3\`-style exponents without \`pow\` because it refuses to link \`-lm\`.

\`\`\`c
if (sv->str[i] != 'e' && sv->str[i] != 'E') return false;
i++;
u8 neg = 0; int exp = 0;
if (sv->str[i] == '+') neg = 0;
else if (sv->str[i] == '-') neg = 1;
else return false;
\`\`\`

# String buffer

\`sb\` is the owning, growable cousin (\`str\`/\`len\`/\`cap\`, realloc on growth), with arena-backed variants like \`create_sb_inside_arenaList\`.

# The honest part

There's a \`BUGS.md\` for a reason: the \`arenaList_Realloc\` TODO, alignment edge cases, and "string view inside ArenaList" are all tracked there. The point of the project is the process, not polish.

> Manual memory management is fine once you stop asking who owns each byte, and answer it once.`,
  },
  {
    slug: "building-a-gameboy-emulator-from-scratch",
    title: "Building a Game Boy Emulator From Scratch (Work In Progress)",
    date: "2025-09-20",
    readMinutes: 5,
    tags: ["C", "Emulation", "GameBoy"],
    excerpt:
      "Honestly early: a cartridge loader, a switch-based CPU with a handful of opcodes, and raylib drawing VRAM tiles.",
    content: `The [Game Boy emulator](https://github.com/3manuel0/gb_emu) is the "C and memory" thesis in its most honest form — and it's very early. The README says it up front: incomplete, just starting, mostly for fun and for learning about emulation.

# What exists

- a cartridge loader that reads \`.gb\` ROMs
- ROM copied into a 64 KB \`u8 memory[0x10000]\`
- a switch-based \`run_inst\` covering a handful of instructions
- a raylib window that draws tiles straight out of VRAM

# The CPU is a switch

\`\`\`c
switch (memory[cpu_reg->PC]) {
    case 0x01: // LD BC, n16
        cpu_reg->BC = (memory[cpu_reg->PC + 1] | (memory[cpu_reg->PC + 2] << 8));
        cpu_reg->PC += 3;
        number_of_cycles(12);
        break;
    case 0xc3: // JP a16
        cpu_reg->PC = (memory[cpu_reg->PC + 1] | (memory[cpu_reg->PC + 2] << 8));
        number_of_cycles(16);
        break;
    default:
        cpu_reg->PC++;
        break;
}
\`\`\`

\`number_of_cycles\` only prints the cycle count for now — real timing is the big TODO.

# First "boot"

The main loop runs the first 100 instructions from \`PC = 0x0100\` and prints them, then flips to a raylib window to poke at the tile region around \`0x9800\`.

# Resources that pull their weight

- [Pandocs](https://gbdev.io/pandocs/) — the reference
- [opcodes table](https://gbdev.io/gb-opcodes/optables/) — the cheat sheet

# Status

- ROM loading: yes
- CPU: NOP, LD BC, LD [BC], A, INC BC, INC B, JP a16, CP n ...
- PPU: tile-drawing stub
- timing, interrupts, MBC banks, audio: not yet

Real progress — but it's an emulator in its early months.`,
  },
];

export const allNoteTags = Array.from(new Set(notes.flatMap((n) => n.tags))).sort();