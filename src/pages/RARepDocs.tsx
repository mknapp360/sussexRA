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

const raRepDocuments: DocumentCard[] = [
  {
    id: 'ra-23',
    code: 'RA-23',
    title: 'RA Representative Handbook',
    description: 'Comprehensive handbook for Royal Arch Representatives including liaison guidelines, reporting procedures, and best practices - Version 3.2.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-23%20Royal%20Arch%20Representatives%20Handbook%20v3.2%20%20Dec%2019.pdf',
  },
  {
    id: 'ra-25',
    code: 'RA-25',
    title: 'RA Completing Your Journey',
    description: 'Guide explaining how the Royal Arch completes the Craft journey for Master Masons.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-25%20The%20Royal%20Arch%20-%20Completing%20Your%20Journey.pdf',
  },
  {
    id: 'ra-26',
    code: 'RA-26',
    title: 'RA Rep Talk 5min to Lodge',
    description: 'Five-minute presentation template for RA Representatives to deliver in Craft Lodges - May 2020 version.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-26%20RA%20Rep%20talk%205min%20to%20lodge%20May%202020%20ver1.pdf',
  },
  {
    id: 'ra-36',
    code: 'RA-36',
    title: 'Completing the Square',
    description: 'Educational material on the significance of completing the square in Royal Arch Masonry.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-36%20Completing%20the%20square-sololmon.pdf',
  },
  {
    id: 'ra-37',
    code: 'RA-37',
    title: 'From the Craft to the Royal Arch',
    description: 'Guidance document explaining the natural progression from Craft Freemasonry to the Royal Arch.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-37%20From%20the%20Craft%20to%20the%20Royal%20Arch-%20sololmon.pdf',
  },
  {
    id: 'ra-40',
    code: 'RA-40',
    title: 'RA Introduction Part 2',
    description: 'Second part of the introductory material for new Royal Arch members.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-40%20RA%20introduction%202%20part%20version.pdf',
  },
  {
    id: 'ra-43',
    code: 'RA-43',
    title: 'Grand Chapter Guidance for Red Table Meetings',
    description: 'Official Provincial Grand Chapter guidance on conducting Red Table Meetings.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-43%20Provincial%20Grand%20Chapter%20Guidance%20on%20Red%20Table%20Meetings.pdf',
  },
  {
    id: 'ra-44',
    code: 'RA-44',
    title: 'New Companions Handbook',
    description: 'Essential handbook for newly exalted Companions covering Royal Arch fundamentals and responsibilities.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-44%20New%20Companions%20Handbook.pdf',
  },
  {
    id: 'ra-48',
    code: 'RA-48',
    title: 'Discover More Booklet 2023',
    description: 'Sussex Royal Arch introductory booklet for candidates and interested members - 2023 edition.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-48%20Sussex-Royal-Arch-Discover-More-Booklet-2023.pdf',
  },
  {
    id: 'ra-49',
    code: 'RA-49',
    title: 'Sojourners Readings',
    description: 'Official readings and scripts for Sojourners during Royal Arch ceremonies.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-49%20Sojourners%20Readings%20A4%20Flat.pdf',
  },
];

export default function RARepDocs() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "RA Representative Documents — Sussex Royal Arch",
      "url": "https://www.sussexroyalarch.co.uk/docs-forms/ra-rep-docs",
      "description": "Essential documents and resources for Royal Arch Representatives in Sussex.",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.sussexroyalarch.co.uk" },
        { "@type": "ListItem", "position": 2, "name": "Documents & Forms", "item": "https://www.sussexroyalarch.co.uk/docs-forms" },
        { "@type": "ListItem", "position": 3, "name": "RA Rep Documents", "item": "https://www.sussexroyalarch.co.uk/docs-forms/ra-rep-docs" }
      ]
    }
  ];

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <>
      <SEO
        title="RA Representative Documents | Sussex Royal Arch"
        description="Essential documents and resources for Royal Arch Representatives in Sussex including handbooks, presentation templates, educational materials, and liaison guidelines."
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="bg-[#f0f0f0] py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center">
            <div className="mb-4 mt-8">
              <span className="text-6xl" role="img" aria-label="RA Representative">
                👔
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-headerText">
              RA Representative Documents
            </h1>
            <div className="h-1 w-32 bg-primary mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Essential resources for Royal Arch Representatives including liaison guidelines, 
              presentation templates, educational materials, and reporting forms
            </p>
          </div>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {raRepDocuments.map((doc) => (
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