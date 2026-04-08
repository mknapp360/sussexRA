import { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

interface DocCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  slug: string;
  display_order: number;
}

export default function DocNForms() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<DocCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const { data, error } = await supabase
          .from('doc_categories')
          .select('id, title, description, icon, slug, display_order')
          .eq('published', true)
          .order('display_order');

        if (error) throw error;
        setCategories(data || []);
      } catch (err) {
        console.error('Error loading doc categories:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Documents & Forms — Sussex Royal Arch",
      "url": "https://www.sussexroyalarch.co.uk/docs-forms",
      "description": "Essential documents and forms for Royal Arch Chapter officers in Sussex.",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.sussexroyalarch.co.uk" },
        { "@type": "ListItem", "position": 2, "name": "Documents & Forms", "item": "https://www.sussexroyalarch.co.uk/docs-forms" }
      ]
    }
  ];

  return (
    <>
      <SEO
        title="Documents & Forms | Sussex Royal Arch"
        description="Essential documents, forms, and resources for Royal Arch Chapter officers in Sussex including guides for Almoners, DC, Janitors, Scribes E, Treasurers and more."
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="bg-[#f0f0f0] py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mt-8 mb-4 text-headerText">
              Documents & Forms
            </h1>
            <div className="h-1 w-32 bg-primary mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Essential documents and forms for Royal Arch Chapter officers in Sussex
            </p>
          </div>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-56 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((doc) => (
                <Card
                  key={doc.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col cursor-pointer"
                  onClick={() => navigate(`/docs-forms/${doc.slug}`)}
                >
                  {/* Icon Header */}
                  <div className="bg-gradient-to-br from-tpblue to-tpgold p-8 flex items-center justify-center">
                    <span className="text-6xl" role="img" aria-label={doc.title}>
                      {doc.icon}
                    </span>
                  </div>

                  {/* Card Content */}
                  <CardContent className="flex flex-col flex-1 p-6">
                    <h2 className="text-xl font-bold mb-3 text-foreground">{doc.title}</h2>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">{doc.description}</p>
                    <div className="flex items-center gap-2 text-sm text-tpblue hover:text-tpgold transition-colors cursor-pointer">
                      <FileText className="w-4 h-4" />
                      <span>View Documents</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-headerText">
              Need Help?
            </h2>
            <p className="text-muted-foreground mb-6">
              If you cannot find the document you're looking for, or if you need assistance with any forms,
              please contact your Chapter Secretary or the Provincial Office.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-tpblue text-white rounded-md hover:bg-tpgold transition-colors"
              >
                Contact Us
              </a>
              <a
                href="/posts"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-tpblue text-tpblue rounded-md hover:bg-tpblue hover:text-white transition-colors"
              >
                Visit Blog
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
