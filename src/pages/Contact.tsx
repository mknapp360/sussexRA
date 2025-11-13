import { useState } from 'react'
import SEO from '../components/SEO'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { useToast } from '../hooks/use-toast'

export default function Contact() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    // honeypot
    company: '',
  })

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.company) return // bot

    if (!form.firstName || !form.email || !form.message) {
      toast({ title: 'Missing fields', description: 'First name, email, and message are required.', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      // Preferred: send to your API route (e.g., Vercel/Resend, Nodemailer, etc.)
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'fraterlucis@tarotpathwork.com',
          subject: `New contact form message from ${form.firstName} ${form.lastName || ''}`,
          payload: form,
        }),
      })

      if (!res.ok) throw new Error('Failed to send via API')

      toast({ title: 'Message sent', description: 'Thanks — I’ll get back to you shortly.' })
      setForm({ firstName: '', lastName: '', email: '', phone: '', message: '', company: '' })
    } catch {
      // Fallback: open a mailto draft prefilled to Frater Lucis
      const body = [
        `Name: ${form.firstName} ${form.lastName}`,
        `Email: ${form.email}`,
        form.phone ? `Phone: ${form.phone}` : '',
        '',
        form.message
      ].filter(Boolean).join('%0D%0A')

      window.location.href = `mailto:fraterlucis@tarotpathwork.com?subject=Contact from ${encodeURIComponent(form.firstName)}&body=${body}`
      toast({ title: 'Opening email…', description: 'If no email app appears, your browser may be blocking it.' })
    } finally {
      setLoading(false)
    }
  }

  const jsonLd = [{
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    'name': 'Contact | Sussex Royal Arch',
    'url': 'https://www.sussexroyalarch.co.uk/contact',
    'mainEntity': {
      '@type': 'Organization',
      'name': 'Sussex Royal Arch',
      'email': 'martinknapp@sussexmasons.org.uk'
    }
  }]

  return (
    <>
      <SEO
        title="Contact | Sussex Royal Arch"
        description="Do you want to attend a Royal Arch meeting or create an event?."
        jsonLd={jsonLd}
      />

      <section className="min-h-screen mt-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left copy block */}
            <div>
              <h1 className="font-display text-4xl sm:text-5xl text-headerText tracking-tight">
                Do you want to attend a<br />meeting or create an event?
              </h1>
              <p className="mt-8 text-lg text-muted-foreground">
                Fill out the form, and we will book you into the chapter you would like to attend, or help you get the word out about your chapter event. 
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot */}
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={onChange}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name <span className="text-red-500">*</span></Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="First name"
                    value={form.firstName}
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Message"
                  value={form.message}
                  onChange={onChange}
                  required
                  className="min-h-[140px] w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none ring-0 focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full sm:w-auto px-8 py-6 rounded-xl">
                {loading ? 'Sending…' : 'Submit'}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
