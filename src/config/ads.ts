// Configurações de diferentes redes de publicidade

export const AdConfig = {
  // Google AdSense
  adsense: {
    publisherId: 'ca-pub-6720862201860122', // Seu Publisher ID
    adSlots: {
      homepage_banner: '1234567890',
      homepage_footer: '0987654321',
      dashboard_header: '1122334455', // Novo slot para dashboard header
      dashboard_sidebar: '5566778899',
      content_top: '9988776655',
      content_bottom: '1357924680'
    }
  },

  // Media.net (alternativa ao AdSense)
  mediaNet: {
    siteId: 'XXXXXXX',
    adSlots: {
      banner: 'XXXXXXX',
      sidebar: 'XXXXXXX'
    }
  },

  // PropellerAds
  propellerAds: {
    publisherId: 'XXXXXXX'
  }
};

// Configurações de posicionamento
export const AdPlacements = {
  homepage: ['homepage_banner', 'homepage_footer'],
  dashboard: ['dashboard_sidebar', 'content_top'],
  profile: ['content_bottom'],
  rooms: ['content_top', 'content_bottom']
};

// Função para verificar se ads devem ser exibidos
export const shouldShowAds = (userProfile: any) => {
  // Não mostrar anúncios para usuários premium
  if (userProfile?.isPremium) {
    return false;
  }
  
  // Outras regras de negócio
  return true;
};
