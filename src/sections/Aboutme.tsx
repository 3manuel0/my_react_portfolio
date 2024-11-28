import myImage from "../assets/personal-image/my-pic.jpg";
function Aboutme() {
  return (
    <section className="about-me p-8">
      <h1 className="text-center">About Me</h1>
      <div className="flex mt-8 justify-center gap-8">
        <div className="w-2/4 px-6">
          <h2 className="mb-4 text-center">
            Hi, My Name is Said AKA 3manuel{" "}
            <span className="wave text-3xl">👋</span>
          </h2>
          <p className="leading-6 text-center text-xs">
            Full Stack Web Developer/Software Programmer
          </p>
          <p className="leading-6 text-center text-xs">
            <span className="text-3xl map">🇲🇦</span> Morocco, Rabat
          </p>
          <div className="grid grid-cols-4 mt-8">
            <img
              className="icon"
              src="https://raw.githubusercontent.com/3manuel0/3manuel0/assets/WebAssembly_Logo.svg"
              alt=""
            />
            <img
              className="icon"
              src="https://raw.githubusercontent.com/3manuel0/3manuel0/assets/javascript-1.svg"
              alt=""
            />
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
