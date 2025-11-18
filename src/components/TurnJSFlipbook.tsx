import { useState, useEffect, useRef, useCallback } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);
  const flipbookRef = useRef<HTMLDivElement>(null);
  const turnInstanceRef = useRef<any>(null);
  const [jqueryLoaded, setJqueryLoaded] = useState(false);
  const [turnLoaded, setTurnLoaded] = useState(false);

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    setTotalPages(pageImages.length);
    if (pageImages.length === 0) {
      setLoading(false);
      setError('No pages provided.');
      return;
    }
    loadLibraries();
  }, [pageImages]);

  // Initialize when everything is ready
  useEffect(() => {
    if (jqueryLoaded && turnLoaded && flipbookRef.current && !loading) {
      initializeTurnJS();
    }
  }, [jqueryLoaded, turnLoaded, loading, isMobile]);

  const loadLibraries = async () => {
    try {
      if (!window.jQuery) {
        await loadScript('https://code.jquery.com/jquery-1.12.4.min.js');
        window.$ = window.jQuery;
      }
      setJqueryLoaded(true);

      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/turn.js/3/turn.min.js');
      setTurnLoaded(true);
      setLoading(false); // renders the div → ref becomes available
    } catch (e) {
      console.error(e);
      setError('Failed to load libraries.');
      setLoading(false);
    }
  };

  const loadScript = (src: string): Promise<void> =>
    new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.head.appendChild(script);
    });

  const initializeTurnJS = () => {
    if (!window.jQuery || !flipbookRef.current) return;

    const $ = window.jQuery;
    const $flipbook = $(flipbookRef.current);

    const poll = setInterval(() => {
      if (!$.fn.turn) return;

      clearInterval(poll);

      if (turnInstanceRef.current) $flipbook.turn('destroy');
      $flipbook.empty();

      pageImages.forEach((url, i) => {
        $flipbook.append(`
          <div class="page-wrapper">
            <div class="page-content">
              <img src="${url}" alt="Page ${i + 1}" />
            </div>
          </div>
        `);
      });

      const w = window.innerWidth;
      const h = window.innerHeight;
      const width = isMobile ? w * 0.92 : Math.min(1400, w - 200);
      const height = isMobile ? h * 0.78 : h - 200;

      $flipbook.turn({
        width,
        height,
        autoCenter: true,
        display: isMobile ? 'single' : 'double',
        elevation: isMobile ? 15 : 50,
        gradients: !isMobile,
        acceleration: true,
        pages: pageImages.length,
        when: { turned: (_e: any, page: number) => setCurrentPage(page) },
      });

      turnInstanceRef.current = $flipbook;
    }, 100);

    setTimeout(() => clearInterval(poll), 5000);
  };

  // Resize / orientation handling
  useEffect(() => {
    if (!turnInstanceRef.current) return;
    const handler = () => {
      const newMobile = window.innerWidth < 768;
      if (newMobile !== isMobile) {
        setIsMobile(newMobile);
        initializeTurnJS(); // re-init to switch single/double
      } else {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const width = newMobile ? w * 0.92 : Math.min(1400, w - 200);
        const height = newMobile ? h * 0.78 : h - 200;
        turnInstanceRef.current.turn('size', width, height);
      }
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [isMobile]);

  const nextPage = useCallback(() => turnInstanceRef.current?.turn('next'), []);
  const prevPage = useCallback(() => turnInstanceRef.current?.turn('previous'), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nextPage, prevPage, onClose]);

  return (
    <>
      {/* Main UI */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 z-20">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
            {onClose && (
              <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
                <X size={20} />
              </button>
            )}
            <span className="text-white font-medium text-sm sm:text-base">
              Page {currentPage} / {totalPages}
            </span>
          </div>
        </div>

        {/* Flipbook */}
        <div className="flex-1 flex items-center justify-center relative px-4 pb-20 sm:pb-0">
          <div ref={flipbookRef} id="magazine" className="shadow-2xl" />

          {/* Mobile bottom buttons */}
          {isMobile && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-6 z-30">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-full p-4 shadow-xl transition"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={nextPage}
                disabled={currentPage >= totalPages}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-full p-4 shadow-xl transition"
              >
                <ChevronRight size={28} />
              </button>
            </div>
          )}

          {/* Desktop side buttons */}
          {!isMobile && (
            <>
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-full p-4 shadow-xl z-10 transition"
              >
                <ChevronLeft size={36} />
              </button>
              <button
                onClick={nextPage}
                disabled={currentPage >= totalPages}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-full p-4 shadow-xl z-10 transition"
              >
                <ChevronRight size={36} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="text-white text-2xl mb-2">Loading flipbook...</div>
            <div className="text-white/60 text-sm">Initializing turn.js</div>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center z-50">
          <div className="text-center max-w-md p-6">
            <div className="text-red-400 text-2xl mb-4">Failed to load</div>
            <div className="text-white/80 mb-6">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Global styles – plain <style> tag (no styled-jsx) */}
      <style>{`
        .page-wrapper { background: white; }
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
          object-fit: contain;
        }
        #magazine { box-shadow: 0 20px 60px rgba(0,0,0,0.6); }
        @media (max-width: 767px) {
          #magazine { box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .turn-page { touch-action: pan-y; }
        }
        #magazine .even .page-content { background: linear-gradient(to left, rgba(0,0,0,0.05) 0%, transparent 8%); }
        #magazine .odd .page-content { background: linear-gradient(to right, rgba(0,0,0,0.05) 0%, transparent 8%); }
        .hard .even .page-content { box-shadow: inset -7px 0 30px -7px rgba(0,0,0,0.4); }
        .hard .odd .page-content { box-shadow: inset 7px 0 30px -7px rgba(0,0,0,0.4); }
      `}</style>
    </>
  );
}