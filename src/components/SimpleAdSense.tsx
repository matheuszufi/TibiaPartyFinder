import { useEffect, useRef, useState } from 'react';

interface SimpleAdProps {
  width?: number;
  height?: number;
  className?: string;
}

export const SimpleAdSense = ({ 
  width = 300, 
  height = 250, 
  className = '' 
}: SimpleAdProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const adRef = useRef<HTMLModElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Aguardar o DOM estar completamente carregado
    const timer = setTimeout(() => {
      if (containerRef.current && adRef.current) {
        try {
          // Verificar se o container tem dimensões válidas
          const rect = containerRef.current.getBoundingClientRect();
          
          if (rect.width >= width && rect.height >= height && rect.width > 0) {
            console.log('Inicializando AdSense simples com dimensões:', `${rect.width}x${rect.height}`);
            
            // @ts-ignore - AdSense API
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            setIsLoaded(true);
          } else {
            console.warn('Container muito pequeno para AdSense:', `${rect.width}x${rect.height}`);
            setHasError(true);
          }
        } catch (error) {
          console.error('Erro ao inicializar AdSense:', error);
          setHasError(true);
        }
      }
    }, 3000); // 3 segundos de delay

    return () => clearTimeout(timer);
  }, [width, height]);

  if (hasError) {
    return (
      <div 
        ref={containerRef}
        className={`flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg ${className}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <div className="text-center text-gray-500">
          <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-bold text-sm">AD</span>
          </div>
          <p className="text-sm">Espaço Publicitário</p>
          <p className="text-xs mt-1">Em breve...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`${className}`}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        minWidth: `${width}px`,
        minHeight: `${height}px`,
        display: 'block',
        position: 'relative'
      }}
    >
      {!isLoaded && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg"
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <div className="text-center text-blue-600">
            <div className="w-12 h-12 mx-auto mb-2 bg-blue-200 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-blue-700 font-bold text-sm">AD</span>
            </div>
            <div className="animate-pulse">
              <div className="h-2 bg-blue-300 rounded w-16 mx-auto mb-2"></div>
              <div className="h-2 bg-blue-300 rounded w-12 mx-auto"></div>
            </div>
            <p className="text-xs mt-2">Carregando...</p>
          </div>
        </div>
      )}
      
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ 
          display: 'block',
          width: `${width}px`,
          height: `${height}px`,
          visibility: isLoaded ? 'visible' : 'hidden'
        }}
        data-ad-client="ca-pub-6720862201860122"
        data-ad-slot=""
        data-ad-format="auto"
        data-full-width-responsive="false"
      />
    </div>
  );
};
