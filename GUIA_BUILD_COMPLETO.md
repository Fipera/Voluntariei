# 🚀 GUIA RÁPIDO - BUILD PARA TESTES

## ✅ Banco de Dados - PRONTO!
- ✅ PostgreSQL rodando no Docker
- ✅ Banco zerado e populado com seed
- ✅ Migrations aplicadas

---

## 📱 PRÓXIMOS PASSOS - BUILD DO APP

### 1. Instalar EAS CLI (uma vez só)
```bash
npm install -g eas-cli
```

### 2. Login no Expo
```bash
cd Frontend
eas login
```
- Use sua conta do Expo (ou crie uma gratuita em expo.dev)

### 3. Configurar Projeto (uma vez só)
```bash
eas build:configure
```
- Isso vai gerar um `projectId` automaticamente

### 4. Criar o Build (Android APK)
```bash
eas build --profile development --platform android
```

**O que vai acontecer:**
- 📦 Código enviado para servidores Expo
- 🏗️ Compilação no cloud (15-20 minutos)
- 📱 Link para baixar APK
- 📲 QR Code para instalar direto

### 5. Compartilhar com Outros
Quando o build terminar, você terá:

**Link Direto:**
```
https://expo.dev/accounts/SEU-USERNAME/projects/Voluntariei/builds
```

Qualquer pessoa pode:
- Acessar esse link
- Baixar o APK
- Instalar no celular Android
- Testar o app!

### 6. Usar o App

**Para desenvolvimento (você):**
```bash
cd Frontend
npx expo start --dev-client
```
- Abra o app no celular
- Conecta automaticamente
- Hot reload funciona

**Para testers (outras pessoas):**
- Só instalar o APK
- Abrir o app
- Usar normalmente
- **⚠️ Importante:** Eles vão se conectar ao **seu backend rodando**
  - Precisa estar na mesma rede (WiFi)
  - OU você precisa expor o backend (ngrok, tunnel, etc)

---

## 🌐 Backend Acessível

### Opção A: Mesma Rede WiFi (Mais Fácil)
```bash
# Descubra seu IP local
ip addr show | grep "inet " | grep -v 127.0.0.1

# No Frontend/services/api.ts, use:
const api = axios.create({
  baseURL: 'http://SEU-IP-LOCAL:3333'
})

# Rode o backend:
cd Backend
npm run dev
```

### Opção B: Expor com Ngrok (Para Internet)
```bash
# Instalar ngrok
# https://ngrok.com/download

# Expor o backend
ngrok http 3333

# Copie a URL (ex: https://abc123.ngrok.io)
# No Frontend/services/api.ts:
const api = axios.create({
  baseURL: 'https://abc123.ngrok.io'
})
```

---

## 🧪 TESTE DE PUSH NOTIFICATIONS

### 1. No Celular (Voluntário)
- Abra o app
- Faça login como voluntário
- Aceite permissões de notificação
- **Minimize o app** (importante!)

### 2. No Computador (Criar Vaga)
```bash
# Opção A: Via API (Postman, Insomnia, curl)
POST http://localhost:3333/cards
# Com dados de uma vaga nova

# Opção B: Via Expo Push Tool
# https://expo.dev/notifications
# Cole o ExponentPushToken que apareceu no console
```

### 3. 💥 PUSH CHEGA!

---

## 📊 RESUMO FINAL

```bash
# 1. Backend (já feito)
cd Backend
docker compose up -d
npm run dev

# 2. Build do App (fazer agora)
npm install -g eas-cli
cd Frontend
eas login
eas build:configure
eas build --profile development --platform android

# 3. Aguardar build (~20 minutos)
# 4. Baixar e instalar APK
# 5. Testar!

# 6. Desenvolvimento contínuo
cd Frontend
npx expo start --dev-client
```

---

## ✅ CHECKLIST

**Backend:**
- [x] Docker rodando
- [x] PostgreSQL ativo (porta 5433)
- [x] .env configurado
- [x] Banco zerado e com seed
- [ ] Backend rodando (`npm run dev`)

**Frontend:**
- [ ] EAS CLI instalado
- [ ] Login no Expo
- [ ] ProjectId configurado
- [ ] Build Android criado
- [ ] APK instalado no celular
- [ ] Testers com APK instalado

**Testes:**
- [ ] Voluntário logado
- [ ] Permissão de notificação aceita
- [ ] Push token registrado
- [ ] Vaga criada
- [ ] Push notification recebida! 🎉

---

## 🆘 PROBLEMAS COMUNS

### "Build falhou"
- Veja logs em: https://expo.dev → Projects → Voluntariei → Builds
- Erro comum: Falta `projectId` em `app.config.js`

### "Não recebo push"
- App precisa estar **minimizado** (não fechado)
- Permissões aceitas?
- Push token registrado no backend?
- Backend rodando?

### "Testers não conectam no backend"
- Mesma rede WiFi?
- Firewall bloqueando?
- Use ngrok para expor pela internet

### "App não conecta no dev server"
- Rode: `npx expo start --dev-client --tunnel`
- Use a opção `--tunnel` para funcionar em qualquer rede

---

## 🎯 PRÓXIMO COMANDO

```bash
npm install -g eas-cli
```

**Depois:**
```bash
cd Frontend
eas login
```
