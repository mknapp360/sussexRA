import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';

type Resource = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  // optional direct download url if you want to surface it later
  downloadUrl?: string;
};

const RESOURCES: Resource[] = [
  {
    slug: 'love-manifestation-worksheet',
    title: 'Love Manifestation Worksheet',
    excerpt:
      "Use this to tell the universe what you want in a partner or from your relationship.",
    image: 'LoveManifestation.png',
    downloadUrl: '/downloads/love-manifestation.pdf',
  },
  {
    slug: 'shadow-work-guidebook',
    title: 'Shadow Work Guidebook',
    excerpt:
      "A guided structure that blends spiritual wisdom with practical exercises to integrate the shadow.",
    image: 'shadowWork.png',
    downloadUrl: '/downloads/ShadowWorkbook.pdf',
  },
  {
    slug: 'chakra-energy-pathways-chart',
    title: 'Chakra & Energy Pathways Chart',
    excerpt:
      "Visualize energetic flow inside and outside of the body, with pathways mapped toward Source.",
    image: 'energyPathways.png',
    downloadUrl: '/downloads/energyPathwaysChart.pdf',
  },
];

export default function Resources() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Free Resources — Tarot Pathwork"
        description="Download free tools and deeper readings to support your spiritual journey."
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Free Resources',
            url: 'https://www.tarotpathwork.com/resources',
          },
        ]}
      />

      {/* HERO */}
      <section className="relative w-full overflow-hidden">
        {/* background image (swap for your own) */}
        <img
          src="/resources/library-hero.jpg"
          alt=""
          className="absolute inset-0 h-[44svh] w-full object-cover"
        />
        <div className="absolute inset-0 h-[44svh] w-full bg-gradient-to-tr from-black/70 via-black/40 to-transparent" />
        <div className="relative h-[44svh] flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="font-display text-4xl md:text-5xl text-white max-w-4xl">
              Free Resources for Your Spiritual Journey
            </h1>
            <p className="mt-4 text-white/90 max-w-3xl">
              Welcome to the sacred library. Below you’ll find tools crafted to
              deepen your connection with Self, Spirit, and Source. All
              offerings are free to download — may they serve you well on your
              journey.
            </p>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {RESOURCES.map((item) => (
            <Card
              key={item.slug}
              className="overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Image */}
              <div className="aspect-video overflow-hidden bg-muted">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <CardContent className="p-6 flex flex-col h-full">
                {/* Title */}
                <h2 className="text-xl font-bold mb-2 text-headerText">
                  {item.title}
                </h2>

                {/* Excerpt */}
                <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                  {item.excerpt}
                </p>

                {/* Action */}
                <div className="mt-auto">
                  <Button
                    onClick={() => navigate(`/resources/${item.slug}`)}
                    className="w-full gap-2"
                  >
                    View
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
