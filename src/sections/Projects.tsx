import platformerImage from "../assets/personal-projects/output.gif";
import fileToPng from "../assets/personal-projects/file_to_png.png";
import chineseFlashCards from "../assets/personal-projects/chinese_flash_cards.png";
import { useState } from "react";
function Projects() {
  const gitContenLikn =
    "https://raw.githubusercontent.com/3manuel0/3manuel0/assets/";
  const [personal, setPersonal] = useState(true);
  interface ProjectType {
    name: string;
    url: string;
    description: string;
    languages?: string[] | null;
    githubSrcCode?: string | null;
    demo?: string | null;
  }
  const personalProjects: { [id: number]: ProjectType } = {
    1: {
      name: "2d Platformer Game",
      url: platformerImage,
      description:
        "Game demo built in C with Raylib, compiled to WebAssembly for the web",
      languages: ["C", "Raylib", "WebAssembly", "Javascript", "Debian"],
      githubSrcCode: "https://github.com/3manuel0/2dPlatformerGame",
      demo: "https://3manuel0.github.io/2dPlatformerGame/",
    },
    2: {
      name: "File to png website",
      url: fileToPng,
      //  and the file bytes become the image's pixels then you can download your png with your data and upload them again to extract data"
      description:
        "Encodes file data into PNG pixels to explore binary representation",
      languages: ["Javascript", "Html", "Css", "Debian"],
      githubSrcCode: "https://github.com/3manuel0/file_or_text_to_png",
      demo: "https://3manuel0.github.io/file_or_text_to_png/",
    },
    3: {
      name: "Chinese Flashcards Desktop app",
      url: chineseFlashCards,
      description:
        "Rust-based desktop app using Slint for Chinese flashcard learning",
      languages: ["Rust", "Slint"],
      githubSrcCode: "https://github.com/3manuel0/chinese_flashcards",
    },
  };

  return (
    <section className="projects p-8 mt-6" id="projects">
      <div className="prj-dev">
        <h1 className="text-center text-3xl lg:text-4xl">Projects</h1>
        <div className="flex justify-around mt-6 gap-2">
          <h2
            className="text-center border-2 border-cyan-400 w-full p-2 cursor-pointer"
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
            className="text-center border-2 border-cyan-400 w-full p-2 cursor-pointer"
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
            ? Object.keys(personalProjects).map((key) => {
                const project = personalProjects[+key];
                return (
                  <div className="p-5 border-2 border-white flex flex-col justify-between">
                    <div className="flex col-auto">
                      {project.githubSrcCode ? (
                        <h2 className="text-center border-2 border-cyan-400 w-full p-2 cursor-pointer">
                          <a
                            href={
                              project.githubSrcCode ? project.githubSrcCode : ""
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Source Code
                          </a>
                        </h2>
                      ) : null}
                      {project.demo ? (
                        <h2 className="text-center border-2 border-cyan-400 w-full p-2 cursor-pointer">
                          <a
                            href={project.demo ? project.demo : ""}
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
                      src={project.url}
                      alt={project.name}
                    />
                    <h2 className="mt-1 text-center text-green-400">
                      {project.name}
                    </h2>
                    {/* h-28 */}
                    <div className="desc mt-4 overflow-hidden overflow-y-scroll">
                      <p className=" leading-8">{project.description}</p>
                    </div>
                    <h2 className="text-pink-400">Languages & Tools:</h2>
                    <div className="mt-2">
                      <div className="flex items-center justify-between">
                        {project.languages
                          ? project.languages.map((lang) => (
                              <div className="flex mt-2 flex-col justify-center items-center w-full group cursor-pointer">
                                <img
                                  width={50}
                                  height={50}
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
            : null}
        </div>
      </div>
    </section>
  );
}
export default Projects;
