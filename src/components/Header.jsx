function Header() {
  return (
    <header className="border-bottom bg-body">
      <nav className="container py-3">
        <div className="d-flex align-items-center justify-content-between">
          <a href="/" className="text-decoration-none text-dark">
            <div className="d-flex align-items-center gap-2">
              <div className="rounded-3 bg-primary p-2 text-white">
                <i className="bi bi-images"></i>
              </div>

              <div>
                <h1 className="h5 mb-0 fw-bold">PixelForge</h1>

                <small className="text-secondary">
                  Image Resizer & Optimizer
                </small>
              </div>
            </div>
          </a>

          <div className="d-flex gap-2">
            <button className="btn btn-light">
              <i className="bi bi-clock-history me-2"></i>
              History
            </button>

            <button className="btn btn-light">
              <i className="bi bi-gear me-2"></i>
              Settings
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
