// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import Navbar from "./sections/Navbar";
import Aboutme from "./sections/Aboutme";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";
import "./App.css";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <Aboutme />
      <Projects />
      {/* <Contact /> */}
    </>
  );
}

export default App;
