import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

declare global {
  interface Window {
    jQuery: any;
    $: any;
  }
}

interface TurnJSFlipBookProps {
  pageImages: string[];
  onClose?: () => void;
}

export default function TurnJSFlipBook({ pageImages, onClose }: TurnJSFlipBookProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const flipbookRef = useRef<HTMLDivElement>(null);
  const turnInstanceRef = useRef<any>(null);
  const [jqueryLoaded, setJqueryLoaded] = useState(false);
  const [turnLoaded, setTurnLoaded] = useState(false);

  useEffect(() => {
    console.log('Props received:', { pageImagesLength: pageImages.length });
    setTotalPages(pageImages.length);
    if (pageImages.length === 0) {
      setLoading(false);
      setError('No pages provided to the flipbook.');
      return;
    }
    loadLibraries();
  }, []);

  useEffect(() => {
    if (jqueryLoaded && turnLoaded && pageImages.length > 0 && flipbookRef.current && !loading) {
      console.log('Dependencies met, scheduling init...');
      console.log('Flipbook ref available:', !!flipbookRef.current);
      initializeTurnJS();
    }
  }, [jqueryLoaded, turnLoaded, pageImages, loading]);

  const loadLibraries = async () => {
    try {
      // Load jQuery first (compatible version: 1.12.4)
      if (!window.jQuery) {
        console.log('Loading jQuery 1.12.4...');
        await loadScript('https://code.jquery.com/jquery-1.12.4.min.js');
        // Expose as global $ for plugins
        window.$ = window.jQuery;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      if (!window.jQuery) {
        throw new Error('jQuery failed to load');
      }
      
      console.log('jQuery loaded and globalized');
      setJqueryLoaded(true);

      // Load Turn.js
      console.log('Loading Turn.js...');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/turn.js/3/turn.min.js');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('Turn.js script loaded');
      setTurnLoaded(true);
      
      // Set loading false HERE to render the flipbook div and attach ref
      setLoading(false);
    } catch (err) {
      console.error('Error loading libraries:', err);
      setError('Failed to load required libraries.');
      setLoading(false);
    }
  };

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        if (src.includes('jquery') && window.jQuery) resolve();
        if (src.includes('turn') && window.jQuery && (window.jQuery as any).fn.turn) resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      
      script.onload = () => {
        console.log(`Loaded: ${src}`);
        resolve();
      };
      
      script.onerror = () => {
        console.error(`Failed to load: ${src}`);
        reject(new Error(`Failed to load ${src}`));
      };
      
      document.head.appendChild(script);
    });
  };

  const initializeTurnJS = () => {
    console.log('Initializing Turn.js...');
    if (!window.jQuery || !flipbookRef.current) {
      console.error('jQuery or flipbook ref not available');
      setError('Initialization prerequisites not met.');
      return;
    }

    const $ = window.jQuery;
    const $flipbook = $(flipbookRef.current);

    // Poll for Turn.js readiness (up to 5s)
    let attempts = 0;
    const maxAttempts = 50; // 100ms * 50 = 5s
    const pollInterval = setInterval(() => {
      attempts++;
      console.log(`Polling for $.fn.turn... Attempt ${attempts}`);
      
      if ($.fn.turn) {
        clearInterval(pollInterval);
        console.log('$.fn.turn available! Proceeding with init.');
        performInitialization();
        return;
      }
      
      if (attempts >= maxAttempts) {
        clearInterval(pollInterval);
        console.error('Turn.js failed to initialize after polling (jQuery compatibility issue?).');
        setError('Turn.js library failed to initialize. Try refreshing or check browser compatibility.');
      }
    }, 100);

    const performInitialization = () => {
      // Clear existing
      if (turnInstanceRef.current) {
        try {
          $flipbook.turn('destroy');
        } catch (e) {
          console.log('No existing instance');
        }
      }
      $flipbook.empty();

      // Add pages
      pageImages.forEach((imageUrl, index) => {
        const pageDiv = $(`
          <div class="page-wrapper">
            <div class="page-content">
              <img src="${imageUrl}" alt="Page ${index + 1}" onload="console.log('Page ${index + 1} loaded')" />
            </div>
          </div>
        `);
        $flipbook.append(pageDiv);
      });

      // Dimensions
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const maxWidth = Math.min(1400, windowWidth - 200);
      const maxHeight = windowHeight - 200;
      
      try {
        $flipbook.turn({
          width: maxWidth,
          height: maxHeight,
          autoCenter: true,
          elevation: 50,
          gradients: true,
          acceleration: true,
          pages: pageImages.length,
          when: {
            turning: function(_event: any, page: number, _view: any) {
              setCurrentPage(page);
            },
            turned: function(_event: any, page: number, _view: any) {
              setCurrentPage(page);
            }
          }
        });

        turnInstanceRef.current = $flipbook;
        setError(null);
        console.log('Turn.js initialized successfully!');

      } catch (err: any) {
        console.error('Turn.js init error:', err);
        setError(err.message || 'Failed to initialize flipbook');
      }
    };
  };

  // Dedicated resize effect (fixes leak)
  useEffect(() => {
    if (!turnInstanceRef.current) return;
    const handleResize = () => {
      const $flipbook = turnInstanceRef.current;
      if (!$flipbook || !$flipbook.turn) return;
      const newWidth = Math.min(1400, window.innerWidth - 200);
      const newHeight = window.innerHeight - 200;
      $flipbook.turn('size', newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [turnInstanceRef.current]);

  const nextPage = useCallback(() => {
    turnInstanceRef.current?.turn('next');
  }, []);

  const prevPage = useCallback(() => {
    turnInstanceRef.current?.turn('previous');
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === 'Escape' && onClose) onClose();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextPage, prevPage, onClose]);

  // Always render the content for ref attachment; overlay states on top
  return (
    <>
      <TheFlipbookContent 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onClose={onClose} 
        flipbookRef={flipbookRef}
        nextPage={nextPage} 
        prevPage={prevPage} 
      />
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 z-50">
          <div className="text-center">
            <div className="text-white text-2xl mb-2">Loading flipbook...</div>
            <div className="text-white/60 text-sm">Initializing turn.js library</div>
          </div>
        </div>
      )}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 z-50">
          <div className="text-center max-w-md">
            <div className="text-red-400 text-2xl mb-4">Failed to load flipbook</div>
            <div className="text-white/80 text-sm mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Retry
            </button>
            <div className="text-white/60 text-xs mt-2">
              Check console for details
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Extracted component for the flipbook content
function TheFlipbookContent({ 
  currentPage, 
  totalPages, 
  onClose, 
  flipbookRef, 
  nextPage, 
  prevPage 
}: { 
  currentPage: number; 
  totalPages: number; 
  onClose?: () => void; 
  flipbookRef: React.RefObject<HTMLDivElement | null>; // Fixed: Allow null
  nextPage: () => void; 
  prevPage: () => void; 
}) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Controls */}
      <div className="mb-4 flex gap-4 items-center bg-white/10 backdrop-blur-sm rounded-lg p-4 z-20">
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            title="Close"
          >
            <X className="text-white" size={20} />
          </button>
        )}
        <div className="text-white font-medium">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Flipbook Container */}
      <div className="relative flex items-center justify-center">
        {/* Navigation Buttons */}
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-20 p-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-colors shadow-lg z-10"
          aria-label="Previous page"
        >
          <ChevronLeft className="text-white" size={32} />
        </button>

        <div 
          ref={flipbookRef} 
          id="magazine"
          className="shadow-2xl"
        />

        <button
          onClick={nextPage}
          disabled={currentPage >= totalPages}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-20 p-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-colors shadow-lg z-10"
          aria-label="Next page"
        >
          <ChevronRight className="text-white" size={32} />
        </button>
      </div>

      <style>{`
        .page-wrapper {
          background-color: white;
        }

        .page-content {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
        }

        .page-content img {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          display: block;
        }

        #magazine {
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
        }

        /* Turn.js enhancements */
        #magazine .even .page-content {
          background: linear-gradient(to left, rgba(0,0,0,0.05) 0%, transparent 5%);
        }

        #magazine .odd .page-content {
          background: linear-gradient(to right, rgba(0,0,0,0.05) 0%, transparent 5%);
        }

        /* Page turn effect */
        .turn-page {
          background-color: white;
        }

        /* Shadow for flipping pages */
        .turn-page-wrapper {
          background-color: white;
        }

        /* Hard shadow */
        .hard .even .page-content {
          box-shadow: inset -7px 0 30px -7px rgba(0,0,0,0.4);
        }

        .hard .odd .page-content {
          box-shadow: inset 7px 0 30px -7px rgba(0,0,0,0.4);
        }

        /* Magazine-style spine */
        .magazine-spine {
          position: absolute;
          width: 10px;
          height: 100%;
          background: linear-gradient(to right, 
            rgba(0,0,0,0.1) 0%, 
            rgba(0,0,0,0.05) 50%, 
            transparent 100%);
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}