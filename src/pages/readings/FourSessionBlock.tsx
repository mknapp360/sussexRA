import SEO from '../../components/SEO'
import BookingCalendar from '../../components/BookingCalendar'

export default function FourBlock() {
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
              <span className="text-xl font-semibold">£260</span>
            </div>

            <p className="mb-6">
              If you've a question before ordering, feel free to reach out via the contact page or DM.
            </p>

            <BookingCalendar
              duration={60}
              step={60}
              timezone="Europe/London"
              title="Book this Session"
              allowBooking={true} 
              serviceName="FourBlock"
              servicePrice="£260"
              onBooked={(booking) => {
                console.log('Booking successful:', booking)
                // You can add additional tracking or analytics here
              }}
            />
          </div>
        </div>
      </section>
    </>
  )
}