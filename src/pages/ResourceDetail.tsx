import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Button } from '../components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';

// (reuse or centralize this list so both pages share data)
const RESOURCES = [
  {
    slug: 'love-manifestation-worksheet',
    title: 'Love Manifestation Worksheet',
    description: `This worksheet helps you clarify the energetic pattern
    you wish to invite into your relationships. Write clearly what you seek,
    explore self-reflection prompts, and set aligned intentions.`,
    image: '/resources/love-manifestation.jpg',
    downloadUrl: '/downloads/love-manifestation.pdf',
  },
  {
    slug: 'shadow-work-guidebook',
    title: 'Shadow Work Guidebook',
    description: `An in-depth exploration of the hidden self.
    Use this guidebook to navigate emotional triggers and cultivate self-compassion
    through archetypal reflection.`,
    image: '/resources/shadow-field.jpg',
    downloadUrl: '/downloads/shadow-work-guidebook.pdf',
  },
  {
    slug: 'chakra-energy-pathways-chart',
    title: 'Chakra & Energy Pathways Chart',
    description: `A detailed map connecting chakras, sephiroth, and subtle-body currents.
    Perfect for meditation, healing work, or as a wall reference.`,
    image: '/resources/energy-pathways.jpg',
    downloadUrl: '/downloads/energy-pathways-chart.pdf',
  },
];

export default function ResourceDetail() {
  const { slug } = useParams();
  const resource = RESOURCES.find((r) => r.slug === slug);

  if (!resource) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-display mb-4">Resource Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The resource you’re looking for doesn’t exist or has been moved.
        </p>
        <Link to="/resources">
          <Button variant="secondary">Back to Resources</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${resource.title} — Tarot Pathwork`}
        description={resource.description.slice(0, 155)}
      />

      {/* HERO */}
      <section className="relative h-[44svh] w-full overflow-hidden">
        <img
          src={resource.image}
          alt={resource.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-transparent" />
        <div className="relative h-full flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <Link to="/resources" className="inline-flex items-center text-tpwhite mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Resources
            </Link>
            <h1 className="font-display text-4xl md:text-5xl text-white">
              {resource.title}
            </h1>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="container mx-auto px-4 py-12 max-w-6xl grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-headerText">About this resource</h2>
          <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
            {resource.description}
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="gap-2">
              <a href={resource.downloadUrl} download>
                <Download className="w-5 h-5" />
                Download PDF
              </a>
            </Button>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img
            src={resource.image}
            alt={resource.title}
            className="w-full h-auto object-cover"
          />
        </div>
      </section>
    </div>
  );
}
