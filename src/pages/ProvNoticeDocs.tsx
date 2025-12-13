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

const provincialDocuments: DocumentCard[] = [
  {
    id: 'ra-3',
    code: 'RA-3',
    title: 'RA Toast List',
    description: 'Official Royal Arch toast list effective from 1st May 2025 for ceremonial occasions.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-3%20RA%20Toast%20list%20-%20%20from%201st%20May%202025.pdf',
  },
  {
    id: 'ra-8',
    code: 'RA-8',
    title: 'Province - Lotteries',
    description: 'Provincial guidelines and regulations for conducting lotteries within Chapters.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-8%20Province%20-%20Lotteries%20April%202011%20(4PWS).pdf',
  },
  {
    id: 'ra-10',
    code: 'RA-10',
    title: 'Provincial Raffles',
    description: 'Guidelines for organizing and conducting raffles within the Provincial Grand Chapter.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-10%20Province%20-%20Raffles%20(4PWS).pdf',
  },
  {
    id: 'ra-13',
    code: 'RA-13',
    title: 'PGCSx Bylaws',
    description: 'Provincial Grand Chapter of Sussex Bylaws - February 2023 edition.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-13%20PGCSx%20By-Laws%20-%20February%202023%20.pdf',
  },
  {
    id: 'ra-15',
    code: 'RA-15',
    title: 'Adverse Weather Circulation',
    description: 'Provincial guidance for Chapter meetings during adverse weather conditions.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-15%20Province%20-%20Adverse%20Weather%20Circular%20(1).pdf',
  },
  {
    id: 'ra-48',
    code: 'RA-48',
    title: 'RA Discover More Booklet 2023',
    description: 'Sussex Royal Arch introductory booklet for candidates and interested members - 2023 edition.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-48%20Sussex-Royal-Arch-Discover-More-Booklet-2023.pdf',
  },
];

export default function ProvNoticesDocs() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Provincial Notices — Sussex Royal Arch",
      "url": "https://www.sussexroyalarch.co.uk/docs-forms/provincial-notes",
      "description": "Official communications, circulars, and updates from the Provincial Grand Chapter of Sussex.",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.sussexroyalarch.co.uk" },
        { "@type": "ListItem", "position": 2, "name": "Documents & Forms", "item": "https://www.sussexroyalarch.co.uk/docs-forms" },
        { "@type": "ListItem", "position": 3, "name": "Provincial Notices", "item": "https://www.sussexroyalarch.co.uk/docs-forms/provincial-notes" }
      ]
    }
  ];

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <>
      <SEO
        title="Provincial Notices | Sussex Royal Arch"
        description="Official communications, circulars, bylaws, and updates from the Provincial Grand Chapter of Sussex including toast lists, lottery guidelines, and adverse weather procedures."
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="bg-[#f0f0f0] py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center">
            <div className="mb-4 mt-8">
              <span className="text-6xl" role="img" aria-label="Provincial Notices">
                📰
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-headerText">
              Provincial Notices
            </h1>
            <div className="h-1 w-32 bg-primary mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Official communications, circulars, bylaws, and updates from the 
              Provincial Grand Chapter of Sussex
            </p>
          </div>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {provincialDocuments.map((doc) => (
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