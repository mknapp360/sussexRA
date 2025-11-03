import SEO from '../../components/SEO'

export default function Talisman() {
  return (
    <>
      <SEO
        title="Talisman Creation — Book a Session"
        description="A consecrated object crafted for your energetic and astrological pattern using Lucian Kabbalistic and planetary principles."
      />
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Image */}
          <div className="w-full">
            <div className="overflow-hidden rounded-2xl">
              <img
                src="/images/sessions/talisman.jpg"
                alt="Consecrated talisman illustration in a ritual circle"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="text-slate-800">
            <h1 className="text-3xl sm:text-4xl font-display tracking-tight mb-3">
              Talisman Creation
            </h1>
            <p className="text-sm text-tpblue/80 font-medium mb-2">
              Designed for your chart and current emanations; crafted and consecrated with prayer and rite.
            </p>

            <p className="mb-4">Includes:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Consultation to define the aim and timing (electional, where possible).</li>
              <li>Design aligned to planetary/sephirothic correspondences and Shem angelic forces.</li>
              <li>Consecration rite and care instructions for ongoing work.</li>
            </ul>

            <div className="flex items-center gap-4">
              <span className="text-xl font-semibold">£120</span>
              <a
                href="https://tarotpathwork.com/checkout/talisman"
                className="rounded-xl bg-tpgold text-white px-4 py-2 hover:opacity-90 transition"
              >
                Request a Talisman
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
