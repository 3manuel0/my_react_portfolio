import github from "../assets/logos/github.svg";
import linkedin from "../assets/logos/linkedin.svg";
import X from "../assets/logos/x.svg";
// import profile from "../assets/profile/profile.png";
function Aboutme() {
  const gitContenLikn =
    "https://raw.githubusercontent.com/3manuel0/3manuel0/refs/heads/assets/";

  interface ContactType {
    name: string;
    icon: string;
    url: string;
  }
  const contact: ContactType[] = [
    {
      name: "Linkedin",
      icon: linkedin,
      url: "https://www.linkedin.com/in/said-bennaji-4990492b6/",
    },
    { name: "Github", icon: github, url: "https://github.com/3manuel0" },
    {
      name: "X",
      icon: X,
      url: "https://x.com/3manuel_s",
    },
  ];

  const Web: string[] = [
    "WebAssembly.svg",
    "React.svg",
    "Nodejs.svg",
    "Flask.svg",
    "Vitejs.svg",
    "Tailwindcss.svg",
    // "Html.svg",
    // "Css.svg",
  ];
  const langs: string[] = [
    "C.svg",
    "C++.svg",
    // "Assembly.svg",
    "Python.svg",
    "Javascript.svg",
    "Typescript.svg",
    "Kotlin.svg",
    "Php.svg",
    // "Csharp.svg",
  ];
  const Other: string[] = ["Git.svg", "Linux.svg", "Voidlinux.svg", "Bash.svg"];
  const dbs: string[] = [
    "Mysql.svg",
    "Postgresql.svg",
    "Mongodb.svg",
    "Sqlite.svg",
  ];

  return (
    <section id="about-me" className="about-me p-6 md:p-8">
      <h1 className="text-center text-2xl md:text-3xl lg:text-4xl">About Me</h1>
      <div className="flex mt-5 md:mt-8 justify-center gap-8">
        <div className="w-full lg:w-3/4 md:px-6">
          <h2 className="mb-4 text-xl text-center text-blue-400">
            Hi, My Name is Said AKA 3manuel (Github: 3manuel0){" "}
            <span className="wave text-2xl lg:text-3xl">👋</span>
          </h2>
          <h2 className="leading-6 text-center text-xl">
            Software Engineering Student/Full Stack Web Developer
          </h2>
          <h2 className="mb-2 leading-6 text-center text-xl">
            <img
              className="icon map inline"
              src={gitContenLikn + "morocco.svg"}
              alt=""
            />{" "}
            Morocco, Rabat
          </h2>
          {/* contacts */}
          <div className="flex items-center justify-center gap-8 mb-2">
            {contact.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img className="w-14" src={social.icon} alt={social.name} />
              </a>
            ))}
          </div>
          {/* aboutme text */}
          <p className="leading-7 text-lg text-center md:text-center md:text-2xl sm:text-left">
            I focus on C and manual memory management, prioritizing lean
            foundations over heavy abstractions. While I use JavaScript and
            Python for automation and tooling, I am currently exploring Machine
            Learning by implementing concepts from the ground up in C. A Void
            Linux user, I value a development workflow built on transparency and
            technical control.
          </p>
          <div className="w-full lg:w-3/4 md:px-6">
            <div className="flex mt-8">
              <h2 className="leading-6 text-xl text-center text-blue-400">
                Languages:
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-4 place-items-center w-full md:grid-cols-5 lg:grid-cols-7 relative">
                {langs.map((logo, index) => (
                  <div
                    key={index}
                    className="flex justify-center flex-col items-center group cursor-pointer"
                  >
                    <img
                      className="w-11"
                      src={gitContenLikn + logo}
                      alt={logo.split(".").length > 1 ? logo.split(".")[0] : ""}
                    />
                    <div className="text-[0.5rem] md:text-lg mt-2 opacity-0  group-hover:opacity-100 absolute text-outline">
                      {logo.split(".").length > 1 ? logo.split(".")[0] : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex mt-8">
              <h2 className="leading-6 text-xl text-center text-blue-400">
                Web Development:
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 w-full gap-y-4 place-items-center md:grid-cols-5 lg:grid-cols-7 relative">
                {Web.map((logo, index) => (
                  <div
                    key={index}
                    className="flex justify-center flex-col items-center group cursor-pointer"
                  >
                    <img
                      className="w-11"
                      src={gitContenLikn + logo}
                      alt={logo.split(".").length > 1 ? logo.split(".")[0] : ""}
                    />
                    <div className="text-[0.5rem] md:text-lg mt-2 opacity-0  group-hover:opacity-100 absolute text-outline">
                      {logo.split(".").length > 1 ? logo.split(".")[0] : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex mt-8">
              <h2 className="leading-6 text-xl text-center text-blue-400">
                Databases:
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 w-full gap-y-4 place-items-center md:grid-cols-5 lg:grid-cols-7 relative">
                {dbs.map((logo, index) => (
                  <div
                    key={index}
                    className="flex justify-center flex-col items-center group cursor-pointer"
                  >
                    <img
                      className="w-11"
                      src={gitContenLikn + logo}
                      alt={logo.split(".").length > 1 ? logo.split(".")[0] : ""}
                    />
                    <div className="text-[0.5rem] md:text-lg mt-2 opacity-0  group-hover:opacity-100 absolute text-outline">
                      {logo.split(".").length > 1 ? logo.split(".")[0] : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex mt-8">
              <h2 className="leading-6 text-xl text-center text-blue-400">
                Other:
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 w-full gap-y-4 place-items-center md:grid-cols-5 lg:grid-cols-7 relative">
                {Other.map((logo, index) => (
                  <div
                    key={index}
                    className="flex justify-center flex-col items-center group cursor-pointer"
                  >
                    <img
                      className="w-11"
                      src={gitContenLikn + logo}
                      alt={logo.split(".").length > 1 ? logo.split(".")[0] : ""}
                    />
                    <div className="text-[0.5rem] md:text-lg mt-2 opacity-0  group-hover:opacity-100 absolute text-outline">
                      {logo.split(".").length > 1 ? logo.split(".")[0] : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* profile */}
        {/* <div className="mt-0 ml-auto mr-auto flex max-w-[1000px]">

        <img className="w-1/3" src={profile} alt="profile-img" />
      </div> */}
        {/* languages */}
        {/* <div className="flex mt-5 md:mt-8 justify-center gap-8"></div> */}
      </div>
    </section>
  );
}

export default Aboutme;
