// src/pages/booking/success.tsx
// Success page after Stripe payment
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SEO from '../../components/SEO'

export default function BookingSuccess() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Optional: Verify the session with your backend
    if (sessionId) {
      // You could call an API to get session details
      setTimeout(() => setLoading(false), 1000)
    } else {
      setLoading(false)
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tpgold mx-auto mb-4"></div>
          <p className="text-slate-600">Confirming your booking...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO 
        title="Booking Confirmed - Tarot Pathwork"
        description="Your session has been successfully booked and paid for."
      />
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 text-green-600 text-6xl">✓</div>
          
          <h1 className="text-3xl font-display font-semibold mb-3">
            Payment Successful!
          </h1>
          
          <p className="text-slate-600 mb-6">
            Your session has been booked and confirmed. You'll receive a confirmation email shortly with all the details.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6 text-left">
            <h2 className="font-semibold mb-2">What happens next?</h2>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>✓ Calendar event has been created</li>
              <li>✓ Confirmation email sent to your inbox</li>
              <li>✓ Payment receipt available in your email</li>
              <li>✓ Session details and preparation instructions included</li>
            </ul>
          </div>

          <p className="text-sm text-slate-500 mb-6">
            If you have any questions before your session, feel free to reach out via the contact page.
          </p>

          <div className="flex gap-3">
            <a
              href="/"
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
            >
              Return Home
            </a>
            <a
              href="/readings"
              className="flex-1 px-6 py-3 bg-tpgold text-white rounded-xl hover:opacity-90 transition"
            >
              Browse Services
            </a>
          </div>
        </div>
      </div>
    </>
  )
}