import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useToast } from '../hooks/use-toast'

interface SubscribeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SubscribeModal({ isOpen, onClose }: SubscribeModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '', // honeypot
  })

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Honeypot check
    if (form.company) return
    
    if (!form.firstName || !form.email) {
      toast({
        title: 'Missing fields',
        description: 'First name and email are required.',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'fraterlucis@tarotpathwork.com',
          subject: `New newsletter subscriber: ${form.firstName} ${form.lastName || ''}`,
          payload: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            message: 'Newsletter subscription',
            company: form.company,
          },
        }),
      })

      if (!res.ok) throw new Error('Failed to subscribe')

      toast({
        title: 'Welcome!',
        description: 'You\'ve successfully subscribed to receive updates.',
      })
      
      // Reset form and close modal
      setForm({ firstName: '', lastName: '', email: '', company: '' })
      onClose()
    } catch (error) {
      toast({
        title: 'Subscription failed',
        description: 'Please try again or contact us directly.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="text-xl font-display text-slate-900">
            Subscribe to Updates
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Honeypot field - hidden from users */}
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
              <Label htmlFor="firstName">
                First name <span className="text-red-500">*</span>
              </Label>
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

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={onChange}
              required
            />
          </div>

          <p className="text-sm text-slate-600">
            Get notified about new articles, readings, and spiritual teachings.
          </p>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-tpblue hover:bg-tpblue/90"
              disabled={loading}
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}