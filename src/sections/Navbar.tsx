function Navbar() {
  return (
    <nav className="bg-gray-800 flex items-center justify-center gap-0 p-4 md:gap-48">
      <h2 className="font-bold text-2xl leading-4 md:text-3xl">3manuel</h2>
      <ul className="justify-around hidden lg:w-1/2 lg:flex ">
        <li>
          <a href="#about-me">About me</a>
        </li>
        <li>
          <a href="#projects">Projects</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
