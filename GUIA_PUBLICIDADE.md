# 🚀 Guia Completo para Adicionar Publicidade ao Site

## 📋 Plataformas de Publicidade Recomendadas

### 1. **Google AdSense** (⭐ Mais Popular)
- **Vantagens**: Altos CPMs, fácil implementação, suporte global
- **Requisitos**: Site com conteúdo original, tráfego orgânico
- **CPM**: $1-5 USD (varia por nicho e localização)

### 2. **Media.net**
- **Vantagens**: Alternativa ao AdSense, bons para sites em inglês
- **Requisitos**: Tráfego principalmente dos EUA/Reino Unido
- **CPM**: $0.5-3 USD

### 3. **PropellerAds**
- **Vantagens**: Aceita sites menores, vários formatos
- **Requisitos**: Mínimos
- **CPM**: $0.1-1 USD

### 4. **Carbon Ads** (Para sites de tecnologia)
- **Vantagens**: Anúncios de alta qualidade, discretos
- **Requisitos**: Site relacionado a tecnologia/desenvolvimento
- **CPM**: $2-8 USD

## 🛠️ Como Implementar (Google AdSense)

### Passo 1: Cadastro
1. Acesse https://www.google.com/adsense/
2. Cadastre-se com sua conta Google
3. Adicione seu site
4. Aguarde aprovação (pode levar dias/semanas)

### Passo 2: Configuração no Código
O código já está pronto no seu projeto:

\`\`\`tsx
// Componente já criado em /components/AdBanner.tsx
import { ResponsiveAd, BannerAd, SquareAd } from '../components/AdBanner';

// Uso nos componentes
<ResponsiveAd adSlot="SEU_AD_SLOT_ID" />
\`\`\`

### Passo 3: Posicionamento Estratégico
- **Acima do conteúdo principal** (Above the fold)
- **Entre seções de conteúdo**
- **Sidebar** (para anúncios quadrados)
- **Footer**
- **Páginas com mais tráfego**

## 💰 Estimativa de Receita

### Fatores que Influenciam:
- **Tráfego**: Visitantes únicos por dia
- **Nicho**: Gaming/Tibia tem CPM médio
- **Localização**: Brasil tem CPM mais baixo que EUA/Europa
- **Engajamento**: Taxa de cliques (CTR)

### Cálculo Aproximado:
\`\`\`
Receita Mensal = (Pageviews × CTR × CPC) × 30 dias

Exemplo para site de Tibia:
- 10.000 pageviews/dia
- CTR: 1% (100 cliques/dia)
- CPC: $0.20 (Brasil)
- Receita diária: $20
- Receita mensal: $600
\`\`\`

## 📍 Melhores Posições para Anúncios

### 1. **Homepage**
- Banner no topo (após header)
- Anúncio responsivo entre seções
- Footer banner

### 2. **Dashboard**
- Sidebar com anúncios quadrados
- Banner entre lista de salas

### 3. **Páginas de Conteúdo**
- Anúncio no início do conteúdo
- Anúncio no meio do conteúdo
- Anúncio no final

## ⚠️ Boas Práticas

### ✅ DO's:
- Mantenha anúncios discretos e relevantes
- Use no máximo 3 anúncios por página
- Respeite a experiência do usuário
- Teste diferentes posições
- Use anúncios responsivos

### ❌ DON'Ts:
- Não force cliques em anúncios
- Não use muitos anúncios pop-up
- Não coloque anúncios sobre conteúdo importante
- Não viole políticas das plataformas

## 🎯 Implementação no Seu Site

### 1. Substitua os IDs de exemplo:
\`\`\`typescript
// Em /config/ads.ts
publisherId: 'ca-pub-SEU_PUBLISHER_ID_AQUI',
adSlots: {
  homepage_banner: 'SEU_AD_SLOT_ID_AQUI',
  // ...outros slots
}
\`\`\`

### 2. Adicione anúncios onde desejar:
\`\`\`tsx
// Exemplo na sua HomePage
import { ResponsiveAd } from '../components/AdBanner';

// No JSX
<ResponsiveAd adSlot="1234567890" className="my-4" />
\`\`\`

### 3. Configure para usuários premium:
\`\`\`tsx
// Só mostra anúncios para usuários não-premium
{!userProfile?.isPremium && (
  <ResponsiveAd adSlot="1234567890" />
)}
\`\`\`

## 📊 Monitoramento e Otimização

### Métricas Importantes:
- **CTR** (Click Through Rate): 1-3% é bom
- **CPC** (Cost Per Click): Varia por região
- **RPM** (Revenue Per Mille): Receita por 1000 visualizações
- **Viewability**: % de anúncios realmente vistos

### Ferramentas:
- Google Analytics
- Google AdSense Dashboard
- Heatmaps (Hotjar, Crazy Egg)

## 🚀 Próximos Passos

1. **Aplique para Google AdSense**
2. **Implemente os componentes criados**
3. **Teste diferentes posições**
4. **Monitore performance**
5. **Otimize baseado nos dados**
6. **Considere outras redes após ter tráfego estabelecido**

---

**Dica Extra**: Para sites de gaming como o seu (Tibia), considere também parcerias diretas com:
- Servidores privados de Tibia
- Lojas de gold/items
- Ferramentas/websites relacionados ao jogo
