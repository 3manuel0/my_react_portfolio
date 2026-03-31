import platformerImage from "../assets/personal-projects/output.gif";
import fileToPng from "../assets/personal-projects/file_to_png.png";
import Sophia from "../assets/personal-projects/Sophia.png";
import chineseFlashCards from "../assets/personal-projects/chinese_flash_cards.png";
import musicPlayer from "../assets/personal-projects/Music_player.png";
import gameboy from "../assets/personal-projects/gameboy.png";
import C3SV from "../assets/personal-projects/C3SV.png";
import VPS_OVH from "../assets/personal-projects/VPS.png";
import Lib3man from "../assets/personal-projects/Lib3man.png";
import bbbs from "../assets/personal-projects/3bs.png";
import chessPuzzle from "../assets/professional-projects/chess-puzzle.png";
import flagtriviagame from "../assets/professional-projects/flagtriviagame.png";
import TimeWarpMemory from "../assets/professional-projects/TimeWarpMemory.png";
import BalanceChecker_for_Bank_Clients from "../assets/professional-projects/BalanceChecker_for_Bank_Clients.png";
import VPS from "../assets/professional-projects/VPS.png";
import { useState } from "react";

function Projects() {
  const gitContenLikn =
    "https://raw.githubusercontent.com/3manuel0/3manuel0/refs/heads/assets/";
  const [personal, setPersonal] = useState(true);
  interface ProjectType {
    name: string;
    url: string;
    description: string;
    languages?: string[] | null;
    githubSrcCode?: string | null;
    demo?: string | null;
  }
  const personalProjects: ProjectType[] = [
    {
      name: "C3SV (Data Parser)",
      url: C3SV,
      description:
        "A high-performance CSV parser in C with automatic type inference and JSON serialization. Optimized for memory efficiency and data-heavy backend processing.",
      languages: ["C"],
      githubSrcCode: "https://github.com/3manuel0/C3SV",
    },
    {
      name: "Lib3man (Utility Library)",
      url: Lib3man,
      description:
        "Low-level C utility library featuring custom Arena Allocators and String Views. Built to replace standard library overhead with manual, high-performance memory management.",
      languages: ["C"],
      githubSrcCode: "https://github.com/3manuel0/Lib3man",
    },
    {
      name: "3bs_Downloader",
      url: bbbs,
      description:
        "A Python CLI tool for reconstructing BigBlueButton sessions. It automates the extraction and synchronization of split streams (Audio, Slides, Chat) into a single MP4, featuring duration clipping that automatically caps at the session's actual length.",
      languages: ["Python", "FFmpeg", "PIL"],
      githubSrcCode: "https://github.com/3manuel0/3bs_Downloader",
    },
    {
      name: "Cloud Infrastructure & SecOps",
      url: VPS_OVH, // Suggestion: Use a screenshot of a terminal or Cloudflare dash
      description:
        "Managed a Linux VPS environment for bot hosting and game servers. Implemented a Cloudflare reverse proxy for DDoS protection and handled remote sysadmin tasks via SSH.",
      languages: ["Debian", "Linux"],
    },
    {
      name: "2d Platformer Game",
      url: platformerImage,
      description:
        'C/Raylib game demo. Developed a custom "Gamelib" JavaScript bridge to port high-performance Raylib logic to the web using WebAssembly.',
      languages: ["C", "Raylib", "WebAssembly"],
      githubSrcCode: "https://github.com/3manuel0/2dPlatformerGame",
      demo: "https://3manuel0.github.io/2dPlatformerGame/",
    },
    {
      name: "Gameboy Emulator (Work In Progress)",
      url: gameboy,
      description:
        "Systems programming project focused on CPU instruction sets and memory mapping to recreate the original GameBoy hardware architecture in C.",
      languages: ["C", "Raylib"],
      githubSrcCode: "https://github.com/3manuel0/gb_emu",
    },
    {
      name: "FToP (File to PNG)",
      url: fileToPng,
      description:
        "Tool that encodes raw file bytes into PNG pixels to explore binary representation and image processing via WebAssembly.",
      languages: ["C", "WebAssembly", "Javascript"],
      githubSrcCode: "https://github.com/3manuel0/FToP",
      demo: "https://3manuel0.github.io/FToP/",
    },
    {
      name: "Sphia (Discord Bot)",
      url: Sophia,
      description:
        "C++ Discord bot featuring image-to-ASCII processing and mini-games. Served as the testbed for my VPS deployment and infrastructure experiments.",
      languages: ["C++"],
      githubSrcCode: "https://github.com/3manuel0/Sophia_Cpp",
    },
    {
      name: "Chinese Flashcards",
      url: chineseFlashCards,
      description:
        "Cross-platform desktop application for language learning built with Rust and the Slint UI framework.",
      languages: ["Rust", "Slint"],
      githubSrcCode: "https://github.com/3manuel0/chinese_flashcards",
    },
    {
      name: "Audio Player",
      url: musicPlayer,
      description:
        "Native Android audio player focusing on clean UI and local file management.",
      languages: ["Kotlin", "Androidstudio"],
      githubSrcCode: "https://github.com/3manuel0/3maPlayer",
    },
  ];
  const professionalProjects: ProjectType[] = [
    {
      name: "(Internship) VPS Configurator Web App",
      url: VPS,
      description:
        "Designed and developed a responsive web application that allows clients to configure and order VPS (Virtual Private Server) instances based on custom parameters.",
      languages: ["Php", "Javascript", "Html", "Css", "Mysql"],
    },
    {
      name: "(Freelance) Chess Puzzle website",
      url: chessPuzzle,
      description:
        "I developed a website for a client that allows users to play and solve chess puzzles, with real-time validation of legal chess moves.",
      languages: ["Javascript", "Html", "Css"],
    },
    {
      name: "(Freelance) Flag Trivia Game ",
      url: flagtriviagame,
      description:
        "I created a flag trivia game for a client, where users are challenged to identify country flags from around the world. The game features multiple-choice questions, score tracking, and instant feedback to enhance learning and engagement.",
      languages: ["Python", "Pygame"],
    },
    {
      name: "(Internship) Balance Checker for Bank Clients",
      url: BalanceChecker_for_Bank_Clients,
      description:
        "Developed a Flask web app to compare names from uploaded PDF/XLS files against a general bank list. Used pytesseract for OCR-based text extraction and implemented error handling to improve matching accuracy.",
      languages: ["Python", "Flask", "Html", "Css", "Mysql"],
    },
    {
      name: "(Freelance) Time Warp Memory Game",
      url: TimeWarpMemory,
      description:
        "Helped a client build a Number Guessing Level for the Time Warp Memory Game, handling game logic, UI, and smooth integration to enhance memory-focused gameplay.",
      languages: ["Python", "Pygame"],
    },
  ];
  return (
    <section className="projects p-8 mt-6" id="projects">
      <div className="prj-dev">
        <h1 className="text-center text-2xl md:text-4xl">Projects</h1>
        <div className="flex justify-around mt-6 gap-2">
          <h2
            className="proj text-center border-2 text-xl md:text-base border-cyan-400 w-full p-2 cursor-pointer"
            onClick={() => setPersonal(true)}
            style={
              personal
                ? { backgroundColor: "#292828" }
                : { backgroundColor: "inherit" }
            }
          >
            Personal Projects
          </h2>
          <h2
            className="proj text-center border-2 text-xl md:text-base border-cyan-400 w-full p-2 cursor-pointer"
            onClick={() => setPersonal(false)}
            style={
              !personal
                ? { backgroundColor: "#292828" }
                : { backgroundColor: "inherit" }
            }
          >
            Work Projects
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-2 mt-2 lg:grid-cols-2">
          {personal
            ? personalProjects.map((personalProjects, index) => {
                return (
                  <div
                    key={index}
                    className="p-5 border-2 border-white flex flex-col justify-between"
                  >
                    <div className="flex col-auto">
                      {personalProjects.githubSrcCode ? (
                        <a
                          className="text-center border-2 text-xs md:text-base border-cyan-400 w-full p-2 cursor-pointer"
                          href={
                            personalProjects.githubSrcCode
                              ? personalProjects.githubSrcCode
                              : ""
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <h2>Source Code</h2>
                        </a>
                      ) : null}
                      {personalProjects.demo ? (
                        <a
                          className="text-center border-2 text-xs md:text-base border-cyan-400 w-full p-2 cursor-pointer"
                          href={
                            personalProjects.demo ? personalProjects.demo : ""
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <h2>View Demo</h2>
                        </a>
                      ) : null}
                    </div>
                    <img
                      style={{ aspectRatio: " 16 / 9 " }}
                      src={personalProjects.url}
                      alt={personalProjects.name}
                    />
                    <h2 className="mt-1 text-center text-green-400">
                      {personalProjects.name}
                    </h2>
                    {/* h-28 */}
                    <div className="desc mt-4 overflow-hidden">
                      <p className="text-[0.6rem] leading-4 md:leading-8 md:text-base">
                        {personalProjects.description}
                      </p>
                    </div>
                    <h2 className="text-pink-400 text-xs sm:text-base mt-3 sm:mt-0">
                      Languages & Tools:
                    </h2>
                    <div className="mt-2">
                      <div className="flex items-center justify-between">
                        {personalProjects.languages
                          ? personalProjects.languages.map((lang, index) => (
                              <div
                                key={index}
                                className="flex mt-2 flex-col justify-center items-center w-full group cursor-pointer"
                              >
                                <img
                                  className="w-10"
                                  // svg link of the language
                                  src={gitContenLikn + lang + ".svg"}
                                />
                                <div className="text-[0.5rem] md:text-lg mt-2 opacity-0  group-hover:opacity-100 absolute text-outline">
                                  {lang}
                                </div>
                              </div>
                            ))
                          : null}
                      </div>
                    </div>
                  </div>
                );
              })
            : professionalProjects.map((professionalProjects, index) => {
                return (
                  <div
                    key={index}
                    className="p-5 border-2 border-white flex flex-col justify-between"
                  >
                    <div className="flex col-auto">
                      {professionalProjects.githubSrcCode ? (
                        <a
                          className="text-center border-2 text-xs md:text-base border-cyan-400 w-full p-2 cursor-pointer"
                          href={
                            professionalProjects.githubSrcCode
                              ? professionalProjects.githubSrcCode
                              : ""
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <h2>Source Code</h2>
                        </a>
                      ) : null}
                      {professionalProjects.demo ? (
                        <a
                          className="text-center border-2 text-xs md:text-base border-cyan-400 w-full p-2 cursor-pointer"
                          href={
                            professionalProjects.demo
                              ? professionalProjects.demo
                              : ""
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <h2>View Demo</h2>
                        </a>
                      ) : null}
                    </div>
                    <img
                      style={{ aspectRatio: " 16 / 9 " }}
                      src={professionalProjects.url}
                      alt={professionalProjects.name}
                    />
                    <h2 className="mt-1 text-center text-green-400">
                      {professionalProjects.name}
                    </h2>
                    {/* h-28 */}
                    <div className="desc mt-4 overflow-hidden">
                      <p className="text-[0.6rem] leading-4 md:leading-8 md:text-base">
                        {professionalProjects.description}
                      </p>
                    </div>
                    <h2 className="text-pink-400 text-xs sm:text-base mt-3 sm:mt-0">
                      Languages & Tools:
                    </h2>
                    <div className="mt-2">
                      <div className="flex items-center justify-between">
                        {professionalProjects.languages
                          ? professionalProjects.languages.map(
                              (lang, index) => (
                                <div
                                  key={index}
                                  className="flex mt-2 flex-col justify-center items-center w-full group cursor-pointer"
                                >
                                  <img
                                    className="w-10"
                                    // svg link of the language
                                    src={gitContenLikn + lang + ".svg"}
                                  />
                                  <div className="text-[0.5rem] md:text-lg mt-2 opacity-0  group-hover:opacity-100 absolute text-outline">
                                    {lang}
                                  </div>
                                </div>
                              ),
                            )
                          : null}
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
export default Projects;
