import SEO from '../../components/SEO'
import BookingCalendar from '../../components/BookingCalendar'

export default function Talisman() {
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

            <p className="mb-6">
              If you've a question before ordering, feel free to reach out via the contact page or DM.
            </p>

            <BookingCalendar
              duration={60}
              step={60}
              timezone="Europe/London"
              title="Book this Session"
              allowBooking={true} 
              serviceName="Talisman"
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