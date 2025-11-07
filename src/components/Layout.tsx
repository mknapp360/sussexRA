import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import SEO from './SEO'
import { Toaster } from "./ui/toaster"

export default function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const titles: Record<string, string> = {
    '/': 'Tarot Pathwork — Kabbalah, Tarot & Spiritual Sovereignty',
    '/about': 'About — Tarot Pathwork',
    '/readings': 'Tarot Readings — Book a Session',
    '/post': 'Blog — Insights & Teachings',
    '/contact': 'Contact — Get in Touch',
  }
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SEO
        title={titles[pathname] ?? 'Tarot Pathwork'}
        description="Kabbalah-rooted tarot, angelic correspondences, and sovereign spiritual practice."
        // Default Organization JSON-LD on every page:
        jsonLd={[
          {
            "@context":"https://schema.org",
            "@type":"Organization",
            "name":"Tarot Pathwork",
            "url":"https://www.yourdomain.com",
            "logo":"https://www.yourdomain.com/og/logo.png",
            "sameAs":[
              "https://www.tiktok.com/@tarotpathwork",
              "https://www.youtube.com/@tarotpathwork"
            ]
          }
        ]}
      />
      <Navbar transparent={isHome} />
      <main className={isHome ? '' : 'mx-auto'}>
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}
