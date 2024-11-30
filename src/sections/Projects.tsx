import platformerImage from "../assets/personal-projects/Platformer.png";
import platformerGif from "../assets/personal-projects/Platformer.gif";
import fileToPng from "../assets/personal-projects/file_to_png.png";
import { useState } from "react";
function Projects() {
  const [personal, setPersonal] = useState(true);
  interface ProjectType {
    name: string;
    url: string;
    description: string;
  }
  const personalProjects: { [id: number]: ProjectType } = {
    1: {
      name: "2d Platformer Game",
      url: platformerGif,
      description: "Made using the C language with help of raylib (library)",
    },
    2: {
      name: "File to png website",
      url: fileToPng,
      description:
        "A fun enjoyable project where I tried to play with bytes and understand binary data, basically you upload an a \
        file (.txt, .svg, .C ...etc)\
        and the file bytes become the image's pixels and you can donwload your png with your data and upload them again to extract data",
    },
    3: {
      name: "2d Platformer Game",
      url: platformerGif,
      description: "using C with help of raylib(library)",
    },
  };

  return (
    <section className="projects p-8 mt-6">
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
                <div className="p-8 border-2 border-white">
                  <img
                    style={{ aspectRatio: " 16 / 9 " }}
                    src={project.url}
                    alt={project.name}
                  />
                  <h2 className="mt-1">{project.name}</h2>
                  <div className="h-28 mt-4 overflow-hidden overflow-y-scroll">
                    <p className=" leading-8">{project.description}</p>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </section>
  );
}
export default Projects;
