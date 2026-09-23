import c3sv from "../assets/personal-projects/C3SV.webp";
import lib3man from "../assets/personal-projects/Lib3man.webp";
import bs3 from "../assets/personal-projects/3bs.webp";
import vpsPersonal from "../assets/personal-projects/VPS.webp";
import outputDemo from "../assets/personal-projects/output.webp";
import gameboy from "../assets/personal-projects/gameboy.webp";
import fileToPng from "../assets/personal-projects/file_to_png.webp";
import sophia from "../assets/personal-projects/Sophia.webp";
import chineseFlashCards from "../assets/personal-projects/chinese_flash_cards.webp";
import musicPlayer from "../assets/personal-projects/Music_player.webp";
import vpsProfessional from "../assets/professional-projects/VPS.webp";
import chessPuzzle from "../assets/professional-projects/chess-puzzle.webp";
import flagTrivia from "../assets/professional-projects/flagtriviagame.webp";
import balanceChecker from "../assets/professional-projects/BalanceChecker_for_Bank_Clients.webp";
import timeWarp from "../assets/professional-projects/TimeWarpMemory.webp";

export const gitContentBase =
  "https://raw.githubusercontent.com/3manuel0/3manuel0/refs/heads/assets/";

export const profile = {
  name: "Said AKA 3manuel",
  alias: "3manuel",
  githubUsername: "3manuel0",
  title: "Software Engineering Student / Full Stack Web Developer",
  location: "Morocco, Rabat",
  website: "https://3manuel.dev",
  bio: "I focus on C and manual memory management, prioritizing lean foundations over heavy abstractions. While I use JavaScript and Python for automation and tooling, I am currently exploring Machine Learning by implementing concepts from the ground up in C. A Void Linux user, I value a development workflow built on transparency and technical control.",
};

export interface ContactLink {
  name: string;
  handle: string;
  url?: string;
  /** Discord-style: no direct link — the value to copy so people can send a friend request. */
  copy?: string;
}

export const contactLinks: ContactLink[] = [
  {
    name: "Email",
    url: "mailto:saiddimension@gmail.com",
    handle: "saiddimension@gmail.com",
  },
  {
    name: "GitHub",
    url: "https://github.com/3manuel0",
    handle: "@3manuel0",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/said-bennaji/",
    handle: "in/said-bennaji",
  },
  {
    name: "X (Twitter)",
    url: "https://x.com/3manuel_s",
    handle: "@3manuel_s",
  },
  {
    name: "Discord",
    handle: "3manuel",
    copy: "3manuel",
  },
];

export const skills = {
  Languages: [
    "C",
    "C++",
    "Csharp",
    "Python",
    "Javascript",
    "Typescript",
    "Java",
    "Kotlin",
    "Php",
    "X86asm",
  ],
  "Web Development": [
    "WebAssembly",
    "React",
    "Nodejs",
    "Express",
    "Flask",
    "Vitejs",
    "Tailwindcss",
    "Html",
    "Css",
  ],
  Databases: ["Mysql", "Postgresql", "Mongodb", "Sqlite"],
  Other: ["Git", "Linux", "Make", "Github", "Voidlinux", "Bash"],
  "Spoken Languages": ["Arabic", "English", "French"],
};

export interface ProjectType {
  name: string;
  description: string;
  languages?: string[] | null;
  githubSrcCode?: string | null;
  demo?: string | null;
  screenshot: string;
  type: "personal" | "professional";
  context?: string;
}

export const personalProjects = [
  {
    name: "C3SV (Data Parser)",
    description:
      "A high-performance CSV parser in C built from scratch, handling complex edge cases (quoted fields, escapes) with a minimal memory footprint. Automatic type inference maps columns to native C types (int64, float64) and string-view patterns optimize large-scale datasets, with JSON serialization for backend use.",
    languages: ["C"],
    githubSrcCode: "https://github.com/3manuel0/C3SV",
    screenshot: c3sv,
    type: "personal",
  },
  {
    name: "Lib3man (Utility Library)",
    description:
      "Low-level C utility library featuring a custom Arena-based allocator that eliminates memory leaks and optimizes allocation performance, plus a String View / String Buffer system for dynamic strings. Includes a suite of cache-optimized data structures, replacing standard library overhead with manual, high-performance memory management.",
    languages: ["C"],
    githubSrcCode: "https://github.com/3manuel0/Lib3man",
    screenshot: lib3man,
    type: "personal",
  },
  {
    name: "3bs_Downloader",
    description:
      "A Python CLI tool for reconstructing BigBlueButton sessions. It automates the extraction and synchronization of split streams (Audio, Slides, Chat) into a single MP4, using XML parsing to sync SVG slides and advanced FFmpeg commands for storage-optimized encoding, with duration clipping that automatically caps at the session's actual length.",
    languages: ["Python", "FFmpeg", "PIL"],
    githubSrcCode: "https://github.com/3manuel0/3bs_Downloader",
    screenshot: bs3,
    type: "personal",
  },
  {
    name: "Cloud Infrastructure & SecOps",
    description:
      "Managed a Linux VPS environment for bot hosting and game servers. Implemented a Cloudflare reverse proxy for DDoS protection and handled remote sysadmin tasks via SSH.",
    languages: ["Debian", "Linux"],
    screenshot: vpsPersonal,
    type: "personal",
  },
  {
    name: "2d Platformer Game",
    description:
      "Custom 2D game engine in C/Raylib featuring physics, collision detection, and hardware-accelerated rendering. A \"Gamelib\" JavaScript bridge and cross-compilation pipeline unify Web and Desktop builds by porting high-performance Raylib logic to the browser via WebAssembly.",
    languages: ["C", "Raylib", "WebAssembly"],
    githubSrcCode: "https://github.com/3manuel0/2dPlatformerGame",
    demo: "https://3manuel0.github.io/2dPlatformerGame/",
    screenshot: outputDemo,
    type: "personal",
  },
  {
    name: "Gameboy Emulator (Work In Progress)",
    description:
      "Systems programming project focused on CPU instruction sets and memory mapping to recreate the original GameBoy hardware architecture in C.",
    languages: ["C", "Raylib"],
    githubSrcCode: "https://github.com/3manuel0/gb_emu",
    screenshot: gameboy,
    type: "personal",
  },
  {
    name: "FToP (File to PNG)",
    description:
      "Tool that encodes raw file bytes into PNG pixels to explore binary representation and image processing via WebAssembly.",
    languages: ["C", "WebAssembly", "Javascript"],
    githubSrcCode: "https://github.com/3manuel0/FToP",
    demo: "https://3manuel0.github.io/FToP/",
    screenshot: fileToPng,
    type: "personal",
  },
  {
    name: "Sophia (Discord Bot)",
    description:
      "High-performance C++ Discord bot built with the D++ library, featuring a custom engine for image-to-ASCII conversion and a guessing mini-game. Deployed on a Linux VPS with automated data persistence and uptime monitoring, serving as a testbed for infrastructure experiments.",
    languages: ["C++"],
    githubSrcCode: "https://github.com/3manuel0/Sophia_Cpp",
    screenshot: sophia,
    type: "personal",
  },
  {
    name: "Chinese Flashcards",
    description:
      "Cross-platform desktop application for language learning built with Rust and the Slint UI framework.",
    languages: ["Rust", "Slint"],
    githubSrcCode: "https://github.com/3manuel0/chinese_flashcards",
    screenshot: chineseFlashCards,
    type: "personal",
  },
  {
    name: "Audio Player",
    description:
      "Native Android audio player focusing on clean UI and local file management.",
    languages: ["Kotlin", "Androidstudio"],
    githubSrcCode: "https://github.com/3manuel0/3maPlayer",
    screenshot: musicPlayer,
    type: "personal",
  },
] as ProjectType[];

export const professionalProjects = [
  {
    name: "VPS Configurator Web App",
    context: "Internship @ MTDS",
    description:
      "Designed and developed a responsive web application that allows clients to configure and order VPS (Virtual Private Server) instances based on custom parameters.",
    languages: ["Php", "Javascript", "Html", "Css", "Mysql"],
    screenshot: vpsProfessional,
    type: "professional",
  },
  {
    name: "Chess Puzzle Website",
    context: "Freelance",
    description:
      "Developed a website for a client that allows users to play and solve chess puzzles, with real-time validation of legal chess moves.",
    languages: ["Javascript", "Html", "Css"],
    screenshot: chessPuzzle,
    type: "professional",
  },
  {
    name: "Flag Trivia Game",
    context: "Freelance",
    description:
      "Created a flag trivia game for a client, where users are challenged to identify country flags from around the world. The game features multiple-choice questions, score tracking, and instant feedback to enhance learning and engagement.",
    languages: ["Python", "Pygame"],
    screenshot: flagTrivia,
    type: "professional",
  },
  {
    name: "Balance Checker for Bank Clients",
    context: "Internship @ Managtech",
    description:
      "Developed a Flask web app to compare names from uploaded PDF/XLS files against a general bank list. Used pytesseract for OCR-based text extraction and implemented error handling to improve matching accuracy.",
    languages: ["Python", "Flask", "Html", "Css", "Mysql"],
    screenshot: balanceChecker,
    type: "professional",
  },
  {
    name: "Time Warp Memory Game",
    context: "Freelance",
    description:
      "Helped a client build a Number Guessing Level for the Time Warp Memory Game, handling game logic, UI, and smooth integration to enhance memory-focused gameplay.",
    languages: ["Python", "Pygame"],
    screenshot: timeWarp,
    type: "professional",
  },
] as ProjectType[];

export const allProjects: ProjectType[] = [
  ...personalProjects,
  ...professionalProjects,
];

export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
}

export interface ExperienceGroup {
  year: string;
  entries: ExperienceEntry[];
}

export interface EducationEntry {
  degree: string;
  field: string;
  school: string;
  location: string;
  period: string;
  status?: string;
}

export const experience: ExperienceGroup[] = [
  {
    year: "2025",
    entries: [
      {
        role: "C & Python Programming Tutor",
        company: "Freelance",
        period: "Aug 2025 - Present",
        location: "Remote",
        description:
          "Provide one-on-one tutoring in Python fundamentals to young learners through project-based learning to develop algorithmic thinking early. Teach advanced C programming covering manual memory management, pointer arithmetic, and data structure optimization. Explain complex low-level computing concepts based on each student's level, using personalized exercises, materials, and small projects.",
      },
      {
        role: "Full-Stack Developer Intern",
        company: "MTDS",
        period: "May 2025 (2 months)",
        location: "Rabat, Morocco (Hybrid)",
        description:
          "Designed and developed a responsive web application that allows users to configure and order custom VPS servers, selecting RAM, CPU, storage, and licenses. Implemented a secure client system and an administrative panel for order tracking, updates, and configuration management using PHP, JavaScript, and SQL. Integrated dynamic frontend elements with AJAX to ensure smooth and responsive user interactions.",
      },
    ],
  },
  {
    year: "2024",
    entries: [
      {
        role: "Web Developer Intern",
        company: "Managtech",
        period: "Sept 2024 (1 month)",
        location: "Rabat, Morocco",
        description:
          "Built a Flask application to automate the cross-referencing of critical client data by processing PDF and XLS files against a master bank client database. Integrated OCR with pytesseract to convert scanned documents into actionable data. Optimized the comparison algorithm to minimize false positives during sensitive identity verification, and designed a reporting interface for bank agents to quickly visualize and resolve detected discrepancies.",
      },
    ],
  },
  {
    year: "2023",
    entries: [
      {
        role: "Freelance Full-Stack Developer / Automation Programmer",
        company: "Self-Employed",
        period: "Apr 2023 - Present",
        location: "Remote",
        description:
          "Delivered full-stack web solutions for international clients, focusing on performance, scalability, and security. Built responsive websites and admin dashboards using PHP, React, JavaScript, HTML, and CSS, with data management in MySQL and SQLite. Developed Python automation scripts for web scraping, file extraction, and workflow optimization, plus interactive tools with Python (Pygame) and C compiled to WebAssembly. Managed the full project lifecycle, from technical requirement analysis to final production deployment.",
      },
    ],
  },
];

export const certifications = [
  {
    name: "CodinGame Certification — Python 3",
    issuer: "CodinGame (Verify)",
    year: "2025",
    url: "https://www.codingame.com/certification/3NVm0g6PyhxfwXhdnVp8zQ",
  },
  {
    name: "CodinGame Certification — C",
    issuer: "CodinGame (Verify)",
    year: "2025",
    url: "https://www.codingame.com/certification/Raf4-S25vVVg-APrkRpwsQ",
  },
];

export const education: EducationEntry[] = [
  {
    degree: "Engineering Degree (Cycle d'Ingénierie)",
    field: "Computer Engineering",
    school: "École Supérieure de Management de Télécommunication et d'Informatique (Sup MTI)",
    location: "Rabat, Morocco",
    period: "2025 - 2028 (Expected)",
    status: "Engineering student",
  },
  {
    degree: "Specialized Technician Diploma (Technicien Spécialisé)",
    field: "Software Development",
    school: "Group MIAGE Rabat-Salé",
    location: "Rabat, Morocco",
    period: "2023 - 2025",
    status: "Graduated",
  },
  {
    degree: "University Studies",
    field: "Economics & Law (Sciences Économiques / Droit Arabe)",
    school: "Faculté Polydisciplinaire d'Errachidia",
    location: "Errachidia, Morocco",
    period: "2019 - 2023",
  },
  {
    degree: "Baccalauréat",
    field: "Physics & Chemistry",
    school: "Sijilmassa High School",
    location: "Errachidia, Morocco",
    period: "2018",
    status: "Graduated",
  },
];