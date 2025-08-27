import { useEffect } from 'react';

// Componente simples para AdSense Auto Ads
export const AutoAd = ({ className = '' }: { className?: string }) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('Erro ao carregar anúncio:', err);
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6720862201860122"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

// Componente para Display Ads (sem slot específico)
export const DisplayAd = ({ 
  width = 300, 
  height = 250, 
  className = '' 
}: { 
  width?: number; 
  height?: number; 
  className?: string; 
}) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('Erro ao carregar anúncio:', err);
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ 
          display: 'inline-block',
          width: `${width}px`,
          height: `${height}px`
        }}
        data-ad-client="ca-pub-6720862201860122"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
