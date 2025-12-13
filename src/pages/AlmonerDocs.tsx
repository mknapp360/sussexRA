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

const almonerDocuments: DocumentCard[] = [
  {
    id: 'ra-6a',
    code: 'RA-6a',
    title: 'Resignation Process',
    description: 'Official guidelines and procedures for processing member resignations within the Province of Sussex.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-6a%20Province%20of%20Sussex%20Resignation%20Process%20ver2.pdf',
  },
  {
    id: 'ra-6b',
    code: 'RA-6b',
    title: 'Notice of Resignation Form',
    description: 'Preliminary notice form for Provincial Grand Chapter member resignations.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-6b%20PG%20Chapter%20Preliminary%20Notice%20of%20Resignation%20Form%20ver1.pdf',
  },
  {
    id: 'ra-13',
    code: 'RA-13',
    title: 'PGCSx Bylaws',
    description: 'Provincial Grand Chapter of Sussex Bylaws - February 2023 edition.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-13%20PGCSx%20By-Laws%20-%20February%202023%20.pdf',
  },
  {
    id: 'ra-14',
    code: 'RA-14',
    title: 'Data Protection Notice',
    description: 'Official data protection notice and privacy guidelines for Chapter officers.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-14%20Data%20Protection%20Notice.pdf',
  },
  {
    id: 'ra-21',
    code: 'RA-21',
    title: 'Almoners Data Protection FAQs',
    description: 'UGLE Almoners data protection frequently asked questions and guidance.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-21%20UGLE%20Almoners\'%20data%20protection%20FAQs%20(4PWS).pdf',
  },
  {
    id: 'ra-22',
    code: 'RA-22',
    title: 'Almoners Duties',
    description: 'Comprehensive guide to Royal Arch Sussex Chapter Almoner duties and responsibilities.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-22%20RA%20Sussex%20Chapter%20%20-%20Almoner%20Duties%20v2.pdf',
  },
];

export default function AlmonerDocs() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Almoner Documents — Sussex Royal Arch",
      "url": "https://www.sussexroyalarch.co.uk/docs-forms/almoner-docs",
      "description": "Essential documents and forms for Royal Arch Chapter Almoners in Sussex.",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.sussexroyalarch.co.uk" },
        { "@type": "ListItem", "position": 2, "name": "Documents & Forms", "item": "https://www.sussexroyalarch.co.uk/docs-forms" },
        { "@type": "ListItem", "position": 3, "name": "Almoner Documents", "item": "https://www.sussexroyalarch.co.uk/docs-forms/almoner-docs" }
      ]
    }
  ];

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <>
      <SEO
        title="Almoner Documents | Sussex Royal Arch"
        description="Essential documents, forms, and resources for Royal Arch Chapter Almoners in Sussex including resignation processes, data protection guidance, and duty guidelines."
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="bg-[#f0f0f0] py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center">
            <div className="mb-4">
              <span className="text-6xl" role="img" aria-label="Almoner">
                🤝
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-headerText">
              Almoner Documents
            </h1>
            <div className="h-1 w-32 bg-primary mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Essential forms and guidance for Chapter Almoners including welfare visit records, 
              data protection guidelines, and resignation processes
            </p>
          </div>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {almonerDocuments.map((doc) => (
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