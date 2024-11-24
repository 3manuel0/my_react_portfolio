function Navbar() {
  return (
    <nav className="bg-gray-800 flex gap-48 p-4">
      <h2 className="font-bold text-3xl	leading-4">3manuel</h2>
      <ul className="flex justify-around w-1/2">
        <li>
          <a href="">About me</a>
        </li>
        <li>
          <a href="">Projects</a>
        </li>
        <li>
          <a href="">Contact</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
