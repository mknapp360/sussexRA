import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Prevent background scroll when drawer is open + handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) setOpen(false);
    };
    
    document.addEventListener('keydown', handleEscape);
    document.documentElement.classList.toggle("overflow-hidden", open);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [open]);

  const link = "px-3 py-2 rounded-md hover:bg-gray-100 transition";
  const active = "bg-gray-200";

  const NavItems = ({ onClick }: { onClick?: () => void }) => (
    <>
      <NavLink to="/posts"    className={({ isActive }) => `${link} ${isActive ? active : ""}`} onClick={onClick}>Articles</NavLink>
      <NavLink to="/exaltations" className={({ isActive }) => `${link} ${isActive ? active : ""}`} onClick={onClick}>Exaltations</NavLink>
      <NavLink to="/events"      className={({ isActive }) => `${link} ${isActive ? active : ""}`} onClick={onClick}>Events</NavLink>
      <NavLink to="/archway"     className={({ isActive }) => `${link} ${isActive ? active : ""}`} onClick={onClick}>Archway</NavLink>
      <NavLink to="/membership"  className={({ isActive }) => `${link} ${isActive ? active : ""}`} onClick={onClick}>Membership</NavLink>
      <NavLink to="/mentoring"   className={({ isActive }) => `${link} ${isActive ? active : ""}`} onClick={onClick}>Mentoring</NavLink>
      <NavLink to="/contact"     className={({ isActive }) => `${link} ${isActive ? active : ""}`} onClick={onClick}>Contact</NavLink>

 {/*     <div className="hidden md:block w-px h-6 bg-gray-300 mx-2" />

      <div className="flex items-center gap-2">
        <a href="https://www.tiktok.com/@tarotpathwork" target="_blank" rel="noopener" className="opacity-80 hover:opacity-100" aria-label="TikTok">
          <img src="/tiktok-onBrand.png" alt="" className="w-6 h-6 object-contain" />
        </a>
        <a href="https://www.reddit.com/user/Daoist360/" target="_blank" rel="noopener" className="opacity-80 hover:opacity-100" aria-label="Reddit">
          <img src="/reddit-onBrand.png" alt="" className="w-6 h-6 object-contain" />
        </a>
        <a href="https://www.youtube.com/@tarotpathwork" target="_blank" rel="noopener" className="opacity-80 hover:opacity-100" aria-label="YouTube">
          <img src="/youtube-onBrand.png" alt="" className="w-6 h-6 object-contain" />
        </a>
      </div> */}
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b mb-8">
      {/* Bar */}
      <div className="mx-auto max-w-7xl w-full h-16 flex items-center justify-between px-6 lg:px-12">
        {/* Logo + Title */}
        <NavLink to="/" className="flex items-center gap-2">
          <span className="inline-block w-7 h-7">
            <img src="/tripleTau.png" alt="Sussex Royal Arch Masonry logo" className="w-7 h-7" />
          </span>
          <span className="font-semibold text-xl lg:text-2xl text-gray-900 tracking-tight">
            Sussex Royal Arch Masonry
          </span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2 text-base text-gray-900">
          <NavItems />
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100"
          aria-label="Open menu"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer + backdrop */}
      {/* Backdrop */}
      <div
        className={`md:hidden fixed inset-0 bg-black/40 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      
      {/* Drawer panel */}
      <aside
        className={`md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl border-l
                    transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog" 
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className="h-16 flex items-center justify-between px-6 border-b">
          <div className="flex items-center gap-2">
            <span className="inline-block w-7 h-7">
              <img src="/tripleTau.png" alt="Sussex Royal Arch Masonry logo" className="w-7 h-7" />
            </span>
            <span className="font-semibold">Menu</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-md p-2 hover:bg-gray-100"
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        <div className="p-4 flex flex-col gap-1 text-gray-900">
          {/* mobile links; clicking closes drawer */}
          <NavItems onClick={() => setOpen(false)} />
        </div>
      </aside>
    </header>
  );
}