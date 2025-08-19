# Sistema de Provas ROTA - GTA RP

Sistema de criação e gerenciamento de provas para recrutamento da ROTA no GTA RP da Capital Valley Norte.

## 🚀 Funcionalidades

- ✅ Geração de provas com questões aleatórias ou manuais
- ✅ Sistema de avaliação com pontuação automática
- ✅ Armazenamento em nuvem (Vercel Blob Storage)
- ✅ Compartilhamento de provas entre todos os usuários
- ✅ Exportação de resultados em PDF e planilha
- ✅ Interface responsiva para desktop e mobile

## 🛠️ Configuração do Vercel Blob Storage

### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

### 2. Fazer login no Vercel
```bash
vercel login
```

### 3. Criar projeto no Vercel
```bash
vercel
```

### 4. Configurar Blob Storage
1. Acesse o dashboard do Vercel
2. Vá para a seção "Storage"
3. Clique em "Create" no Blob
4. Configure o nome do store (ex: "rota-provas")
5. Copie as variáveis de ambiente fornecidas

### 5. Configurar Variáveis de Ambiente
No dashboard do Vercel, vá em Settings > Environment Variables e adicione:

```
BLOB_READ_WRITE_TOKEN=seu_token_aqui
```

### 6. Fazer Deploy
```bash
vercel --prod
```

## 📁 Estrutura do Projeto

```
prova-rota/
├── api/
│   └── provas.js          # API serverless para gerenciar provas
├── imgs/
│   └── logo-rota.svg      # Logo da ROTA
├── index.html             # Página principal
├── script.js              # Lógica da aplicação
├── styles.css             # Estilos CSS
├── package.json           # Dependências
├── vercel.json            # Configuração do Vercel
└── README.md              # Este arquivo
```

## 🔧 Como Funciona

### Armazenamento Local vs Nuvem
- **Antes**: As provas eram salvas apenas no localStorage do navegador
- **Agora**: As provas são salvas no Vercel Blob Storage e compartilhadas entre todos os usuários

### API Endpoints
- `GET /api/provas` - Buscar todas as provas
- `POST /api/provas` - Criar/atualizar uma prova
- `DELETE /api/provas?id=X` - Deletar uma prova

### Sincronização
- As provas são carregadas automaticamente ao abrir a tela
- Botão "Sincronizar" para atualização manual
- Todas as operações (criar, editar, deletar) são sincronizadas em tempo real

## 🎯 Benefícios da Implementação

1. **Compartilhamento Global**: Todas as provas são visíveis para todos os usuários
2. **Persistência**: Dados não são perdidos ao limpar cache do navegador
3. **Escalabilidade**: Sistema pode suportar muitos usuários simultâneos
4. **Backup Automático**: Dados são automaticamente backupados pelo Vercel
5. **Performance**: Carregamento rápido com CDN global

## 🔐 Credenciais de Acesso

- **Usuário**: `rotaadm`
- **Senha**: `r0t4@1970`

## 📱 Compatibilidade

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Mobile (iOS Safari, Chrome Mobile)
- ✅ Tablet (iPad, Android)

## 🚀 Deploy

O projeto está configurado para deploy automático no Vercel. Após configurar o Blob Storage, basta fazer push para o repositório ou usar:

```bash
vercel --prod
```

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com o desenvolvedor: Fredi Baixada ❤️

---

**Nota**: Este sistema é apenas para GTA RP, não é um sistema oficial da ROTA.
