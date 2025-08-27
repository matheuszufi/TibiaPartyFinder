import { useEffect, useState, useRef } from 'react';

// Componente simples para AdSense Auto Ads
export const AutoAd = ({ className = '' }: { className?: string }) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        // Verificar se o container tem dimensões válidas
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            setAdLoaded(true);
          } else {
            console.warn('Container do anúncio sem dimensões válidas');
            setAdError(true);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar anúncio:', err);
        setAdError(true);
      }
    }, 2000); // Aumentar delay para garantir renderização

    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className={`min-w-[300px] min-h-[250px] ${className}`}>
      {(!adLoaded && !adError) && (
        <div className="w-full h-64 bg-gray-100 border border-gray-300 rounded-lg p-8 text-center flex items-center justify-center">
          <div className="text-gray-500 text-sm">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-bold">AD</span>
            </div>
            <div className="animate-pulse">
              <p>Carregando anúncio...</p>
              <p className="text-xs mt-1">Publicidade</p>
            </div>
          </div>
        </div>
      )}
      
      {adError && (
        <div className="w-full h-64 bg-gray-50 border border-gray-200 rounded-lg p-8 text-center flex items-center justify-center">
          <div className="text-gray-400 text-sm">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500 font-bold">AD</span>
            </div>
            <p>Espaço publicitário</p>
            <p className="text-xs mt-1">Anúncios em breve</p>
          </div>
        </div>
      )}
      
      <ins
        className="adsbygoogle"
        style={{ 
          display: adLoaded ? 'block' : 'none',
          minWidth: '300px',
          minHeight: '250px'
        }}
        data-ad-client="ca-pub-6720862201860122"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

// Componente para Display Ads com dimensões fixas
export const DisplayAd = ({ 
  width = 300, 
  height = 250, 
  className = '' 
}: { 
  width?: number; 
  height?: number; 
  className?: string; 
}) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        // Verificar se o container tem dimensões válidas
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          if (rect.width >= width && rect.height >= height) {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            setAdLoaded(true);
          } else {
            console.warn(`Container do anúncio muito pequeno: ${rect.width}x${rect.height}, necessário: ${width}x${height}`);
            setAdError(true);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar anúncio:', err);
        setAdError(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [width, height]);

  return (
    <div 
      ref={containerRef}
      className={className}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        minWidth: `${width}px`,
        minHeight: `${height}px`
      }}
    >
      {(!adLoaded && !adError) && (
        <div 
          className="bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center"
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <div className="text-gray-500 text-center">
            <div className="w-10 h-10 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-bold text-sm">AD</span>
            </div>
            <div className="animate-pulse">
              <p className="text-sm">Carregando</p>
              <p className="text-xs">Publicidade</p>
            </div>
          </div>
        </div>
      )}
      
      {adError && (
        <div 
          className="bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center"
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <div className="text-gray-400 text-center">
            <div className="w-10 h-10 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500 font-bold text-sm">AD</span>
            </div>
            <p className="text-sm">Espaço publicitário</p>
            <p className="text-xs">Anúncios em breve</p>
          </div>
        </div>
      )}
      
      <ins
        className="adsbygoogle"
        style={{ 
          display: adLoaded ? 'inline-block' : 'none',
          width: `${width}px`,
          height: `${height}px`
        }}
        data-ad-client="ca-pub-6720862201860122"
        data-ad-format="rectangle"
        data-ad-layout="in-article"
      />
    </div>
  );
};
