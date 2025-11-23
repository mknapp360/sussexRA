import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import SEO from '../components/SEO'
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import TurnJSFlipBook from '../components/TurnJSFlipbook'

interface Flipbook {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  pdf_url: string;
  page_images: string[];
  page_location: string;
  display_order: number;
  published: boolean;
}

export default function MembershipEnhanced() {
  const [flipbooks, setFlipbooks] = useState<Flipbook[]>([]);
  const [selectedFlipbook, setSelectedFlipbook] = useState<Flipbook | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlipbooks();
  }, []);

  const fetchFlipbooks = async () => {
    try {
      const { data, error } = await supabase
        .from('flipbooks')
        .select('*')
        .eq('page_location', 'mentoring')
        .eq('published', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setFlipbooks(data || []);
    } catch (error) {
      console.error('Error fetching flipbooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const openFlipbook = (flipbook: Flipbook) => {
    // Check if flipbook has page images
    if (!flipbook.page_images || flipbook.page_images.length === 0) {
      alert('This flipbook has not been converted yet. Please contact the administrator.');
      return;
    }
    setSelectedFlipbook(flipbook);
  };

  const closeFlipbook = () => {
    setSelectedFlipbook(null);
  };

  return (
    <div className="min-h-screen bg-background">
        <SEO
                title="Sussex Royal Arch Membership"
                description="Learn about becoming a member of Royal Arch Freeemasonry"
                jsonLd={[
                  {
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": "Membership Information - Sussex Royal Arch",
                    "url": "https://www.sussexroyalarch.co.uk/membership",
                    "description": "Learn about becoming a member of Royal Arch Freemasonry in Sussex",
                    "isPartOf": {
                      "@type": "WebSite",
                      "name": "Sussex Royal Arch",
                      "url": "https://www.sussexroyalarch.co.uk"
                    }
                  },
                  {
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": "Sussex Royal Arch",
                    "description": "Royal Arch Freemasonry in Sussex Province",
                    "url": "https://www.sussexroyalarch.co.uk"
                  }
                ]}
              />

      {/* Header Section */}
      <section className="bg-[#f0f0f0] text-primary-foreground mt-12 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-black text-center text-4xl md:text-5xl font-bold mb-4">Mentoring</h1>
          <p className="text-black text-lg md:text-xl">
            This <strong>ONUS Royal Arch Mentoring Page</strong> has been created to offer help and guidance on all aspects of the 
            Mentoring process.  Including a description of the Sussex <strong>ONUS</strong> Mentoring System and bulletins promoting 
            noteworthy lectures and Royal Arch Mentoring initiatives, along with documents, demonstrations, and presentations available 
            via a link to the <strong>UGLE Solomon Mentors Corner Module.</strong>
          </p>
        </div>
      </section>

      {/* Flipbooks Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Loading flipbooks...</p>
            </div>
          ) : flipbooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No flipbooks available at this time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flipbooks.map((flipbook) => (
                <Card key={flipbook.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="aspect-[3/4] mb-4 overflow-hidden rounded-md bg-muted">
                      <img
                        src={flipbook.thumbnail_url}
                        alt={flipbook.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-xl">{flipbook.title}</CardTitle>
                    <CardDescription>{flipbook.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <Button 
                      onClick={() => openFlipbook(flipbook)}
                      className="w-full"
                    >
                      View Booklet
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Are you interested Section */}
      <section className="bg-[#f0f0f0] text-primary-foreground py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div>
            <img src="medals.png" className='mx-auto items-center' alt="" />
          </div>
          <p className="text-black text-lg md:text-xl">
            The Provincial Mentoring Team is available to help any Chapter or Companion with the implementation of the ONUS system 
            and provide additional resources in suppot of all aspects of this Mentoring  process. The team can be contacted at:  
            <strong className='text-blue-600'><a href="mailto:ramentor@sussexmasons.org.uk"> ramentor@sussexmasons.org.uk</a></strong>
          </p>
          
        </div>
      </section>

      {/* FlipBook Modal */}
      {selectedFlipbook && (
        <div 
          className="fixed inset-0 bg-white/60 backdrop-blur-md z-50 flex items-center justify-center p-2 md:p-4"
          onClick={closeFlipbook}
        >
          <div 
            className="relative w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeFlipbook}
              className="absolute top-4 right-4 z-[60] p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full shadow-lg transition-colors"
              aria-label="Close flipbook"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Flipbook Title */}
            <div className="absolute top-4 left-4 z-[60] bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold text-white">{selectedFlipbook.title}</h2>
            </div>

            {/* Turn.js FlipBook Viewer */}
            <TurnJSFlipBook 
              pageImages={selectedFlipbook.page_images} 
              onClose={closeFlipbook}
            />
          </div>
        </div>
      )}
    </div>
  );
}