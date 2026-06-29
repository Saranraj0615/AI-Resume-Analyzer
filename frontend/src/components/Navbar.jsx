import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        🤖 <span>AI Resume Analyzer</span>
      </div>

      <ul className="nav-links">
        <li>Features</li>
        <li>How it Works</li>
        <li>About</li>
      </ul>

      <button className="start-btn">Help & Support</button>
    </nav>
  );
}

export default Navbar;