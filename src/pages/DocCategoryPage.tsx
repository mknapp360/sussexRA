import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { FileText, Download, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

interface DocCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  slug: string;
}

interface DocFile {
  id: string;
  code: string | null;
  title: string;
  description: string;
  download_url: string;
  display_order: number;
}

export default function DocCategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<DocCategory | null>(null);
  const [documents, setDocuments] = useState<DocFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    loadData(slug);
  }, [slug]);

  async function loadData(categorySlug: string) {
    setLoading(true);
    setNotFound(false);
    try {
      // Fetch category
      const { data: catData, error: catError } = await supabase
        .from('doc_categories')
        .select('id, title, description, icon, slug')
        .eq('slug', categorySlug)
        .eq('published', true)
        .single();

      if (catError || !catData) {
        setNotFound(true);
        return;
      }

      setCategory(catData);

      // Fetch documents for this category
      const { data: filesData, error: filesError } = await supabase
        .from('doc_files')
        .select('id, code, title, description, download_url, display_order')
        .eq('category_id', catData.id)
        .eq('published', true)
        .order('display_order');

      if (filesError) throw filesError;
      setDocuments(filesData || []);
    } catch (err) {
      console.error('Error loading category page:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading documents...</p>
      </div>
    );
  }

  if (notFound || !category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Category not found</h1>
        <Link to="/docs-forms" className="text-tpblue hover:underline">
          ← Back to Documents & Forms
        </Link>
      </div>
    );
  }

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": `${category.title} Documents — Sussex Royal Arch`,
      "url": `https://www.sussexroyalarch.co.uk/docs-forms/${category.slug}`,
      "description": category.description,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home",              "item": "https://www.sussexroyalarch.co.uk" },
        { "@type": "ListItem", "position": 2, "name": "Documents & Forms", "item": "https://www.sussexroyalarch.co.uk/docs-forms" },
        { "@type": "ListItem", "position": 3, "name": `${category.title} Documents`, "item": `https://www.sussexroyalarch.co.uk/docs-forms/${category.slug}` },
      ]
    }
  ];

  return (
    <>
      <SEO
        title={`${category.title} Documents | Sussex Royal Arch`}
        description={category.description}
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="bg-[#f0f0f0] py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center">
            <div className="mb-4 mt-8">
              <span className="text-6xl" role="img" aria-label={category.title}>
                {category.icon}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-headerText">
              {category.title} Documents
            </h1>
            <div className="h-1 w-32 bg-primary mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      {/* Back link */}
      <div className="container mx-auto max-w-6xl px-4 pt-8">
        <Link
          to="/docs-forms"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-tpblue transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Documents & Forms
        </Link>
      </div>

      {/* Documents Grid */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {documents.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p>No documents available in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <Card
                  key={doc.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col cursor-pointer"
                  onClick={() => window.open(doc.download_url, '_blank')}
                >
                  {/* Document Header */}
                  <div className="bg-gradient-to-br from-tpblue to-tpgold p-6 flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-12 h-12 text-white mx-auto mb-2" />
                      {doc.code && (
                        <span className="text-white text-sm font-semibold">{doc.code}</span>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <CardContent className="flex flex-col flex-1 p-6">
                    <h2 className="text-xl font-bold mb-3 text-foreground">{doc.title}</h2>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">{doc.description}</p>
                    <div className="flex items-center gap-2 text-sm text-tpblue hover:text-tpgold transition-colors">
                      <Download className="w-4 h-4" />
                      <span className="font-medium">Download Document</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
