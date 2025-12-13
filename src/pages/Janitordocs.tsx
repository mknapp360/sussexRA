import { Card, CardContent } from '../components/ui/card';
import { FileText, Download } from 'lucide-react';
import SEO from '../components/SEO';

interface DocumentCard {
  id: string;
  code: string;
  title: string;
  description: string;
  downloadUrl: string;
}

const janitorDocuments: DocumentCard[] = [
  {
    id: 'ra-51',
    code: 'RA-51',
    title: 'Janitors Handbook',
    description: 'Comprehensive handbook for Chapter Janitors covering temple preparation checklists, equipment maintenance logs, setup guidelines, and ceremonial responsibilities.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-51%20Janitors%20Handbook%20.pdf',
  },
];

export default function JanitorDocs() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Janitor Documents — Sussex Royal Arch",
      "url": "https://www.sussexroyalarch.co.uk/docs-forms/janitor-docs",
      "description": "Essential documents and forms for Royal Arch Chapter Janitors in Sussex.",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.sussexroyalarch.co.uk" },
        { "@type": "ListItem", "position": 2, "name": "Documents & Forms", "item": "https://www.sussexroyalarch.co.uk/docs-forms" },
        { "@type": "ListItem", "position": 3, "name": "Janitor Documents", "item": "https://www.sussexroyalarch.co.uk/docs-forms/janitor-docs" }
      ]
    }
  ];

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <>
      <SEO
        title="Janitor Documents | Sussex Royal Arch"
        description="Essential documents and resources for Royal Arch Chapter Janitors in Sussex including temple preparation checklists, equipment maintenance, and setup guidelines."
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="bg-[#f0f0f0] py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center">
            <div className="mb-4 mt-8">
              <span className="text-6xl" role="img" aria-label="Janitor">
                🔑
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-headerText">
              Janitor Documents
            </h1>
            <div className="h-1 w-32 bg-primary mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Essential documentation for Chapter Janitors including temple preparation checklists, 
              equipment maintenance logs, and ceremonial setup guidelines
            </p>
          </div>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {janitorDocuments.map((doc) => (
              <Card 
                key={doc.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col cursor-pointer"
                onClick={() => handleDownload(doc.downloadUrl)}
              >
                {/* Document Header */}
                <div className="bg-gradient-to-br from-tpblue to-tpgold p-6 flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-white mx-auto mb-2" />
                    <span className="text-white text-sm font-semibold">{doc.code}</span>
                  </div>
                </div>

                {/* Card Content */}
                <CardContent className="flex flex-col flex-1 p-6">
                  {/* Title */}
                  <h2 className="text-xl font-bold mb-3 text-foreground">
                    {doc.title}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 flex-1">
                    {doc.description}
                  </p>

                  {/* Download Button */}
                  <div className="flex items-center gap-2 text-sm text-tpblue hover:text-tpgold transition-colors">
                    <Download className="w-4 h-4" />
                    <span className="font-medium">Download PDF</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}