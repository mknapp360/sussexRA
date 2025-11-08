import SEO from '../../components/SEO'
import BookingCalendar from '../../components/BookingCalendar'

export default function RecordedReading() {
  return (
    <>
      <SEO
        title="Recorded Reading — Book a Session"
        description="A private video reading with full interpretation of your current energetic pattern and angelic influences in the language of the Living Tree."
      />
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Image */}
          <div className="w-full">
            <div className="overflow-hidden rounded-2xl">
              <img
                src="/readings.png"
                alt="Tarot tools and candlelight prepared for a recorded reading"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="text-slate-800">
            <h1 className="text-3xl sm:text-4xl font-display tracking-tight mb-3">
              Recorded Reading
            </h1>
            <p className="text-sm text-tpblue/80 font-medium mb-2">
              A private video reading with full interpretation of your current energetic pattern and angelic
              influences in the language of the Living Tree.
            </p>

            <p className="mb-4">
              This reading is <strong>not live</strong> — it’s recorded for you. A private video link will be
              sent to your email.
            </p>

            <p className="mb-3">Popular focuses include:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li><em>Energetic Signature</em> — locate blockages across the chakras/sephiroth and the next step of shadow work.</li>
              <li><em>Light-work reading</em> — for practitioners, identify where to focus your efforts now.</li>
              <li><em>Life’s purpose</em> — clarify core lessons and the obstacles in the way.</li>
              <li><em>Future snapshot</em> — guidance toward near-term outcomes and aligned action.</li>
            </ul>

            <p className="mb-6">
              If you’ve a question before ordering, feel free to reach out via the contact page or DM.
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

            <BookingCalendar
              //calendarId={import.meta.env.VITE_PUBLIC_GCAL_ID}
              duration={60}
              step={60}
              timezone="Europe/London"
              title="Book this Session"
              allowBooking={false} // set to true after you plug in /api/gcal/book
              serviceName="1 Hour Spiritual Session"
              onBooked={(slot) => console.log('selected', slot)}
              />
          </div>
        </div>
      </section>
    </>
  )
}

// ENV VARS to add on Vercel (Project Settings → Environment Variables):
// GOOGLE_SERVICE_ACCOUNT_EMAIL
// GOOGLE_SERVICE_ACCOUNT_KEY (paste the JSON private_key value, make sure \n are preserved)
// GOOGLE_CALENDAR_ID (the calendar you want to read)
// VITE_PUBLIC_GCAL_ID (optional: expose the calendar id to the client)
//
// FINAL STEP: In Google Calendar, share the target calendar with your
// service account email ("See all event details" at minimum).
