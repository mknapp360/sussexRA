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

const treasurerDocuments: DocumentCard[] = [
  {
    id: 'ra-5a',
    code: 'RA-5a',
    title: 'SGC Letter of Instruction',
    description: 'Supreme Grand Chapter letter of instruction for Royal Arch financial procedures - 2024 edition.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-5a%20Royal%20Arch%20SGC%20Letter%20of%20Instruction%202024.pdf',
  },
  {
    id: 'ra-5a1',
    code: 'RA-5a1',
    title: 'SGCE Letter of Instruction',
    description: 'Supreme Grand Chapter of England letter of instruction for financial administration - 2023 edition.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-5a1%20Royal%20Arch%20SGCE%20Letter%20of%20Instruction%202023.pdf',
  },
  {
    id: 'ra-5b',
    code: 'RA-5b',
    title: 'RA Annual Dues 2023',
    description: 'Provincial annual dues schedule and payment information for Royal Arch Chapters - 2023.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-5b%20Province%20Annual%20Dues%20Royal%20Arch%202023%20-%20180123.pdf',
  },
  {
    id: 'ra-8',
    code: 'RA-8',
    title: 'Provincial Lotteries',
    description: 'Provincial guidelines and financial regulations for conducting lotteries within Chapters.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-8%20Province%20-%20Lotteries%20April%202011%20(4PWS).pdf',
  },
  {
    id: 'ra-13',
    code: 'RA-13',
    title: 'PGCSx Bylaws',
    description: 'Provincial Grand Chapter of Sussex Bylaws including financial regulations - February 2023 edition.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-13%20PGCSx%20By-Laws%20-%20February%202023%20.pdf',
  },
  {
    id: 'ra-14',
    code: 'RA-14',
    title: 'Data Protection Notice',
    description: 'Official data protection notice and privacy guidelines for handling member financial information.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-14%20Data%20Protection%20Notice.pdf',
  },
  {
    id: 'ra-24',
    code: 'RA-24',
    title: 'Chapter Treasurers Guide',
    description: 'Comprehensive guide for Chapter Treasurers covering financial management, accounting procedures, budget templates, and annual returns - June 2020 version.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-24%20Chapter%20Treasurer\'s%20Guide%20June%202020%20ver%201.pdf',
  },
];

export default function TreasurerDocs() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Treasurer Documents — Sussex Royal Arch",
      "url": "https://www.sussexroyalarch.co.uk/docs-forms/treasurer-docs",
      "description": "Essential documents and forms for Royal Arch Chapter Treasurers in Sussex.",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.sussexroyalarch.co.uk" },
        { "@type": "ListItem", "position": 2, "name": "Documents & Forms", "item": "https://www.sussexroyalarch.co.uk/docs-forms" },
        { "@type": "ListItem", "position": 3, "name": "Treasurer Documents", "item": "https://www.sussexroyalarch.co.uk/docs-forms/treasurer-docs" }
      ]
    }
  ];

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <>
      <SEO
        title="Treasurer Documents | Sussex Royal Arch"
        description="Essential financial forms, budget templates, and accounting guidance for Royal Arch Chapter Treasurers in Sussex including annual returns, dues schedules, and financial regulations."
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="bg-[#f0f0f0] py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center">
            <div className="mb-4 mt-8">
              <span className="text-6xl" role="img" aria-label="Treasurer">
                💰
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-headerText">
              Treasurer Documents
            </h1>
            <div className="h-1 w-32 bg-primary mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Essential financial forms, budget templates, annual returns, and accounting guidance 
              for Chapter Treasurers
            </p>
          </div>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {treasurerDocuments.map((doc) => (
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