import myImage from "../assets/personal-image/my-pic.jpg";
function Aboutme() {
  return (
    <section className="about-me p-8">
      <h1 className="text-center">About Me</h1>
      <div className="flex mt-4">
        <div className="w-3/4 px-6">
          <h2 className="mb-4">
            Hi, My Name is Said Bennaji, AKA 3manuel{" "}
            <span className="wave text-3xl">👋.</span>
          </h2>
          <p className="leading-8">
            I'm a Full Stack Web Developer/Software Programmer from Morocco.
          </p>
        </div>
        <div className="w-1/4 ">
          <img src={myImage} alt="3manuel" />
        </div>
      </div>
    </section>
  );
}

export default Aboutme;
