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
  customPath?: string;
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
  {
    slug: 'shem-angels',
    title: 'Find out who your Birth Angels are',
    excerpt: 'Everyone is assigned 3 angels at their birth, findout who yours are.',
    image: 'BirthAngelsTiktok.png',
    customPath: '/shem-angels', 
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
      <section className="relative h-[100svh] w-full overflow-hidden">
        {/* background image */}
        <img
          src="/resourcesHero2.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        {/* gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/30 to-transparent" />

        {/* content */}
        <div className="relative z-10 h-full">
          <div className=" flex h-full w-full items-center px-2 lg:px-2">
            <div className="max-w-2xl lg:ml-0 md:ml-8">
              <h1 className="text-4xl sm:text-6xl font-display tracking-tight text-white px-12 lg:px-12">
                Resources for Your Spiritual Journey
              </h1>
              <p className="text-4xl mt-6 sm:text-xl font-display tracking-tight text-white px-12 lg:px-12">
              Welcome to the sacred library. Below you’ll find tools crafted to
              deepen your connection with Self, Spirit, and Source.</p>
            </div>
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
                    onClick={() => navigate(item.customPath || `/resources/${item.slug}`)}
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
