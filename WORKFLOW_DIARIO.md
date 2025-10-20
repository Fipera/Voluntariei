# 🚀 GUIA COMPLETO - Workflow Diário

## ⚡ COMANDOS TODA VEZ QUE LIGAR O PC

### 1️⃣ Iniciar Backend + Ngrok

```bash
# Terminal 1: Backend
cd Backend
docker compose up -d    # Iniciar banco de dados
npm run dev             # Iniciar backend (porta 3000)

# Terminal 2: Ngrok (expor backend)
ngrok http 3000

# ⚠️ IMPORTANTE: Copie a URL gerada!
# Ex: https://abc-123-def.ngrok-free.app
```

### 2️⃣ Atualizar URL no Frontend (se mudou)

```bash
# Abra: Frontend/services/api.ts
# Mude a baseURL para a URL do ngrok:

const api = axios.create({
  baseURL: 'https://abc-123-def.ngrok-free.app', // ← Cole aqui
});
```

### 3️⃣ Fazer Novo Build (se mudou a URL)

```bash
cd Frontend
eas build --profile development --platform android

# Aguarde ~10-15 minutos
# Compartilhe o novo link!
```

---

## 🔄 COMANDOS QUANDO MODIFICAR CÓDIGO

### ✅ Modificações no **JavaScript/TypeScript** (Frontend):
**NÃO precisa fazer novo build!**

```bash
cd Frontend
npx expo start --dev-client

# No celular:
# 1. Abra o app Voluntariei
# 2. App conecta automaticamente
# 3. Hot reload funciona! 🔥
```

### ✅ Modificações no **Backend**:
**NÃO precisa fazer novo build!**

```bash
# O backend já reinicia automaticamente (ts-node-dev)
# Apenas salve o arquivo!
```

### ❌ Modificações em **Configurações Nativas** (Frontend):
**PRECISA fazer novo build!**

Exemplos:
- Mudou `app.config.js`
- Mudou `app.json`
- Instalou/removeu pacote nativo
- Mudou permissões Android/iOS
- **Mudou a URL da API (baseURL)**

```bash
cd Frontend
eas build --profile development --platform android
```

---

## 📋 RESUMO RÁPIDO

### Todo dia ao ligar o PC:
```bash
# Backend + Banco
cd Backend
docker compose up -d
npm run dev

# Ngrok (outro terminal)
ngrok http 3000
# Copie a URL gerada
```

### Se a URL do ngrok mudou:
```bash
# 1. Atualize Frontend/services/api.ts com nova URL
# 2. Novo build:
cd Frontend
eas build --profile development --platform android
```

### Para desenvolver (hot reload):
```bash
cd Frontend
npx expo start --dev-client
# Abra o app no celular
```

### Modificou código JS/TS:
- ✅ Apenas salve o arquivo
- ✅ Hot reload automático (se usou expo start)
- ❌ Não precisa novo build

### Modificou configuração nativa ou URL:
- ❌ Precisa novo build
```bash
eas build --profile development --platform android
```

---

## 💡 DICA: URL Fixa do Ngrok

Para **não precisar** mudar a URL toda vez:

### Opção 1: Ngrok Pago ($8/mês)
- URL fixa
- Sem limite de conexões
- Mais rápido

### Opção 2: Hospedar Backend (Grátis)
- Railway.app (recomendado)
- Render.com
- Fly.io

Com backend hospedado:
- URL nunca muda
- Não precisa rodar no seu PC
- Apenas faz o build 1 vez!

---

## 🎯 WORKFLOW IDEAL

### Setup Inicial (1x):
```bash
# 1. Hospedar backend ou usar ngrok pago
# 2. Configurar URL fixa no Frontend/services/api.ts
# 3. Fazer build:
eas build --profile development --platform android
# 4. Compartilhar link do APK
```

### Desenvolvimento Diário:
```bash
# Backend (se não hospedou)
cd Backend
npm run dev

# Frontend (desenvolvimento)
cd Frontend
npx expo start --dev-client
# Modifique código, hot reload funciona!
```

### Novo Build (apenas quando necessário):
- Mudou configuração nativa
- Mudou URL da API
- Adicionou/removeu pacote nativo
```bash
eas build --profile development --platform android
```

---

## ✅ CHECKLIST DIÁRIO

**Ao ligar o PC:**
- [ ] `docker compose up -d` (banco)
- [ ] `npm run dev` (backend)
- [ ] `ngrok http 3000` (expor)
- [ ] URL do ngrok mudou? → Atualizar código + novo build
- [ ] URL igual? → Pode usar o app normalmente!

**Ao desenvolver:**
- [ ] Modificou JS/TS? → Apenas salve (hot reload)
- [ ] Modificou nativo/URL? → Novo build
- [ ] Backend rodando? → Tudo funciona!

---

## 🆘 Problemas?

### "Cannot connect to backend"
- Backend rodando?
- Ngrok ativo?
- URL correta no código?

### "Build failed"
- Veja logs em: https://expo.dev
- Erro comum: sintaxe no app.config.js

### "Hot reload não funciona"
- Rode: `npx expo start --dev-client`
- Celular na mesma rede?
- Use `--tunnel` se não conectar

---

## 🎉 PRÓXIMOS COMANDOS (AGORA)

```bash
# Terminal 1
cd Backend
docker compose up -d
npm run dev

# Terminal 2
ngrok http 3000
# Copie a URL que aparecer!
```
