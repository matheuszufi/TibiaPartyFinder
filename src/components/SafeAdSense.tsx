import { useEffect, useState, useRef } from 'react';

interface AdSenseProps {
  width?: number;
  height?: number;
  className?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
}

export const SafeAdSense = ({ 
  width = 300, 
  height = 250, 
  className = '',
  format = 'rectangle'
}: AdSenseProps) => {
  const [adState, setAdState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const containerRef = useRef<HTMLDivElement>(null);
  const adRef = useRef<HTMLModElement>(null);
  const [hasValidDimensions, setHasValidDimensions] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const checkDimensions = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const parentRect = containerRef.current.parentElement?.getBoundingClientRect();
      
      // Verificar se o elemento está visível e tem espaço
      const isVisible = rect.width > 0 && rect.height > 0;
      const hasParentSpace = parentRect ? parentRect.width >= width : true;
      const isValid = isVisible && rect.width >= width && rect.height >= height;
      
      if (!isValid) {
        console.warn(`Container AdSense inválido:`, {
          containerSize: `${rect.width}x${rect.height}`,
          required: `${width}x${height}`,
          parentSize: parentRect ? `${parentRect.width}x${parentRect.height}` : 'N/A',
          isVisible,
          hasParentSpace
        });
      }
      
      setHasValidDimensions(isValid);
      return isValid;
    }
    return false;
  };

  useEffect(() => {
    // Aguardar um tempo antes de verificar dimensões
    const initialTimer = setTimeout(() => {
      checkDimensions();
    }, 1000);

    // Observer para mudanças de tamanho
    const resizeObserver = new ResizeObserver(() => {
      checkDimensions();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(initialTimer);
      resizeObserver.disconnect();
    };
  }, [width, height]);

  useEffect(() => {
    if (!hasValidDimensions || retryCount >= 3) return;

    const timer = setTimeout(() => {
      try {
        if (adRef.current && containerRef.current) {
          // Verificar novamente as dimensões antes de carregar
          const rect = containerRef.current.getBoundingClientRect();
          if (rect.width >= width && rect.height >= height && rect.width > 0) {
            console.log('Carregando AdSense com dimensões:', `${rect.width}x${rect.height}`);
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            setAdState('loaded');
          } else {
            console.warn('Dimensões ainda inválidas, tentando novamente em 2s');
            setRetryCount(prev => prev + 1);
            setTimeout(() => setHasValidDimensions(checkDimensions()), 2000);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar anúncio AdSense:', err);
        setAdState('error');
      }
    }, 2000 + (retryCount * 1000)); // Delay progressivo

    return () => clearTimeout(timer);
  }, [hasValidDimensions, width, height, retryCount]);

  const getDataAdFormat = () => {
    switch (format) {
      case 'auto': return 'auto';
      case 'rectangle': return 'rectangle';
      case 'horizontal': return 'horizontal';
      case 'vertical': return 'vertical';
      default: return 'rectangle';
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`${className}`}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        minWidth: `${width}px`,
        minHeight: `${height}px`,
        maxWidth: `${width}px`,
        maxHeight: `${height}px`,
        overflow: 'hidden'
      }}
    >
      {/* Placeholder enquanto carrega */}
      {adState === 'loading' && (
        <div 
          className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg flex items-center justify-center shadow-sm"
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <div className="text-gray-500 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-300 rounded-full flex items-center justify-center shadow-inner">
              <span className="text-gray-600 font-bold">AD</span>
            </div>
            <div className="animate-pulse">
              <div className="h-2 bg-gray-300 rounded w-16 mx-auto mb-2"></div>
              <div className="h-2 bg-gray-300 rounded w-12 mx-auto"></div>
            </div>
            <p className="text-xs mt-2 text-gray-400">Carregando anúncio...</p>
          </div>
        </div>
      )}

      {/* Placeholder para erro */}
      {adState === 'error' && (
        <div 
          className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <div className="text-gray-400 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500 font-bold">AD</span>
            </div>
            <p className="text-sm">Espaço Publicitário</p>
            <p className="text-xs mt-1">Anúncios em breve</p>
          </div>
        </div>
      )}

      {/* AdSense */}
      {hasValidDimensions && (
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ 
            display: adState === 'loaded' ? 'inline-block' : 'none',
            width: `${width}px`,
            height: `${height}px`
          }}
          data-ad-client="ca-pub-6720862201860122"
          data-ad-format={getDataAdFormat()}
          data-ad-layout={format === 'auto' ? undefined : 'in-article'}
          data-full-width-responsive={format === 'auto' ? 'true' : 'false'}
        />
      )}
    </div>
  );
};
