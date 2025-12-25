import platformerImage from "../assets/personal-projects/output.gif";
import fileToPng from "../assets/personal-projects/file_to_png.png";
import Sophia from "../assets/personal-projects/Sophia.png";
import chineseFlashCards from "../assets/personal-projects/chinese_flash_cards.png";
import musicPlayer from "../assets/personal-projects/Music_player.png";
import gameboy from "../assets/personal-projects/gameboy.png";
import Gamelib from "../assets/personal-projects/Gamelib.png";
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
      name: "2d Platformer Game",
      url: platformerImage,
      description:
        'Game demo built in C with Raylib, for web I used my "Gamelib"',
      languages: ["C", "Raylib", "WebAssembly"],
      githubSrcCode: "https://github.com/3manuel0/2dPlatformerGame",
      demo: "https://3manuel0.github.io/2dPlatformerGame/",
    },
    {
      name: "Gamelib(My game library)",
      url: Gamelib,
      description:
        "javascript script for linking raylib functions in wasm to display in the html canvas",
      languages: ["C", "Raylib", "WebAssembly", "Javascript"],
      githubSrcCode: "https://github.com/3manuel0/gamelib",
      demo: "https://3manuel0.github.io/gamelib/",
    },
    {
      name: "Sphia(Discord bot)",
      url: Sophia,
      //  and the file bytes become the image's pixels then you can download your png with your data and upload them again to extract data"
      description:
        "A Discord bot that has a number game and can transform images to ascii art, hosted on a vps",
      languages: ["C++"],
      githubSrcCode: "https://github.com/3manuel0/Sophia_Cpp",
    },
    {
      name: "Gameboy emulator in C (in progress...) ",
      url: gameboy,
      description:
        "Just a fun project for me to work with C and learn about how Emulation and GameBoy work.",
      languages: ["Raylib", "C"],
      githubSrcCode: "https://github.com/3manuel0/gb_emu",
    },
    {
      name: "FToP",
      url: fileToPng,
      //  and the file bytes become the image's pixels then you can download your png with your data and upload them again to extract data"
      description:
        "File to PNG, encodes file data into PNG pixels to explore binary representation",
      languages: ["C", "WebAssembly", "Javascript"],
      githubSrcCode: "https://github.com/3manuel0/FToP",
      demo: "https://3manuel0.github.io/FToP/",
    },
    {
      name: "Audio Player",
      url: musicPlayer,
      description: "Audio player in kotlin",
      languages: ["Kotlin", "Androidstudio"],
      githubSrcCode: "https://github.com/3manuel0/3maPlayer",
    },
    {
      name: "Chinese Flashcards Desktop app",
      url: chineseFlashCards,
      description:
        "Rust-based desktop app using Slint for Chinese flashcard learning",
      languages: ["Rust", "Slint"],
      githubSrcCode: "https://github.com/3manuel0/chinese_flashcards",
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
            className="text-center border-2 text-xs md:text-base border-cyan-400 w-full p-2 cursor-pointer"
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
            className="text-center border-2 text-xs md:text-base border-cyan-400 w-full p-2 cursor-pointer"
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
                        <h2 className="text-center border-2 text-xs md:text-base border-cyan-400 w-full p-2 cursor-pointer">
                          <a
                            href={
                              personalProjects.githubSrcCode
                                ? personalProjects.githubSrcCode
                                : ""
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Source Code
                          </a>
                        </h2>
                      ) : null}
                      {personalProjects.demo ? (
                        <h2 className="text-center border-2 text-xs md:text-base border-cyan-400 w-full p-2 cursor-pointer">
                          <a
                            href={
                              personalProjects.demo ? personalProjects.demo : ""
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Demo
                          </a>
                        </h2>
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
                                <div className="text-[0.5rem] md:text-xs mt-2 opacity-0  group-hover:opacity-100 absolute text-outline">
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
                        <h2 className="text-center border-2 text-xs md:text-base border-cyan-400 w-full p-2 cursor-pointer">
                          <a
                            href={
                              professionalProjects.githubSrcCode
                                ? professionalProjects.githubSrcCode
                                : ""
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Source Code
                          </a>
                        </h2>
                      ) : null}
                      {professionalProjects.demo ? (
                        <h2 className="text-center border-2 text-xs md:text-base border-cyan-400 w-full p-2 cursor-pointer">
                          <a
                            href={
                              professionalProjects.demo
                                ? professionalProjects.demo
                                : ""
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Demo
                          </a>
                        </h2>
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
                                  <div className="text-[0.5rem] md:text-xs mt-2 opacity-0  group-hover:opacity-100 absolute text-outline">
                                    {lang}
                                  </div>
                                </div>
                              )
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
