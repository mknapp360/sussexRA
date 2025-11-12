import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import SEO from './SEO'
import { Toaster } from "./ui/toaster"

export default function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const titles: Record<string, string> = {
    '/': 'Home | Sussex Royal Arch',
    '/posts': 'Articles | Sussex Royal Arch',
    '/contact': 'Sussex Royal Arch - Contact',
  }
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SEO
        title={titles[pathname] ?? 'Sussex Royal Arch'}
        description="Royal Arch Freemasonry in Sussex."
        // Default Organization JSON-LD on every page:
        jsonLd={[
          {
            "@context":"https://schema.org",
            "@type":"Organization",
            "name":"Sussex Royal Arch",
            "url":"https://www.sussexroyalarch.co.uk/",
            "logo":"https://www.sussexroyalarch.co.uk//og/logo.png",
          }
        ]}
      />
      <Navbar/>
      <main className={isHome ? '' : 'mx-auto'}>
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}
