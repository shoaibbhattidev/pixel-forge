import { useEffect, useState } from "react";

function Header() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("pixel-forge-theme") === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    try {
      localStorage.setItem("pixel-forge-theme", darkMode ? "dark" : "light");
    } catch {}
  }, [darkMode]);


  return (
    <header className="border-bottom bg-body sticky-top">
      <nav className="container py-3" aria-label="Main navigation">
        <div className="d-flex align-items-center justify-content-between gap-3">
          <a href="/" className="text-decoration-none text-body">
            <div className="d-flex align-items-center gap-2">
              <div className="rounded-3 bg-primary p-2 text-white" aria-hidden="true">
                <i className="bi bi-images"></i>
              </div>
              <div>
                <h1 className="h5 mb-0 fw-bold">PixelForge</h1>
                <small className="text-secondary">Image Resizer & Optimizer</small>
              </div>
            </div>
          </a>
          <div className="d-flex align-items-center gap-2">
            <span className="badge rounded-pill text-bg-success d-none d-sm-inline-flex">
              <i className="bi bi-shield-check me-1"></i>
              100% Local Processing
            </span>
            <span className="small text-secondary d-none d-md-inline">
              Your images stay in your browser
            </span>
            <label className="theme-switch" title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
              <i className="bi bi-sun-fill theme-icon" aria-hidden="true"></i>
              <input
                id="theme-toggle"
                type="checkbox"
                role="switch"
                checked={darkMode}
                onChange={(event) => setDarkMode(event.target.checked)}
                aria-label="Toggle dark mode"
              />
              <span className="theme-slider" aria-hidden="true"></span>
              <i className="bi bi-moon-stars-fill theme-icon" aria-hidden="true"></i>
            </label>
          </div>
        </div>
      </nav>
    </header>
  );
}
export default Header;
