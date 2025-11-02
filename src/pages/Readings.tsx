// pages/Readings.tsx
import SEO from '../components/SEO'
import { Link } from 'react-router-dom'

type Session = {
  slug: string
  title: string
  price: string
  blurb: string
  img: string
  cta: string
}

const SESSIONS: Session[] = [
  {
    slug: 'recorded-reading',
    title: 'Recorded Reading',
    price: '£60',
    blurb:
      'A deep tarot-based pathworking recorded just for you. Private video with full interpretation of your current energetic pattern and angelic influences.',
    img: '/readings.png',
    cta: 'Book Recorded Reading',
  },
  {
    slug: 'spiritual-session',
    title: '1-Hour Spiritual Session',
    price: '£60',
    blurb:
      'A live, one-to-one session via Zoom or voice. Blends tarot, Kabbalah, and direct counsel to illuminate your current path and next aligned action.',
    img: '/sessions.png',
    cta: 'Book 1-Hour Session',
  },
  {
    slug: '4-block',
    title: '4-Block of Spiritual Sessions',
    price: '£200',
    blurb:
      'A structured month of mentorship. Four 1-hour sessions focused on alignment, shadow integration, and personal pathwork through the Living Tree.',
    img: '/sessions.png',
    cta: 'Book 4-Session Package',
  },
  {
    slug: 'talisman',
    title: 'Talisman Creation',
    price: '£120',
    blurb:
      'A consecrated object crafted for your energetic and astrological pattern, designed and ritually made using Lucian Kabbalistic and planetary principles.',
    img: '/talisman.jpg',
    cta: 'Request a Talisman',
  },
]

export default function Readings() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Spiritual Sessions',
      'itemListElement': SESSIONS.map((s, i) => ({
        '@type': 'Product',
        'position': i + 1,
        'name': s.title,
        'offers': {
          '@type': 'Offer',
          'priceCurrency': 'GBP',
          'price': s.price.replace('£', ''),
          'url': `https://www.tarotpathwork.com/readings/${s.slug}`,
        },
      })),
    },
  ]

  return (
    <>
      <SEO
        title="Book a Session — Tarot Pathwork"
        description="Choose a Recorded Reading, 1-Hour Spiritual Session, 4-Block mentorship, or Talisman Creation."
        jsonLd={jsonLd}
      />

      <section className="bg-tpblue mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-tpblue mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl sm:text-5xl font-display tracking-tight text-tpwhite mb-3">
            Book a Session
          </h1>
          <p className="text-tpwhite max-w-3xl mb-8">
            Each session is an act of alignment — bringing the unseen into understanding and the symbolic into form.
            Begin with the format that fits your need; you can deepen into Lucian Kabbalah at your pace.
          </p>

          <div className="grid gap-6  sm:grid-cols-2 lg:grid-cols-3">
            {SESSIONS.map((s) => (
              <article
                key={s.slug}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow transition"
              >
                <div className="aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="p-6 flex flex-col h-full">
                  <div className="text-sm text-slate-500 mb-2">{s.price}</div>
                  <h2 className="text-xl font-semibold mb-2">{s.title}</h2>
                  <p className="text-slate-600 mb-6 flex-1">{s.blurb}</p>

                  <div className="mt-auto">
                    <Link
                      to={`/readings/${s.slug}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-tpgold text-white px-4 py-2 hover:opacity-90 transition"
                    >
                      {s.cta}
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
