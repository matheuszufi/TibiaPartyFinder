# TibiaPartyFinder

Um sistema web para jogadores de Tibia encontrarem grupos para quests, bosses e hunts.

## 🚀 Tecnologias

- **React** com TypeScript
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes
- **Firebase** para autenticação e banco de dados
- **Tibia Data API** para informações de personagens e mundos

## 📋 Funcionalidades

### ✅ Implementadas
- Sistema de autenticação (login/registro)
- Dashboard com listagem de salas
- Modal para criação de salas com:
  - Busca de personagem via API do Tibia
  - Seleção de atividade (quest/boss/hunt)
  - Configuração de time (2-15 jogadores)
  - Seleção de vocações necessárias
- Filtros por tipo de atividade e mundo
- Design responsivo e moderno

### 🔄 Em desenvolvimento
- Integração completa com Firebase
- Sistema de solicitação de entrada em salas
- Chat em tempo real
- Notificações
- Sistema de avaliação de jogadores

## 🛠️ Configuração

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar Firebase
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Habilite Authentication (Email/Password)
3. Crie um banco Firestore
4. Copie as configurações do projeto
5. Substitua as configurações em `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-auth-domain",
  projectId: "seu-project-id",
  storageBucket: "seu-storage-bucket",
  messagingSenderId: "seu-messaging-sender-id",
  appId: "seu-app-id"
};
```

### 3. Executar o projeto
```bash
npm start
```

O projeto estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/           # Componentes shadcn/ui
│   └── CreateRoomModal.tsx
├── lib/
│   ├── firebase.ts   # Configuração Firebase
│   ├── tibia-api.ts  # Cliente da API do Tibia
│   └── utils.ts      # Utilidades
├── pages/
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── DashboardPage.tsx
├── types/
│   └── index.ts      # Tipos TypeScript
└── App.tsx
```

## 🎮 Como Usar

### Para Jogadores:
1. **Registre-se** com seu email
2. **Faça login** no sistema
3. **Explore** as salas disponíveis no dashboard
4. **Filtre** por tipo de atividade ou mundo
5. **Solicite entrada** em salas que interessam

### Para Criar Salas:
1. Clique em **"Criar Sala"** no dashboard
2. **Busque seu personagem** pelo nome (via API do Tibia)
3. **Selecione a atividade** (quest, boss ou hunt)
4. **Configure o time** (número de jogadores e vocações)
5. **Publique** a sala

## 🔗 API Externa

O projeto utiliza a [TibiaData API v4](https://tibiadata.com/) para:
- Buscar informações de personagens
- Obter lista de mundos
- Validar dados do Tibia

## 🎨 Design System

Utiliza o design system do **shadcn/ui** com:
- Paleta de cores azul/indigo
- Componentes acessíveis
- Tema claro/escuro (configurável)
- Animações suaves

## 📱 Responsividade

- ✅ Mobile First
- ✅ Tablet otimizado
- ✅ Desktop responsivo

## 🚀 Deploy

### Netlify/Vercel
```bash
npm run build
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase init hosting
npm run build
firebase deploy
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ⚠️ Disclaimer

Este é um projeto não oficial. Tibia é marca registrada da CipSoft GmbH.
