import myImage from "../assets/personal-image/my-pic.jpg";
function Aboutme() {
  const gitContenLikn =
    "https://raw.githubusercontent.com/3manuel0/3manuel0/assets/";
  const logos = [
    "C.svg",
    "WebAssembly.svg",
    "Python.svg",
    "Javascript.svg",
    "bash.svg",
    "Mysql.svg",
    "Git.svg",
    "Nodejs.svg",
    "Postgresql.svg",
    "mongodb-icon-1.svg",
  ];
  return (
    <section className="about-me p-8">
      <h1 className="text-center">About Me</h1>
      <div className="flex mt-8 justify-center gap-8">
        <div className="w-2/4 px-6">
          <h2 className="mb-4 text-center">
            Hi, My Name is Said AKA 3manuel{" "}
            <span className="wave text-3xl">👋</span>
          </h2>
          <h2 className="leading-6 text-center text-xs">
            Full Stack Web Developer/Software Programmer
          </h2>
          <h2 className="leading-6 text-center text-xs">
            <span className="text-3xl map">🇲🇦</span> Morocco, Rabat
          </h2>
          <div className="grid grid-cols-4 mt-8 gap-y-4 place-items-center">
            {logos.map((logo) => (
              <div className="flex justify-center flex-col items-center">
                <img className="icon" src={gitContenLikn + logo} alt="" />
                <p className="text-xs mt-2">
                  {logo.split(".").length > 1 ? logo.split(".")[0] : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/4 ">
          <img src={myImage} alt="3manuel" />
        </div>
      </div>
    </section>
  );
}

export default Aboutme;
