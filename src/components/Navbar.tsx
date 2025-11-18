import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Prevent scroll + Escape key
  useEffect(() => {
    if (open) {
      document.documentElement.classList.add("overflow-hidden");
    } else {
      document.documentElement.classList.remove("overflow-hidden");
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [open]);

  const link = "px-4 py-3 rounded-lg hover:bg-gray-100 transition text-lg font-medium";
  const active = "bg-gray-200 font-semibold";

  const NavItems = ({ onClick, isMobile }: { onClick?: () => void; isMobile?: boolean }) => (
    <>
      <NavLink
        to="/posts"
        className={({ isActive }) => `${link} ${isActive ? active : ""} ${isMobile ? "block w-full text-left" : ""}`}
        onClick={onClick}
      >
        Articles
      </NavLink>
      <NavLink
        to="/exaltations"
        className={({ isActive }) => `${link} ${isActive ? active : ""} ${isMobile ? "block w-full text-left" : ""}`}
        onClick={onClick}
      >
        Exaltations
      </NavLink>
      <NavLink
        to="/events"
        className={({ isActive }) => `${link} ${isActive ? active : ""} ${isMobile ? "block w-full text-left" : ""}`}
        onClick={onClick}
      >
        Events
      </NavLink>
      <NavLink
        to="/archway"
        className={({ isActive }) => `${link} ${isActive ? active : ""} ${isMobile ? "block w-full text-left" : ""}`}
        onClick={onClick}
      >
        Archway
      </NavLink>
      <NavLink
        to="/membership"
        className={({ isActive }) => `${link} ${isActive ? active : ""} ${isMobile ? "block w-full text-left" : ""}`}
        onClick={onClick}
      >
        Membership
      </NavLink>
      <NavLink
        to="/mentoring"
        className={({ isActive }) => `${link} ${isActive ? active : ""} ${isMobile ? "block w-full text-left" : ""}`}
        onClick={onClick}
      >
        Mentoring
      </NavLink>
      <NavLink
        to="/contact"
        className={({ isActive }) => `${link} ${isActive ? active : ""} ${isMobile ? "block w-full text-left" : ""}`}
        onClick={onClick}
      >
        Contact
      </NavLink>

      {/* Separator + Social Icons (vertical on mobile) */}
      {isMobile && <div className="my-6 h-px bg-gray-200" />}

      <div className={`gap-6 ${isMobile ? "flex flex-col" : "hidden md:flex items-center"}`}>
        <a href="https://www.tiktok.com/@tarotpathwork" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 opacity-80 hover:opacity-100">
          <img src="/tiktok-onBrand.png" alt="" className="w-7 h-7" />
          <span className={isMobile ? "text-lg" : "sr-only"}>TikTok</span>
        </a>
        <a href="https://www.reddit.com/user/Daoist360/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 opacity-80 hover:opacity-100">
          <img src="/reddit-onBrand.png" alt="" className="w-7 h-7" />
          <span className={isMobile ? "text-lg" : "sr-only"}>Reddit</span>
        </a>
        <a href="https://www.youtube.com/@tarotpathwork" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 opacity-80 hover:opacity-100">
          <img src="/youtube-onBrand.png" alt="" className="w-7 h-7" />
          <span className={isMobile ? "text-lg" : "sr-only"}>YouTube</span>
        </a>
      </div>
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="mx-auto max-w-7xl w-full h-16 flex items-center justify-between px-6 lg:px-12">
        {/* Logo + Title */}
        <NavLink to="/" className="flex items-center gap-3">
          <img src="/tripleTau.png" alt="Sussex Royal Arch Masonry" className="w-8 h-8" />
          <span className="font-bold text-xl tracking-tight text-gray-900">
            Sussex Royal Arch Masonry
          </span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 text-gray-800">
          <NavItems />
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`md:hidden fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      {/* Mobile Drawer */}
      <aside
        id="mobile-menu"
        className={`md:hidden fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl flex flex-col
                    transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
        aria-label="Mobile navigation"
      >
        {/* Drawer Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b shrink-0">
          <div className="flex items-center gap-3">
            <img src="/tripleTau.png" alt="" className="w-8 h-8" />
            <span className="font-bold text-xl">Menu</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Menu Content */}
        <nav className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-1">
            <NavItems isMobile onClick={() => setOpen(false)} />
          </div>
        </nav>
      </aside>
    </header>
  );
}