import { useEffect, useState } from 'react'
import SEO from '../components/SEO'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Calendar, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import SubscribeModal from '../components/SubscribeModal'

interface Post {
  id: string
  title: string
  slug?: string
  excerpt?: string | null
  content: string            // was content_md
  cover_image?: string | null // was cover_image_url
  published_at: string | null
}

interface Event {
  id: string;
  slug: string;
  event_title: string;
  event_date: string;
  event_time: string;
  event_location_name: string;
  event_image: string;
  event_info: string;
  published: boolean;
}

export default function Home() {
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchRecentPosts()
  }, [])

  const fetchRecentPosts = async () => {
    try {
      const { data, error } = await supabase
      .from('posts')
      .select('id, title, slug, excerpt, content, cover_image, published_at')
      .eq('published', true)                       // was status='published'
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(3)

      if (error) throw error
      setRecentPosts(data || [])
    } catch (error) {
      console.error('Error fetching recent posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
  fetchRecentEvents();
}, []);

// Add this function to fetch the next 3 upcoming events
const fetchRecentEvents = async () => {
  try {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('id, slug, event_title, event_date, event_time, event_location_name, event_image, event_info')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) throw error;
    setRecentEvents((data as Event[]) || []);
  } catch (error) {
    console.error('Error fetching events:', error);
    setRecentEvents([]);
  } finally {
    setLoading(false);
  }
};

  const getExcerpt = (post: Post) => {
    if (post.excerpt) return post.excerpt
    const text = post.content.replace(/<[^>]*>/g, '')
    return text.length > 150 ? text.substring(0, 150) + '...' : text
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  const [showVideo, setShowVideo] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);

  return (
    <>
      <SEO
        title="Sussex Royal Arch"
        description="Royal Arch Freemasonry in Sussex"
        jsonLd={[{
          "@context":"https://schema.org",
          "@type":"WebSite",
          "name":"Sussex Royal Arch",
          "url":"https://www.sussexroyalarch.co.uk"
        }]}
      />

      {/* HERO */}
      <section className="bg-[#f0f0f0]">
        {/* Heading + subheading */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="py-12 sm:py-16">
            <h1 className="text-center font-semibold tracking-tight text-gray-900
                          text-4xl pt-8 sm:text-5xl md:text-6xl">
              Welcome to Sussex Royal Arch Masonry
            </h1>
            <p className="mt-4 text-center md:text-2xl sm:text-lg text-gray-600">
              A one journey, one organisation BLOG
            </p>
          </div>
        </div>

        {/* Large featured image */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
          <img
            src="/homeHero2.png"
            alt="Royal Arch regalia"
            className="w-full h-auto object-cover"
            fetchPriority="high"
          />
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto">
          <img
            src="/border.png"
            alt="woven border"
            className="w-full"
            fetchPriority="high"
          />
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display tracking-tight text-slate-900">
                Upcoming Events
              </h2>
              <p className="mt-2 text-slate-600">
                Join us for our upcoming meetings and special gatherings
              </p>
            </div>
            <Link 
              to="/events" 
              className="hidden sm:flex items-center gap-2 text-tpblue hover:text-tpgold transition-colors"
            >
              View all events
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-slate-200 h-48 rounded-lg mb-4" />
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-200 rounded w-full mb-1" />
                  <div className="h-3 bg-slate-200 rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : recentEvents.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentEvents.map((event) => (
                  <Card className="bg-[#f0f0f0] hover:shadow-lg transition-shadow">
                    <CardContent className="p-8">
                      <Link
                        key={event.id}
                        to={`/events/${event.slug}`}
                        className="group block"
                      >
                        <article className="h-full flex flex-col">
                          {event.event_image && (
                            <div className="relative aspect-video overflow-hidden rounded-lg mb-4 bg-slate-100">
                              <img 
                                src={event.event_image}
                                alt={event.event_title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                              <Calendar className="w-4 h-4" />
                              <span>{event.event_date}</span>
                            </div>
                            <h3 className="text-xl font-medium text-slate-900 group-hover:text-tpblue transition-colors mb-2">
                              {event.event_title}
                            </h3>
                            <p className="text-slate-600 text-sm mb-2">
                              📍 {event.event_location_name}
                            </p>
                            <p className="text-slate-600 text-sm line-clamp-2">
                              {event.event_info.replace(/<[^>]*>/g, '')}
                            </p>
                          </div>
                          <div className="mt-4 flex items-center text-tpblue group-hover:text-tpgold transition-colors">
                            <span className="text-sm font-medium">View details</span>
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </article>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-8 text-center sm:hidden">
                <Link 
                  to="/events" 
                  className="inline-flex items-center gap-2 text-tpblue hover:text-tpgold transition-colors"
                >
                  View all events
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p>No upcoming events scheduled. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto">
          <img
            src="/border.png"
            alt="woven border"
            className="w-full"
            fetchPriority="high"
          />
        </div>
      </section>

      {/* Chapters Near You */}
      <section className="bg-white pb-16">
        <div className="mx-auto">
          <img
            src="/provincialMap.png"
            alt="woven border"
            className="w-full"
            fetchPriority="high"
          />
        </div>

        {/* Heading */}
        <div className="container mx-auto px-4 pt-12 pb-8">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-headerText">
              Are you specifically looking to visit an exaltation?
            </h2>
            <div className="h-1 w-32 bg-primary mx-auto"></div>
          </div>
        </div>

        {/* Three Column Cards */}
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {/* Near 1066 */}
            <Card className="bg-[#f0f0f0] hover:shadow-lg transition-shadow">
              <CardContent className="p-8 flex flex-col h-full">
                <h3 className="text-2xl font-bold mb-6 text-headerText text-center">
                  Near 1066
                </h3>
                <ul className="space-y-2 mb-6 text-center flex-1">
                  <li className="text-muted-foreground">Battle</li>
                  <li className="text-muted-foreground">Bexhill</li>
                  <li className="text-muted-foreground">Burwash</li>
                  <li className="text-muted-foreground">Herstmonceux</li>
                  <li className="text-muted-foreground">Rye</li>
                  <li className="text-muted-foreground">St. Leonards</li>
                </ul>
                <div className="mt-auto text-center">
                  <Link
                    to={`/1066-royal-arch`}
                    >
                    <Button variant="outline" className="w-full">
                      See upcoming meetings
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Near Brighton */}
            <Card className="bg-[#f0f0f0] hover:shadow-lg transition-shadow">
              <CardContent className="p-8 flex flex-col h-full">
                <h3 className="text-2xl font-bold mb-6 text-headerText text-center">
                  Near Brighton
                </h3>
                <ul className="space-y-2 mb-6 text-center flex-1">
                  <li className="text-muted-foreground">Brighton</li>
                  <li className="text-muted-foreground">Hove</li>
                  <li className="text-muted-foreground">Lewes</li>
                  <li className="text-muted-foreground">Peacehaven</li>
                </ul>
                <div className="mt-auto text-center">
                  <Button variant="outline" className="w-full">
                    See upcoming meetings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Near Chichester */}
            <Card className="bg-[#f0f0f0] hover:shadow-lg transition-shadow">
              <CardContent className="p-8 flex flex-col h-full">
                <h3 className="text-2xl font-bold mb-6 text-headerText text-center">
                  Near Chichester
                </h3>
                <ul className="space-y-2 mb-6 text-center flex-1">
                  <li className="text-muted-foreground">Bognor Regis</li>
                  <li className="text-muted-foreground">Chichester</li>
                  <li className="text-muted-foreground">Midhurst</li>
                </ul>
                <div className="mt-auto text-center">
                  <Button variant="outline" className="w-full">
                    See upcoming meetings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Near Worthing */}
            <Card className="bg-[#f0f0f0] hover:shadow-lg transition-shadow">
              <CardContent className="p-8 flex flex-col h-full">
                <h3 className="text-2xl font-bold mb-6 text-headerText text-center">
                  Near Worthing
                </h3>
                <ul className="space-y-2 mb-6 text-center flex-1">
                  <li className="text-muted-foreground">Littlehampton</li>
                  <li className="text-muted-foreground">Pullborough</li>
                  <li className="text-muted-foreground">Worthing</li>
                </ul>
                <div className="mt-auto text-center">
                  <Button variant="outline" className="w-full">
                    See upcoming meetings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Near Crawley */}
            <Card className="bg-[#f0f0f0] hover:shadow-lg transition-shadow">
              <CardContent className="p-8 flex flex-col h-full">
                <h3 className="text-2xl font-bold mb-6 text-headerText text-center">
                  Near Crawley
                </h3>
                <ul className="space-y-2 mb-6 text-center flex-1">
                  <li className="text-muted-foreground">Crawley</li>
                  <li className="text-muted-foreground">East Grinstead</li>
                  <li className="text-muted-foreground">Horsham</li>
                  <li className="text-muted-foreground">Pullborough</li>
                </ul>
                <div className="mt-auto text-center">
                  <Button variant="outline" className="w-full">
                    See upcoming meetings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Near Eastbourne */}
            <Card className="bg-[#f2f2f2] hover:shadow-lg transition-shadow">
              <CardContent className="p-8 flex flex-col h-full">
                <h3 className="text-2xl font-bold mb-6 text-headerText text-center">
                  Near Eastbourne
                </h3>
                <ul className="space-y-2 mb-6 text-center flex-1">
                  <li className="text-muted-foreground">Eastbourne</li>
                  <li className="text-muted-foreground">Herstmonceux</li>
                  <li className="text-muted-foreground">Lewes</li>
                  <li className="text-muted-foreground">Uckfield</li>
                </ul>
                <div className="mt-auto text-center">
                  <Button variant="outline" className="w-full">
                    See upcoming meetings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto">
          <img
            src="/border.png"
            alt="woven border"
            className="w-full"
            fetchPriority="high"
          />
        </div>
      </section>

      {/* Membership & Mentoring Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-headerText">
            Membership & Mentoring
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Image */}
            <div className="order-2 md:order-1">
              <img
                src="/mentoring.png"
                alt="Membership and mentoring materials"
                
              />
            </div>

            {/* Right Column - Text */}
            <div className="order-1 md:order-2">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                As Royal Arch Companions we are all members of the ONUS team. In the 
                words of Shakespeare "one man in his time plays many parts" and you 
                might well be a Candidate's Proposer and Personal Mentor and at the 
                same time the Chapter Director of Ceremonies or perhaps a Royal Arch 
                Representative in your Craft Lodge. A similar set of circumstances 
                could equally apply to other Chapter Officers.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                In the ONUS system, whatever part, or parts we may play dovetail 
                together so that no one individual carries the responsibility for 
                looking after their fellow Companions. The onus is with us all.
              </p>
              <button className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors">
                Learn more
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto">
          <img
            src="/border.png"
            alt="woven border"
            className="w-full"
            fetchPriority="high"
          />
        </div>
      </section>

      {/* Recent Blog Posts Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display tracking-tight text-slate-900">
                Recent Writings
              </h2>
              <p className="mt-2 text-slate-600">
                Latest insights and teachings from the path
              </p>
            </div>
            <Link 
              to="/post" 
              className="hidden sm:flex items-center gap-2 text-tpblue hover:text-tpgold transition-colors"
            >
              View all posts
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-slate-200 h-48 rounded-lg mb-4" />
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-200 rounded w-full mb-1" />
                  <div className="h-3 bg-slate-200 rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : recentPosts.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentPosts.map((post) => (
                  <Card className="bg-[#f0f0f0] hover:shadow-lg transition-shadow">
                    <CardContent className="p-8">
                      <Link
                        key={post.id}
                        to={`/post/${post.slug || post.id}`}
                        className="group block"
                      >
                        <article className="h-full flex flex-col">
                          {post.cover_image && (
                            <div className="relative aspect-video overflow-hidden rounded-lg mb-4 bg-slate-100">
                              <img 
                                src={post.cover_image}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                              <Calendar className="w-4 h-4" />
                              <time dateTime={post.published_at || ''}>
                                {formatDate(post.published_at)}
                              </time>
                            </div>
                            <h3 className="text-xl font-medium text-slate-900 group-hover:text-tpblue transition-colors mb-2">
                              {post.title}
                            </h3>
                            <p className="text-slate-600 text-sm line-clamp-3">
                              {getExcerpt(post)}
                            </p>
                          </div>
                          <div className="mt-4 flex items-center text-tpblue hover:text-red-600 ">
                            <span className="text-sm font-medium">Read more</span>
                            <ArrowRight className="w-4 h-4 ml-2 hover:text-red-600 transition-transform" />
                          </div>
                        </article>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
                    
              </div>
              <div className="mt-8 text-center sm:hidden">
                <Link 
                  to="/post" 
                  className="inline-flex items-center gap-2 text-tpblue hover:text-tpgold transition-colors"
                >
                  View all posts
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p>No published posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      

      {/* 
       Deeper Info Section *
      <section className="bg-tpblue mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <div className="grid sm:grid-cols-3 gap-6 py-16 text-white">
          {[
            {title:'Kabbalah', body:'Living Tree insights and angelic correspondences.'},
            {title:'Tarot Pathwork', body:'Structured spreads for clarity and action.'},
            {title:'Courses', body:'Self-paced modules with weekly Q&A (coming soon).'},
          ].map((c, i) => (
            <div key={i} className="p-6 rounded-2xl border hover:shadow-sm">
              <h3 className="text-lg font-medium">{c.title}</h3>
              <p className="mt-2 text-white">{c.body}</p>
            </div>
          ))}
        </div>
      </section> */}

      {showVideo && (
  <div
    className="fixed inset-0 z-[70] flex items-center justify-center"
    aria-modal="true"
    role="dialog"
  >
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      onClick={() => setShowVideo(false)}
    />

    {/* Modal panel */}
    <div className="relative z-10 w-[92vw] max-w-3xl rounded-2xl border border-white/10 bg-[#0b0f1f] shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h3 className="text-tpwhite/90 font-medium">What is an Emanation?</h3>
        <button
          onClick={() => setShowVideo(false)}
          className="rounded-lg px-2 py-1 text-tpwhite/70 hover:text-tpwhite hover:bg-white/10"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Video */}
      <div className="aspect-video w-full">
        <iframe
          className="h-full w-full rounded-b-2xl"
          src="https://www.youtube.com/embed/xYf8ocy6bdY?autoplay=1&rel=0&modestbranding=1"
          title="What is an Emanation?"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  </div>
)}

      {/* Subscribe Modal */}
      <SubscribeModal 
        isOpen={showSubscribe} 
        onClose={() => setShowSubscribe(false)} 
      />
    </>
  )
}