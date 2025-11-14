import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

// Type definitions for PDF.js
interface PDFPageProxy {
  getViewport: (params: { scale: number }) => {
    width: number;
    height: number;
  };
  render: (params: any) => { promise: Promise<void> };
}


interface FlipbookPageProps {
  pdfUrl?: string;
}

const FlipbookPage = ({ pdfUrl }: FlipbookPageProps) => {
  const [pages, setPages] = useState<PDFPageProxy[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pdfLibLoaded, setPdfLibLoaded] = useState(false);
  const canvasRefs = useRef<{ [key: number]: HTMLCanvasElement | null }>({});
  const renderingRef = useRef<{ [key: number]: boolean }>({});

  // Load PDF.js library
  useEffect(() => {
    const loadPdfLib = async () => {
      // Check if already loaded
      if ((window as any)['pdfjs-dist/build/pdf']) {
        setPdfLibLoaded(true);
        return;
      }

      // Load PDF.js library
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.async = true;
      
      script.onload = () => {
        setPdfLibLoaded(true);
      };

      script.onerror = () => {
        console.error('Failed to load PDF.js library');
      };

      document.head.appendChild(script);
    };

    loadPdfLib();
  }, []);

  // Load PDF and render pages
  const loadPDF = async (url: string) => {
    if (!url) return;
    
    // Wait for PDF.js library to load
    if (!pdfLibLoaded) {
      console.log('Waiting for PDF.js library to load...');
      setTimeout(() => loadPDF(url), 100);
      return;
    }
    
    setLoading(true);
    try {
      const pdfjsLib = (window as any)['pdfjs-dist/build/pdf'];
      if (!pdfjsLib) {
        throw new Error('PDF.js library not loaded');
      }
      
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      
      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;
      
      const pagePromises: Promise<PDFPageProxy>[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        pagePromises.push(pdf.getPage(i));
      }
      
      const pdfPages = await Promise.all(pagePromises);
      setPages(pdfPages);
    } catch (error) {
      console.error('Error loading PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load PDF when pdfUrl prop changes
  useEffect(() => {
    if (pdfUrl) {
      loadPDF(pdfUrl);
    }
  }, [pdfUrl]);

  // Render a specific page to canvas
  const renderPage = useCallback(async (pageNum: number, canvas: HTMLCanvasElement | null) => {
    if (!canvas || !pages[pageNum]) return;
    
    // Prevent rendering if already rendering this page
    if (renderingRef.current[pageNum]) {
      return;
    }
    
    renderingRef.current[pageNum] = true;
    
    try {
      const page = pages[pageNum];
      const viewport = page.getViewport({ scale: 1.5 * zoom });
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      const context = canvas.getContext('2d');
      if (!context) return;
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
    } catch (error) {
      console.error('Error rendering page:', error);
    } finally {
      renderingRef.current[pageNum] = false;
    }
  }, [pages, zoom]);

  // Re-render visible pages when zoom changes or page changes
  useEffect(() => {
    if (pages.length > 0) {
      const leftCanvas = canvasRefs.current[currentPage];
      const rightCanvas = canvasRefs.current[currentPage + 1];
      
      if (leftCanvas) {
        renderPage(currentPage, leftCanvas);
      }
      if (currentPage + 1 < pages.length && rightCanvas) {
        renderPage(currentPage + 1, rightCanvas);
      }
    }
  }, [zoom, pages, currentPage, renderPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextPage();
      } else if (e.key === 'ArrowLeft') {
        prevPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, pages.length, isFlipping]);

  // Remove the old useEffect that rendered all pages
  // We only render visible pages now

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const fileUrl = URL.createObjectURL(file);
      loadPDF(fileUrl);
    }
  };

  const nextPage = () => {
    console.log('Next page clicked', { currentPage, totalPages: pages.length, isFlipping });
    if (currentPage < pages.length - 2 && !isFlipping) {
      setIsFlipping(true);
      setCurrentPage(prev => {
        const newPage = prev + 2;
        console.log('Moving to page:', newPage);
        return newPage;
      });
      setTimeout(() => setIsFlipping(false), 700);
    }
  };

  const prevPage = () => {
    console.log('Previous page clicked', { currentPage, totalPages: pages.length, isFlipping });
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setCurrentPage(prev => {
        const newPage = Math.max(0, prev - 2);
        console.log('Moving to page:', newPage);
        return newPage;
      });
      setTimeout(() => setIsFlipping(false), 700);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.6));

  if (pages.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="bg-white rounded-lg shadow-2xl p-12 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">PDF Flipbook</h2>
          <p className="text-slate-600 mb-6">Upload a PDF to create an interactive flipbook experience</p>
          <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg inline-block transition-colors">
            Choose PDF File
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-white text-2xl">Loading PDF...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4">
      {/* Controls */}
      <div className="mb-4 flex gap-4 items-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
        <button
          onClick={handleZoomOut}
          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="text-white" size={20} />
        </button>
        <span className="text-white font-semibold">{Math.round(zoom * 100)}%</span>
        <button
          onClick={handleZoomIn}
          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="text-white" size={20} />
        </button>
        <div className="ml-4 text-white">
          Page {currentPage + 1}-{Math.min(currentPage + 2, pages.length)} of {pages.length}
        </div>
      </div>

      {/* Flipbook */}
      <div className="relative" style={{ perspective: '2000px' }}>
        <div className="flex gap-1 bg-slate-700 p-4 rounded-lg shadow-2xl relative overflow-visible">
          {/* Left Page - Always visible */}
          <div className="relative bg-white shadow-lg">
            <canvas
              key={`page-${currentPage}`}
              ref={el => { canvasRefs.current[currentPage] = el; }}
              className="block"
            />
          </div>

          {/* Right Page - Can be flipped */}
          {currentPage + 1 < pages.length && (
            <div 
              className={`relative bg-white shadow-lg transition-all duration-700 ease-in-out ${
                isFlipping ? 'page-flip' : ''
              }`}
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'left center',
              }}
            >
              <canvas
                key={`page-${currentPage + 1}`}
                ref={el => { canvasRefs.current[currentPage + 1] = el; }}
                className="block"
              />
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevPage}
          disabled={currentPage === 0 || isFlipping}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 p-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-gray-500 rounded-full transition-colors shadow-lg z-10"
          aria-label="Previous page"
        >
          <ChevronLeft className="text-white" size={32} />
        </button>

        <button
          onClick={nextPage}
          disabled={currentPage >= pages.length - 2 || isFlipping}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 p-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-gray-500 rounded-full transition-colors shadow-lg z-10"
          aria-label="Next page"
        >
          <ChevronRight className="text-white" size={32} />
        </button>
      </div>

      {/* Upload New File Button */}
      <label className="mt-8 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
        Upload New PDF
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>

      <style>{`
        /* Realistic 3D page flip animation */
        @keyframes pageFlip {
          0% {
            transform: rotateY(0deg);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          50% {
            transform: rotateY(-90deg);
            box-shadow: -10px 4px 20px rgba(0, 0, 0, 0.3);
          }
          100% {
            transform: rotateY(-180deg);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
        }
        
        .page-flip {
          animation: pageFlip 0.7s ease-in-out forwards;
          transform-origin: left center;
        }
        
        /* Add depth and shadow to the book */
        .page-flip canvas {
          backface-visibility: hidden;
        }
      `}</style>

    </div>
  );
};

export default FlipbookPage;