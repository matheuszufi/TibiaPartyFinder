# 🔍 Guia de Verificação ads.txt

## ✅ Verificações Implementadas

### 1. **Arquivo ads.txt na pasta public/**
- ✅ Existe: `public/ads.txt`
- ✅ Conteúdo: `google.com, pub-6720862201860122, DIRECT, f08c47fec0942fa0`

### 2. **Arquivo ads.txt na raiz/**
- ✅ Existe: `ads.txt`
- ✅ Mesmo conteúdo para backup

### 3. **API Route de Backup**
- ✅ Existe: `api/ads.txt.js`
- ✅ Serve o ads.txt via API

### 4. **Configuração Vercel**
```json
{
  "rewrites": [
    {
      "source": "/ads.txt",
      "destination": "/ads.txt"
    }
  ],
  "headers": [
    {
      "source": "/ads.txt",
      "headers": [
        {
          "key": "Content-Type",
          "value": "text/plain; charset=utf-8"
        }
      ]
    }
  ]
}
```

### 5. **Arquivo _redirects (Netlify backup)**
- ✅ Existe: `public/_redirects`
- ✅ Configuração: `/ads.txt /ads.txt 200`

## 🧪 Como Testar

### 1. **Teste Local**
```bash
npm run build
# Verificar se dist/ads.txt existe
cat dist/ads.txt
```

### 2. **Teste de Produção**
Aguardar 5-10 minutos após deploy e testar:
- 🌐 https://tibia-party-finder.vercel.app/ads.txt
- 📝 Deve mostrar: `google.com, pub-6720862201860122, DIRECT, f08c47fec0942fa0`

### 3. **Verificação no Google AdSense**
- 📋 Console AdSense → Sites → Verificar ads.txt
- ⏱️ Pode levar 24-48 horas para atualizar

## 🚨 Troubleshooting

### Se ainda não funcionar:
1. **Verificar headers HTTP**:
   - Content-Type: `text/plain; charset=utf-8`
   - Status: `200 OK`

2. **Verificar se há cache**:
   - Aguardar algumas horas
   - Testar em navegador anônimo

3. **Verificar domínio**:
   - Certificar que está usando o domínio correto no AdSense
   - Verificar se não há redirecionamentos

## 📊 Status Atual

- ✅ Arquivo ads.txt criado em múltiplos locais
- ✅ Configuração Vercel atualizada
- ✅ API de backup configurada
- ✅ Deploy realizado
- ⏳ Aguardando propagação (5-10 minutos)

**Próximo passo**: Testar https://tibia-party-finder.vercel.app/ads.txt após 10 minutos
