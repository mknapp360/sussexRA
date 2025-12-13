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

const scribeEDocuments: DocumentCard[] = [
  {
    id: 'ra-1',
    code: 'RA-1',
    title: 'Convocation Return',
    description: 'Official convocation return form for Chapter meetings and ceremonies - Version 2.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-1%20Convocation%20return%20ver2%20082020.docx',
  },
  {
    id: 'ra-2a',
    code: 'RA-2a',
    title: 'Chapter Installation Return',
    description: 'Return form for Chapter Installation ceremonies and officer appointments.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-2a%20Chapter%20Installation%20Return.doc',
  },
  {
    id: 'ra-2b',
    code: 'RA-2b',
    title: 'RA SGC Installation Return',
    description: 'Installation return form for Supreme Grand Chapter officers - Royal Arch version.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-2b%20SGC%20Installation%20Return%20-%20Royal%20Arch%20version.doc',
  },
  {
    id: 'ra-2c',
    code: 'RA-2c',
    title: 'RA Escort Information Sheet',
    description: 'Information sheet for escorts during Royal Arch ceremonies - May 2020 version.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-2c%20RA%20Escort%20Information%20Sheet%20May%202020%20ver%201.docx',
  },
  {
    id: 'ra-3',
    code: 'RA-3',
    title: 'RA Toast List',
    description: 'Official Royal Arch toast list effective from 1st May 2025 for ceremonial occasions.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-3%20RA%20Toast%20list%20-%20%20from%201st%20May%202025.pdf',
  },
  {
    id: 'ra-4',
    code: 'RA-4',
    title: 'Registration Form P',
    description: 'Official Royal Arch registration form for new members and transfers.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-4%20ROYAL-ARCH-Registration-Form-P.pdf',
  },
  {
    id: 'ra-5a',
    code: 'RA-5a',
    title: 'SGC Letter of Instruction 2024',
    description: 'Supreme Grand Chapter letter of instruction for Royal Arch procedures - 2024 edition.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-5a%20Royal%20Arch%20SGC%20Letter%20of%20Instruction%202024.pdf',
  },
  {
    id: 'ra-5a1',
    code: 'RA-5a1',
    title: 'SGCE Letter of Instruction 2023',
    description: 'Supreme Grand Chapter of England letter of instruction - 2023 edition.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-5a1%20Royal%20Arch%20SGCE%20Letter%20of%20Instruction%202023.pdf',
  },
  {
    id: 'ra-5b',
    code: 'RA-5b',
    title: 'Province Annual Dues 2023',
    description: 'Provincial annual dues schedule and payment information for Royal Arch - 2023.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-5b%20Province%20Annual%20Dues%20Royal%20Arch%202023%20-%20180123.pdf',
  },
  {
    id: 'ra-6a',
    code: 'RA-6a',
    title: 'Province Resignation Process',
    description: 'Official guidelines and procedures for processing member resignations within the Province of Sussex.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-6a%20Province%20of%20Sussex%20Resignation%20Process%20ver2.pdf',
  },
  {
    id: 'ra-6b',
    code: 'RA-6b',
    title: 'Preliminary Notice of Resignation',
    description: 'Preliminary notice form for Provincial Grand Chapter member resignations.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-6b%20PG%20Chapter%20Preliminary%20Notice%20of%20Resignation%20Form%20ver1.pdf',
  },
  {
    id: 'ra-7',
    code: 'RA-7',
    title: 'Dispensation Request Form',
    description: 'Form for requesting dispensations from the Provincial Grand Superintendent.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-7%20Dispensation%20Request%20Form.doc',
  },
  {
    id: 'ra-8',
    code: 'RA-8',
    title: 'Provincial Lotteries',
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
    id: 'ra-12',
    code: 'RA-12',
    title: 'Scribe E Handbook',
    description: 'Comprehensive handbook for Scribe E officers covering all administrative duties and responsibilities - December 2018.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-12%20Scribe%20E\'s%20Handbook%20-%20December%202018.pdf',
  },
  {
    id: 'ra-13',
    code: 'RA-13',
    title: 'PGCSx Bylaws 2023',
    description: 'Provincial Grand Chapter of Sussex Bylaws - February 2023 edition.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-13%20PGCSx%20By-Laws%20-%20February%202023%20.pdf',
  },
  {
    id: 'ra-14',
    code: 'RA-14',
    title: 'Data Protection',
    description: 'Official data protection notice and privacy guidelines for Chapter officers.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-14%20Data%20Protection%20Notice.pdf',
  },
  {
    id: 'ra-15',
    code: 'RA-15',
    title: 'Adverse Weather',
    description: 'Provincial guidance for Chapter meetings during adverse weather conditions.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-15%20Province%20-%20Adverse%20Weather%20Circular%20(1).pdf',
  },
  {
    id: 'ra-16',
    code: 'RA-16',
    title: 'Sussex Masonic Centres',
    description: 'Directory of Masonic centres and meeting locations throughout Sussex - November 2014.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-16%20Masonic%20Centres%20in%20Sussex%20-%20Nov%202014.pdf',
  },
  {
    id: 'ra-17',
    code: 'RA-17',
    title: 'Book of Constitutions',
    description: 'Royal Arch regulations from the Book of Constitutions - January 2020 edition.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-17%20Book%20of%20Constitutions%20-%20RA%20Regulations%20Jan%202020.pdf',
  },
  {
    id: 'ra-18',
    code: 'RA-18',
    title: 'Guide to Social Media',
    description: 'Sussex Provincial guide to appropriate use of social media for Chapters and members.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-18%20Sussex%20Guide%20to%20Social%20media%20vc.pdf',
  },
  {
    id: 'ra-29',
    code: 'RA-29',
    title: 'Prov Appointment & Promotions Policy 2020',
    description: 'Royal Arch Provincial appointment and promotions policy - November 2020.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-29%20RA%20Provincial%20Appointment%20and%20Promotions%20Policy%20Nov%202020.pdf',
  },
  {
    id: 'ra-30',
    code: 'RA-30',
    title: 'UGLE Online Comms Toolkit',
    description: 'United Grand Lodge of England online communications toolkit for digital outreach.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-30%20UGLE_Online_Comms_Toolkit_FINAL.pdf',
  },
  {
    id: 'ra-33',
    code: 'RA-33',
    title: 'UGLE Photography Toolkit',
    description: 'United Grand Lodge of England photography toolkit with guidelines for Chapter photography - Version 2.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-33%20UGLE_Photography_Toolkit_v2_NEW.pdf',
  },
  {
    id: 'ra-34',
    code: 'RA-34',
    title: 'UGLE Press Release Toolkit',
    description: 'United Grand Lodge of England press release toolkit for media communications - Version 3.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-34%20UGLE_online_press_release_Toolkitv3.pdf',
  },
  {
    id: 'ra-38',
    code: 'RA-38',
    title: 'Notice of Exaltation Ceremony',
    description: 'Official notice form for exaltation ceremonies and candidate information.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-38%20Notice%20of%20Exaltation%20Ceremony%20.pdf',
  },
  {
    id: 'ra-43',
    code: 'RA-43',
    title: 'Guidance on Red Table Meeting',
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
    id: 'ra-45',
    code: 'RA-45',
    title: 'Chapter Bylaws',
    description: 'Model bylaws template for Royal Arch Chapters - 2024 edition.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-45%20Chapter%20Model%20Bylaws%202024.docx',
  },
  {
    id: 'ra-47',
    code: 'RA-47',
    title: 'Wearing of Jewels in Lodge',
    description: 'Guidance on the proper wearing of Royal Arch jewels during Lodge meetings.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-47%20Wearing%20of%20Jewels%20in%20lodge.pdf',
  },
  {
    id: 'ra-48',
    code: 'RA-48',
    title: 'Discover More Booklet',
    description: 'Sussex Royal Arch introductory booklet for candidates and interested members - 2023 edition.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-48%20Sussex-Royal-Arch-Discover-More-Booklet-2023.pdf',
  },
  {
    id: 'ra-50',
    code: 'RA-50',
    title: 'Sojourners Readings',
    description: 'Official readings and scripts for Sojourners during Royal Arch ceremonies - Trifold version.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-50%20Sojourners%20Readings%20Trifold%20version.pdf',
  },
  {
    id: 'ra-53',
    code: 'RA-53',
    title: 'Guidance for the Exaltation of Multiple Candidates',
    description: 'Advice and guidance for conducting exaltation ceremonies with multiple candidates.',
    downloadUrl: 'https://yemckvysonazjfyvezli.supabase.co/storage/v1/object/public/docs/RA-53%20Advice%20and%20Guidance%20for%20the%20Exaltation%20of%20Multiple%20Candidates.pdf',
  },
];

export default function ScribeEDocs() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Scribe E Documents — Sussex Royal Arch",
      "url": "https://www.sussexroyalarch.co.uk/docs-forms/scribe-e-docs",
      "description": "Essential documents and forms for Royal Arch Chapter Scribe E officers in Sussex.",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.sussexroyalarch.co.uk" },
        { "@type": "ListItem", "position": 2, "name": "Documents & Forms", "item": "https://www.sussexroyalarch.co.uk/docs-forms" },
        { "@type": "ListItem", "position": 3, "name": "Scribe E Documents", "item": "https://www.sussexroyalarch.co.uk/docs-forms/scribe-e-docs" }
      ]
    }
  ];

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <>
      <SEO
        title="Scribe E Documents | Sussex Royal Arch"
        description="Comprehensive collection of administrative forms, handbooks, and resources for Royal Arch Chapter Scribe E officers in Sussex including meeting returns, bylaws, and communication guidelines."
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="bg-[#f0f0f0] py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center">
            <div className="mb-4 mt-8">
              <span className="text-6xl" role="img" aria-label="Scribe E">
                ✍️
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-headerText">
              Scribe E Documents
            </h1>
            <div className="h-1 w-32 bg-primary mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive administrative forms, handbooks, and resources for Scribe E officers 
              including meeting returns, bylaws, correspondence templates, and communication guidelines
            </p>
          </div>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scribeEDocuments.map((doc) => (
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
                    <span className="font-medium">Download Document</span>
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