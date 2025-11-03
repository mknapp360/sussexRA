import SEO from '../../components/SEO'

export default function FourBlock() {
  return (
    <>
      <SEO
        title="4-Block of Spiritual Sessions — Book a Session"
        description="A structured month of mentorship: four 1-hour sessions focused on alignment, shadow integration, and personal pathwork."
      />
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Image */}
          <div className="w-full">
            <div className="overflow-hidden rounded-2xl">
              <img
                src="/images/sessions/four-block.jpg"
                alt="Four-session mentorship concept imagery"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="text-slate-800">
            <h1 className="text-3xl sm:text-4xl font-display tracking-tight mb-3">
              4-Block of Spiritual Sessions
            </h1>
            <p className="text-sm text-tpblue/80 font-medium mb-2">
              A month of guided pathworking: we map, correct, and reinforce your energetic alignment with
              practical steps between sessions.
            </p>

            <p className="mb-4">Typical arc (customized to you):</p>
            <ol className="list-decimal pl-6 space-y-2 mb-6">
              <li>Initial diagnosis on the Tree; define aims and rule out noise.</li>
              <li>Shadow integration & habit realignment; simple ritual supports.</li>
              <li>Angel work & timing; strengthen cooperation with the current.</li>
              <li>Consolidation; personal liturgy and accountability plan.</li>
            </ol>

            <div className="flex items-center gap-4">
              <span className="text-xl font-semibold">£200</span>
              <a
                href="https://tarotpathwork.com/checkout/4-block"
                className="rounded-xl bg-tpgold text-white px-4 py-2 hover:opacity-90 transition"
              >
                Book 4-Session Package
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
