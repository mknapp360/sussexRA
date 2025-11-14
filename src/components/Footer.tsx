export default function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="mx-auto text-center mt-4">
        <p>© 2023 - {new Date().getFullYear()} Provincial Grand Chapter of Sussex. All Rights Reserved</p>
        <a href="http://knapponthejob.com" className="underline">Created & Maintained by Comp. Martin Knapp</a>
      </div>
      <div className="mx-auto text-center px-4 sm:px-6 lg:px-8 py-8 text-sm text-slate-500 flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
        <div className="flex gap-4">
          <a href="/sitemap.xml" className="hover:text-slate-900">Sitemap</a>
          <a href="/robots.txt" className="hover:text-slate-900">Robots</a>
          <a href="/privacy" className="hover:text-slate-900">Privacy</a>
        </div>
      </div>
    </footer>
  )
}
