import { NavLink } from "react-router-dom";

export default function Navbar() {
  const link = "px-3 py-2 rounded-md hover:bg-gray-100 transition";
  const active = "bg-gray-200";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="mx-auto max-w-7xl w-full h-16 flex items-center justify-between px-6 lg:px-12">
        
        {/* Logo / Name */}
        <NavLink
          to="/"
          className="font-semibold text-xl lg:text-2xl text-gray-900 tracking-tight"
        >
          Sussex Royal Arch Masonry
        </NavLink>

        {/* Nav Links */}
        <nav className="flex items-center gap-2 text-base text-gray-900">
          <NavLink to="/articles"   className={({ isActive }) => `${link} ${isActive ? active : ""}`}>Articles</NavLink>
          <NavLink to="/exaltations" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>Exaltations</NavLink>
          <NavLink to="/events"      className={({ isActive }) => `${link} ${isActive ? active : ""}`}>Events</NavLink>
          <NavLink to="/archway"     className={({ isActive }) => `${link} ${isActive ? active : ""}`}>Archway</NavLink>
          <NavLink to="/membership"  className={({ isActive }) => `${link} ${isActive ? active : ""}`}>Membership</NavLink>
          <NavLink to="/mentoring"   className={({ isActive }) => `${link} ${isActive ? active : ""}`}>Mentoring</NavLink>
          <NavLink to="/contact"     className={({ isActive }) => `${link} ${isActive ? active : ""}`}>Contact</NavLink>

          {/* Divider */}
          <div className="hidden sm:block w-px h-6 bg-gray-300 mx-2" />

          {/* Social Logos */}
          <a href="https://www.tiktok.com/@tarotpathwork" target="_blank" rel="noopener" className="opacity-80 hover:opacity-100">
            <img src="/tiktok-onBrand.png" className="w-6 h-6 object-contain" />
          </a>
          <a href="https://www.reddit.com/user/Daoist360/" target="_blank" rel="noopener" className="opacity-80 hover:opacity-100">
            <img src="/reddit-onBrand.png" className="w-6 h-6 object-contain" />
          </a>
          <a href="https://www.youtube.com/@tarotpathwork" target="_blank" rel="noopener" className="opacity-80 hover:opacity-100">
            <img src="/youtube-onBrand.png" className="w-6 h-6 object-contain" />
          </a>
        </nav>
      </div>
    </header>
  );
}