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
    date: "2025-12-18",
    readMinutes: 6,
    tags: ["C", "Parsing", "Performance"],
    excerpt:
      "Type-inferring CSV parsing without strtok: arena allocation, hand-rolled tokenizing and why a parser is the perfect first systems project.",
    content: `Parsers are the perfect systems project: bounded input, defined grammar, and a million ways to get it wrong. My [C3SV](https://github.com/3manuel0/C3SV) library parses CSV with automatic type inference and JSON output.

# Why strtok loses

The standard \`strtok\` approach mutates the input in place and collapses consecutive delimiters. CSV should keep empty fields — \`a,,c\` is *three* columns, not two.

So the tokenizer walks the buffer once, tracking a quote state and a field start/end:

\`\`\`c
static size_t csv_field(const char *s, size_t n, int *quoted) {
    size_t i = 0;
    *quoted = 0;
    if (i < n && s[i] == '"') {
        *quoted = 1;
        i++;
        while (i < n && s[i] != '"') i++;
        if (i < n) i++;              /* closing quote  */
    }
    while (i < n && s[i] != ',') i++; /* unquoted tail */
    return i;
}
\`\`\`

# Type inference, not guessing

Each token becomes a candidate. We try the strictest type first and accept the first parse that consumes the whole field:

- integers: no sign overflow, no leading zero surprises
- floats: strtod with full-consumption check
- booleans: **true** / **false** (case-insensitive)
- fallback: string

The key is to be *strict permissive*: if it looks like a number but has a trailing \`.\`, it's still a string.

# The allocation story

Every field is sliced into a single arena. The parser never frees mid-stream; the arena is one \`free()\` at the end. For a few-MB parse that's an order of magnitude less malloc traffic than per-field allocation.

> A parser that never allocates per token is a parser you can call from a hot loop.

# Lessons

1. Write the tokenizer against a test corpus with gnarly inputs (quotes, newlines, trailing commas) *before* touching output.
2. Keep the parser and the string type decoupled — my [Lib3man](https://github.com/3manuel0/Lib3man) String View makes slicing fields free.
3. Measure. A naive byte-by-byte branch beats beautiful SIMD guesses 90% of the time.

[source code](https://github.com/3manuel0/C3SV) · written in C99, zero dependencies.`,
  },
  {
    slug: "learning-ml-from-scratch-in-c",
    title: "Learning Machine Learning From the Ground Up in C",
    date: "2025-11-30",
    readMinutes: 7,
    tags: ["C", "Machine Learning"],
    excerpt:
      "No numpy, no torch: implementing linear regression and a single-hidden-layer network with raw float arrays to actually learn the math.",
    content: `Using a framework first teaches you the API, not the field. I learn better in the other direction: implement the math, then look at what libraries automate.

# The plan

- linear regression with closed-form and gradient descent
- a single-hidden-layer MLP with backprop
- a tiny leaky buffer for reading mnist-like data by hand

# Linear regression in ~40 lines

\`\`\`c
double predict(const Matrix *w, double x) {
    return x * w->data[0] + w->data[1];
}

void train(Matrix *w, const double *xs, const double *ys,
           size_t n, double lr, int epochs) {
    for (int e = 0; e < epochs; e++) {
        double dw0 = 0, dw1 = 0;
        for (size_t i = 0; i < n; i++) {
            double err = predict(w, xs[i]) - ys[i];
            dw0 += err * xs[i];
            dw1 += err;
        }
        w->data[0] -= lr * dw0 / (double)n;
        w->data[1] -= lr * dw1 / (double)n;
    }
}
\`\`\`

# The part that actually hurts: backprop

The chain rule is easy on paper. In code, with raw \`float\` buffers, you keep a separate array per layer for activations, pre-activations, deltas and weights, and the index arithmetic becomes the real bug source.

Writing it bare makes you appreciate what every \`model.fit()\` hides: SGD, momentum, and just *how much* of it is bookkeeping.

# Why not just use Python?

Python is my default for tooling. But subtract the framework and run the same gradient loop and you'll realize the *model* is five loops and the *ecosystem* is the other ten thousand lines.

Once the math runs in C, explaining it on [CodinGame-certified C](https://www.codingame.com/certification/Raf4-S25vVVg-APrkRpwsQ) and Python is almost free.

> Don't import what you haven't at least once written badly.

# Next up

A minimal MNIST-ish classifier with just enough matrix code to stop feeling like magic.`,
  },
  {
    slug: "why-i-use-void-linux",
    title: "Why I Use Void Linux (and Why runit > systemd)",
    date: "2025-10-12",
    readMinutes: 4,
    tags: ["Linux", "Void"],
    excerpt:
      "runit, static binaries, a package manager that stays out of the way — the operating system as a tool you can actually see through.",
    content: `I drift toward tools I can see through. Void Linux is the package manager and init system I never have to *fight*.

# runit over systemd

runit is a supervision suite: a per-service directory, a run script that is literally a shell script, and logging as a symlink to \`svlogd\`.

\`\`\`sh
# /etc/sv/myservice/run
#!/bin/sh
exec /usr/local/bin/myserver -c /etc/myserver.conf
\`\`\`

Start it with \`ln -s /etc/sv/myservice /var/service/\`. A cgroup tree and five new languages are not required to run one daemon.

# The package manager

\`xbps\` is fast, dependency-resolved at install time, and ships *static* binaries for the tools I rely on in recovery — \`xbps-static\` has pulled me out of more broken boots than I'm comfortable admitting.

# What it costs

Less corporate polish, more you-checks-the-docs. For a student who wants to understand what \`apt\` is hiding, that's a feature.

> An init system you can read in an afternoon is an init system you'll never fear debugging at 2am.

# The workflow

- terminal + [the C3SV suite](https://github.com/3manuel0/C3SV) for data hacking
- \`sbcl\`, \`clang\`, \`gdb\` from the repos
- Firefox and wayland just work once configured

It's the distro that finally stopped being part of the stack and became part of the desk.`,
  },
  {
    slug: "porting-raylib-to-the-browser-with-webassembly",
    title: "Porting a Raylib Game to the Browser With WebAssembly",
    date: "2025-09-03",
    readMinutes: 5,
    tags: ["C", "WebAssembly", "Raylib"],
    excerpt:
      "The secret is a tiny JavaScript bridge: keep the game loop in C, expose input via JS, and let the browser own the DOM while wasm owns the pixels.",
    content: `Shipping a C/raylib game where people can play it without installing anything is 90% of the fun of web games. My [2d platformer](https://3manuel0.github.io/2dPlatformerGame/) does this with a tiny hand-rolled bridge on top of the Emscripten build.

# The division of labor

- **wasm owns the logic**: physics, level layout, the loop in C
- **JS owns the DOM**: canvas, input events, resizing
- **the bridge owns the seam**: an exported struct the JS can read each frame

# Where input goes

Raylib's \`IsKeyDown()\` becomes a lookup into an exported buffer:

\`\`\`c
/* game.h */
typedef struct {
    int left, right, jump;
    int action;
    float mouse_x, mouse_y;
} InputFrame;

extern InputFrame g_input; /* JS writes here before each step */
\`\`\`

The emscripten glue function calls a single exported \`step\`:

\`\`\`c
EMSCRIPTEN_KEEPALIVE void step(void) {
    update(&g_input);
    draw();
}
\`\`\`

# The loop problem

The browser drives the loop: \`requestAnimationFrame\` calls \`step()\`, so timing must be delta-based, not frame-based. I pass \`dt\` through the same exported struct — one source of truth, no global timestamp hacks.

# Getting it running

\`\`\`sh
emcc main.c -O3 -s WASM=1 -s ALLOW_MEMORY_GROWTH=1 \
  -s EXPORTED_FUNCTIONS="['_step','_free']" -o game.js
\`\`\`

Keep the memory growth flag on and never touch the heap size during gameplay.

[try the demo](https://3manuel0.github.io/2dPlatformerGame/) · [source](https://github.com/3manuel0/2dPlatformerGame)

> The browser is a scheduler, not a game loop. Give it \`step()\` and \`dt\`, and C just works.`,
  },
  {
    slug: "arenas-and-string-views-a-tiny-memory-toolkit",
    title: "Arenas and String Views: A Tiny Memory Toolkit",
    date: "2025-08-21",
    readMinutes: 5,
    tags: ["C", "Memory"],
    excerpt:
      "Arena allocators and non-owning string views replace a surprising amount of malloc() cleanup without pulling in a GC or a framework.",
    content: `The [Lib3man](https://github.com/3manuel0/Lib3man) utilities exist because I got tired of writing the same free-everything dance for every small tool.

# Arena allocator

All allocations come from an incrementing bump pointer into a big block. Freeing is one operation on the whole arena — no per-object ownership graphs.

\`\`\`c
typedef struct {
    char *data;
    size_t used, cap;
    Arena *next;   /* grow in slab links */
} Arena;
\`\`\`

Rules that keep it honest:

- allocations never outlive the arena
- reset (\`arena_reset\`) frees nothing but rewinds the cursor
- nested arenas are just parent pointers — handy for per-frame scratch

# String view

A \`StrView\` is a pointer + length. Slicing is pointer arithmetic, never a copy:

\`\`\`c
StrView sv_trim(StrView s) {
    while (sv_len(s) && isspace(*sv_begin(s))) s = sv_slice(s, 1, sv_len(s) - 1);
    while (sv_len(s) && isspace(*(sv_begin(s) + sv_len(s) - 1)))
        s = sv_slice(s, 0, sv_len(s) - 1);
    return s;
}
\`\`\`

# Where this shines

- parsers (see [C3SV](https://github.com/3manuel0/C3SV)) — fields are slices of the source buffer
- servers: one arena per request, reset at the end, zero leaks by construction
- demos and emulators where per-frame scratch is the norm

> Manual memory management isn't hard when you stop asking *"who owns this?"* for every byte and instead answer it once with *"this arena owns it all."*

# Tradeoffs

Arenas love when lifetimes line up and hate long-lived scatter. Know the shape of your program before you reach for the toolkit.`,
  },
  {
    slug: "building-a-gameboy-emulator-from-scratch",
    title: "Building a Game Boy Emulator From Scratch (Work In Progress)",
    date: "2026-01-05",
    readMinutes: 6,
    tags: ["C", "Emulation", "GameBoy"],
    excerpt:
      "A CPU in C, one opcode at a time: registers, flags, memory mapping, and the humbling difference between speculated and correct timing.",
    content: `The [Game Boy emulator](https://github.com/3manuel0/gb_emu) is my slow burn project: it's the "C and manual memory management" thesis in its most honest form, because the hardware doesn't care about your abstractions.

# The plan

- a correct LR35902 CPU core (it's a SM83: a Z80-ish/8080-ish hybrid)
- a 16-bit address space with bank switching carved out for cartridges
- display: the 160×144 LCD with a scanline renderer
- eventually audio via [raylib](https://www.raylib.com/) since I already have the wasm bridge

# Where the pain is

Timing. Emulators aren't a list of instructions — they're a pipeline where *every memory access, every interrupt acknowledges latency* matters. A PC that reads \`OPCODE(AF)\` and doesn't consume the right cycles produces a Tetris ROM that plays like static.

The current milestone is a CPU test suite that runs pure-logic instructions with zero PPU interference, and it already humbles you: getting \`LD (HL), n\`'s timing right is 30 seconds of reading and one wrong \`e.c_instr_cycles\` for the rest of the day.

# Code sketch

\`\`\`c
case 0x77: /* LD (HL), A */
    wb(mmu, hl, a);
    e.pc += 1;
    e.instr_cycles += 2;
    break;
\`\`\`

Boring on purpose. The magic — and the bugs — live in the *order* you evaluate the operands.

# Status

- [ ] CPU: most of the 8-bit opcodes with a conformance runner
- [ ] MMU: 32 KB rom bank 0/1 + WRAM/HRAM
- [ ] PPU: framebuffer skeleton
- [ ] audio + input + cartridge header

Follow along on [GitHub](https://github.com/3manuel0/gb_emu) — it's green-checkerboard progress, but real progress.`,
  },
];

export const allNoteTags = Array.from(new Set(notes.flatMap((n) => n.tags))).sort();