import platformerImage from "../assets/personal-projects/Platformer.png";
import fileToPng from "../assets/personal-projects/file_to_png.png";
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
  }
  const personalProjects: { [id: number]: ProjectType } = {
    1: {
      name: "2d Platformer Game",
      url: platformerImage,
      description: "Made using the C language with help of raylib (library)",
      languages: ["C", "Raylib"],
    },
    2: {
      name: "File to png website",
      url: fileToPng,
      //  and the file bytes become the image's pixels then you can download your png with your data and upload them again to extract data"
      description:
        "A fun enjoyable project where I tried to play with bytes and understand binary data, basically you upload an a \
        file (.txt, .svg, .C ...etc)",
      languages: ["Javascript", "Html", "Css"],
    },
    3: {
      name: "Chinese Flashcards Desktop app",
      url: "",
      description:
        "a simple desktop app created using the rust language and slint",
      languages: ["Rust", "Slint"],
    },
  };

  return (
    <section className="projects p-8 mt-6">
      <div className="prj-dev">
        <h1 className="text-center">Projects</h1>
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
        <div className="grid grid-cols-2 gap-2 mt-2">
          {personal
            ? Object.keys(personalProjects).map((key) => {
                const project = personalProjects[+key];
                return (
                  <div className="p-8 border-2 border-white flex flex-col justify-between">
                    <div className="flex col-auto">
                      <h2 className="text-center border-2 border-cyan-400 w-full p-2 cursor-pointer">
                        source Code
                      </h2>
                      <h2 className="text-center border-2 border-cyan-400 w-full p-2 cursor-pointer">
                        View Demo
                      </h2>
                    </div>
                    <img
                      style={{ aspectRatio: " 16 / 9 " }}
                      src={project.url}
                      alt={project.name}
                    />
                    <h2 className="mt-1">{project.name}</h2>
                    {/* h-28 */}
                    <div className="desc mt-4 overflow-hidden overflow-y-scroll">
                      <p className=" leading-8">{project.description}</p>
                    </div>
                    <div className="mt-2">
                      <h2>Languages & Tools:</h2>
                      <div className="grid grid-cols-6">
                        {project.languages
                          ? project.languages.map((lang) => (
                              <div className="flex mt-2 flex-col justify-center items-center">
                                <img
                                  width={40}
                                  height={40}
                                  src={gitContenLikn + lang + ".svg"}
                                />
                                <p className="text-xs mt-2">{lang}</p>
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
