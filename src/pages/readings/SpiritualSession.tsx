import SEO from '../../components/SEO'
import BookingCalendar from '../../components/BookingCalendar'

export default function SpiritualSession() {
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
              1-Hour Spiritual Session
            </h1>
            <p className="list-disc pl-6 space-y-2 mb-6">
              A live, one-to-one session via Zoom or voice. We work with tarot, Kabbalistic insight, and
              direct spiritual counsel to illuminate your present pattern. Private Spiritual Guidance Session
              This 60-minute session is your sacred space to receive deep, focused spiritual guidance exactly where you need it most.
              Whether you're facing a crossroads, feeling stuck, or seeking insight on a specific issue, this session offers clarity, recalibration, and momentum. Using intuitive dialogue, tarot (as needed), and spiritual coaching, we’ll explore what’s really going on—beneath the surface—and empower you with practical steps to move forward.
            </p>

            <p className="mb-4">What’s included:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Diagnose friction on the Tree (where energy is obstructed or leaking).</li>
              <li>Tarot insight as needed to support direction and clarity.</li>
              <li>Gentle shadow work reflection (if appropriate).</li>
              <li>Mindfulness and grounding tools to rebalance your energy.</li>
              <li>Tailored guidance or an optional “homework” prompt.</li>
            </ul>

            <p className="text-sm text-tpblue/80 font-medium mb-2">
            This session is ideal if you’re not quite ready for a full journey—but you are ready to take your next aligned step.
            </p>

            <p className="mb-6">
              If you've a question before ordering, feel free to reach out via the contact page or DM.
            </p>

            <BookingCalendar
              duration={60}
              step={60}
              timezone="Europe/London"
              title="Book this Session"
              allowBooking={true} 
              serviceName="Spiritual Session"
              servicePrice="£80"
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