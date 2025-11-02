import SEO from '../components/SEO'

export default function BookASession() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Lucian Kabbalah Spiritual Sessions",
      "provider": { "@type": "Person", "name": "Frater Lucis" },
      "areaServed": "Global",
      "offers": [
        { "@type": "Offer", "name": "Recorded Reading", "priceCurrency": "GBP", "price": "60" },
        { "@type": "Offer", "name": "1-Hour Spiritual Session", "priceCurrency": "GBP", "price": "60" },
        { "@type": "Offer", "name": "4-Block of Spiritual Sessions", "priceCurrency": "GBP", "price": "200" },
        { "@type": "Offer", "name": "Talisman Creation", "priceCurrency": "GBP", "price": "120" }
      ]
    }
  ]

  return (
    <>
      <SEO
        title="Book a Session — Lucian Kabbalah"
        description="Book a personal session with Frater Lucis — recorded reading, 1-hour spiritual session, 4-block mentorship, or custom talisman creation."
        jsonLd={jsonLd}
      />

      <section className="bg-tpblue text-tpwhite py-16 px-4">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl sm:text-5xl font-display tracking-tight mb-6">
            Book a Session
          </h1>
          <p className="text-lg leading-relaxed mb-10">
            Each session is an act of alignment — a moment to bring the unseen into understanding and the symbolic into form.  
            Whether through divination, dialogue, or talismanic creation, these sessions open a personal conduit between you and the divine order flowing through Lucian Kabbalah.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* RECORDED READING */}
            <div className="border border-white/20 rounded-2xl p-8 bg-black/30">
              <h2 className="text-2xl font-semibold mb-2">Recorded Reading</h2>
              <p className="text-sm text-white/80 mb-4">
                A deep tarot-based pathworking recorded just for you.  
                Delivered as a private video with a full interpretation of your current energetic pattern and angelic influences.
              </p>
              <p className="text-lg font-bold mb-4">£60</p>
              <a
                href="https://tarotpathwork.com/checkout/recorded-reading"
                className="inline-block bg-tpgold text-white rounded-xl px-4 py-2 hover:opacity-90 transition"
              >
                Book Recorded Reading
              </a>
            </div>

            {/* 1-HOUR SESSION */}
            <div className="border border-white/20 rounded-2xl p-8 bg-black/30">
              <h2 className="text-2xl font-semibold mb-2">1-Hour Spiritual Session</h2>
              <p className="text-sm text-white/80 mb-4">
                A live, one-to-one session via Zoom or voice call.  
                Blending tarot, Kabbalistic insight, and direct spiritual counsel to illuminate your current path.
              </p>
              <p className="text-lg font-bold mb-4">£60</p>
              <a
                href="https://tarotpathwork.com/checkout/spiritual-session"
                className="inline-block bg-tpgold text-white rounded-xl px-4 py-2 hover:opacity-90 transition"
              >
                Book 1-Hour Session
              </a>
            </div>

            {/* 4-BLOCK PACKAGE */}
            <div className="border border-white/20 rounded-2xl p-8 bg-black/30">
              <h2 className="text-2xl font-semibold mb-2">4-Block of Spiritual Sessions</h2>
              <p className="text-sm text-white/80 mb-4">
                A structured month of spiritual mentorship.  
                Four 1-hour sessions focused on alignment, shadow integration, and personal pathwork through the Living Tree.
              </p>
              <p className="text-lg font-bold mb-4">£200</p>
              <a
                href="https://tarotpathwork.com/checkout/4-block"
                className="inline-block bg-tpgold text-white rounded-xl px-4 py-2 hover:opacity-90 transition"
              >
                Book 4-Session Package
              </a>
            </div>

            {/* TALISMAN CREATION */}
            <div className="border border-white/20 rounded-2xl p-8 bg-black/30">
              <h2 className="text-2xl font-semibold mb-2">Talisman Creation</h2>
              <p className="text-sm text-white/80 mb-4">
                A consecrated object created specifically for your energetic and astrological pattern.  
                Designed through Lucian Kabbalistic principles and planetary correspondences.
              </p>
              <p className="text-lg font-bold mb-4">£120</p>
              <a
                href="https://tarotpathwork.com/checkout/talisman"
                className="inline-block bg-tpgold text-white rounded-xl px-4 py-2 hover:opacity-90 transition"
              >
                Request a Talisman
              </a>
            </div>
          </div>

          <p className="text-sm text-white/60 mt-12 max-w-3xl">
            *All sessions are conducted personally by Frater Lucis.  
            Upon booking, you’ll receive a confirmation email and details for scheduling or receiving your recording.*
          </p>
        </div>
      </section>
    </>
  )
}
