// pages/readings/RecordedReading.tsx
import SEO from '../../components/SEO'

export default function RecordedReading() {
  return (
    <>
      <SEO
        title="Recorded Reading — Book a Session"
        description="A deep tarot-based pathworking recorded privately for you."
      />
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <img
          src="/images/sessions/recorded-reading.jpg"
          alt="Recorded Reading"
          className="w-full aspect-[16/9] object-cover rounded-2xl mb-6"
        />
        <h1 className="text-3xl font-display tracking-tight mb-4">Recorded Reading</h1>
        <p className="text-slate-600 mb-6">
          A private video reading with full interpretation of your current energetic pattern and
          angelic influences in the language of the Living Tree.
        </p>
        <div className="flex items-center gap-4">
          <span className="text-xl font-semibold">£60</span>
          <a
            href="https://tarotpathwork.com/checkout/recorded-reading"
            className="rounded-xl bg-tpgold text-white px-4 py-2 hover:opacity-90 transition"
          >
            Book Recorded Reading
          </a>
        </div>
      </section>
    </>
  )
}
