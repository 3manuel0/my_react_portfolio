function Aboutme() {
  const gitContenLikn =
    "https://raw.githubusercontent.com/3manuel0/3manuel0/refs/heads/assets/";
  const logos: string[] = [
    "C.svg",
    "C++.svg",
    "WebAssembly.svg",
    "Python.svg",
    "Javascript.svg",
    "Typescript.svg",
    "React.svg",
    "Tailwindcss.svg",
    "Nodejs.svg",
    "Bash.svg",
    "Mysql.svg",
    "Git.svg",
    "Postgresql.svg",
    "Mongodb.svg",
    "Vitejs.svg",
    "Csharp.svg",
    "Linux.svg",
    "Kotlin.svg",
    "Php.svg",
  ];
  return (
    <section id="about-me" className="about-me p-6 md:p-8">
      <h1 className="text-center text-2xl md:text-3xl lg:text-4xl">About Me</h1>
      <div className="flex mt-5 md:mt-8 justify-center gap-8">
        <div className="w-full lg:w-3/4 md:px-6">
          <h2 className="mb-4 text-center text-blue-400">
            Hi, My Name is Said AKA 3manuel{" "}
            <span className="wave text-2xl lg:text-3xl">👋</span>
          </h2>
          <h2 className="leading-6 text-center text-xs">
            Full Stack Web Developer/Software Programmer
          </h2>
          <h2 className="mb-4 leading-6 text-center text-xs">
            <img
              className="icon map inline"
              src={gitContenLikn + "morocco.svg"}
              alt=""
            />{" "}
            Morocco, Rabat
          </h2>
          <p className="leading-6 text-xs text-center md:text-left md:text-base sm:text-left ">
            I Just completed my{" "}
            <strong className="font-bold text-yellow-300 text-xs md:text-base">
              Specialized Technician Diploma in Software Development (Miage,
              Rabat){" "}
            </strong>
            covering full-stack web & desktop apps, and databases.
            <br />
            I'm a Self-driven learner that loves exploring low-level programming
            in <span className="date text-blue-600">C</span>{" "}
            <span className="date text-gray-500">(for 22 months)</span> , making
            scripts in
            <span className="date text-green-600"> Python</span>, Web
            Development in{" "}
            <span className="date text-yellow-400"> javascript/typescript</span>
            <span className="date text-gray-500"> (both for 2 years now)</span>
            ,I've also been using{" "}
            <span className="date text-red-600">Linux</span> for the past{" "}
            <span className="date text-gray-500">2 years</span> as my primary
            system and development environment, and I just started{" "}
            <span className="date text-gray-500">(july 22 2025)</span> my
            journey into machine learning in{" "}
            <span className="date text-blue-600">C++</span>.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 mt-8 gap-y-4 place-items-center md:grid-cols-5 lg:grid-cols-7 relative">
            {logos.map((logo, index) => (
              <div
                key={index}
                className="flex justify-center flex-col items-center group cursor-pointer"
              >
                <img
                  className="w-11 md:w-14"
                  src={gitContenLikn + logo}
                  alt={logo.split(".").length > 1 ? logo.split(".")[0] : ""}
                />
                <div className="text-[0.5rem] md:text-xs mt-2 opacity-0  group-hover:opacity-100 absolute text-outline">
                  {logo.split(".").length > 1 ? logo.split(".")[0] : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Aboutme;
