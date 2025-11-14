import  { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface EnhancedFlipBookViewerProps {
  pdfUrl: string;
  onClose?: () => void;
}

export default function EnhancedFlipBookViewer({ pdfUrl, onClose }: EnhancedFlipBookViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const flipbookRef = useRef<HTMLDivElement>(null);
  const turnInstanceRef = useRef<any>(null);

  useEffect(() => {
    loadTurnJS();
  }, []);

  useEffect(() => {
    if (pdfUrl) {
      convertPDFToImages(pdfUrl);
    }
  }, [pdfUrl]);

  const loadTurnJS = () => {
    // Load jQuery if not already loaded
    if (!(window as any).jQuery) {
      const jqueryScript = document.createElement('script');
      jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
      jqueryScript.onload = () => {
        loadTurnLibrary();
      };
      document.head.appendChild(jqueryScript);
    } else {
      loadTurnLibrary();
    }
  };

  const loadTurnLibrary = () => {
    // Load turn.js library
    const turnScript = document.createElement('script');
    turnScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/turn.js/3/turn.min.js';
    turnScript.onload = () => {
      console.log('Turn.js loaded');
    };
    document.head.appendChild(turnScript);

    // Load turn.js CSS
    const turnCSS = document.createElement('link');
    turnCSS.rel = 'stylesheet';
    turnCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/turn.js/3/css/jquery.ui.css';
    document.head.appendChild(turnCSS);
  };

  const convertPDFToImages = async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      // Wait for PDF.js to be available
      const pdfjsLib = await waitForPDFJS();
      
      pdfjsLib.GlobalWorkerOptions.workerSrc = 
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;
      
      setTotalPages(pdf.numPages);
      
      // Convert each page to an image
      const images: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        if (context) {
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;
          
          images.push(canvas.toDataURL('image/jpeg', 0.9));
        }
      }
      
      setPageImages(images);
      setLoading(false);
      
      // Initialize turn.js after images are loaded
      setTimeout(() => initializeTurnJS(images.length), 100);
      
    } catch (err: any) {
      console.error('Error converting PDF:', err);
      setError(err.message || 'Failed to load PDF');
      setLoading(false);
    }
  };

  const waitForPDFJS = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      const checkPDFJS = () => {
        if ((window as any)['pdfjs-dist/build/pdf']) {
          resolve((window as any)['pdfjs-dist/build/pdf']);
        } else {
          // Load PDF.js if not available
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          script.onload = () => {
            setTimeout(() => {
              if ((window as any)['pdfjs-dist/build/pdf']) {
                resolve((window as any)['pdfjs-dist/build/pdf']);
              } else {
                reject(new Error('Failed to load PDF.js'));
              }
            }, 100);
          };
          script.onerror = () => reject(new Error('Failed to load PDF.js'));
          document.head.appendChild(script);
        }
      };
      checkPDFJS();
    });
  };

  const initializeTurnJS = (numPages: number) => {
    const $ = (window as any).jQuery;
    if (!$ || !flipbookRef.current) return;

    const $flipbook = $(flipbookRef.current);

    // Initialize turn.js
    $flipbook.turn({
      width: 1400,
      height: 900,
      autoCenter: true,
      elevation: 50,
      gradients: true,
      acceleration: true,
      pages: numPages,
      when: {
        turning: function(_event: any, page: number) {
          setCurrentPage(page);
        },
        turned: function(_event: any, page: number) {
          setCurrentPage(page);
        }
      }
    });

    turnInstanceRef.current = $flipbook;

    // Add pages dynamically
    for (let i = 0; i < numPages; i++) {
      $flipbook.turn('addPage', $('<div class="page-content"><img src="' + pageImages[i] + '" /></div>'), i + 1);
    }
  };

  const nextPage = () => {
    const $ = (window as any).jQuery;
    if ($ && turnInstanceRef.current) {
      $(turnInstanceRef.current).turn('next');
    }
  };

  const prevPage = () => {
    const $ = (window as any).jQuery;
    if ($ && turnInstanceRef.current) {
      $(turnInstanceRef.current).turn('previous');
    }
  };


  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === 'Escape' && onClose) onClose();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="text-white text-2xl mb-4">Converting PDF to flipbook...</div>
          <div className="text-white/60">This may take a moment</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="text-red-400 text-2xl mb-4">Error loading PDF</div>
          <div className="text-white/60">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4 relative">
      {/* Controls */}
      <div className="mb-4 flex gap-4 items-center bg-white/10 backdrop-blur-sm rounded-lg p-4 z-10">
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            title="Close"
          >
            <X className="text-white" size={20} />
          </button>
        )}
        <div className="text-white">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Flipbook Container */}
      <div className="relative">
        <div 
          ref={flipbookRef} 
          id="flipbook"
          className="shadow-2xl"
        />

        {/* Navigation Buttons */}
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 p-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-colors shadow-lg"
          aria-label="Previous page"
        >
          <ChevronLeft className="text-white" size={32} />
        </button>

        <button
          onClick={nextPage}
          disabled={currentPage >= totalPages}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 p-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-colors shadow-lg"
          aria-label="Next page"
        >
          <ChevronRight className="text-white" size={32} />
        </button>
      </div>

      <style>{`
        .page-content {
          width: 100%;
          height: 100%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .page-content img {
          max-width: 100%;
          max-height: 100%;
          display: block;
        }

        #flipbook {
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        }

        #flipbook .page {
          background-color: white;
        }

        /* Turn.js page flip effects */
        #flipbook .even {
          background: linear-gradient(to left, rgba(0,0,0,0.1) 0%, transparent 10%);
        }

        #flipbook .odd {
          background: linear-gradient(to right, rgba(0,0,0,0.1) 0%, transparent 10%);
        }
      `}</style>
    </div>
  );
}