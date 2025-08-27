import { useEffect } from 'react';

interface AdBannerProps {
  adSlot?: string;
  adFormat?: string;
  style?: React.CSSProperties;
  className?: string;
}

export const AdBanner = ({ 
  adSlot, 
  adFormat = 'auto', 
  style = { display: 'block' },
  className = ''
}: AdBannerProps) => {
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
        style={style}
        data-ad-client="ca-pub-6720862201860122"
        {...(adSlot && { 'data-ad-slot': adSlot })}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
};

// Componente para anúncios responsivos (sem slot específico - mais seguro)
export const ResponsiveAd = ({ className = '' }: { className?: string }) => (
  <AdBanner
    style={{ display: 'block' }}
    className={className}
  />
);

// Componente para anúncios em banner
export const BannerAd = ({ className = '' }: { className?: string }) => (
  <AdBanner
    adFormat="banner"
    style={{ display: 'inline-block', width: '728px', height: '90px' }}
    className={className}
  />
);

// Componente para anúncios quadrados
export const SquareAd = ({ className = '' }: { className?: string }) => (
  <AdBanner
    style={{ display: 'inline-block', width: '300px', height: '250px' }}
    className={className}
  />
);
