# 🚀 Deploy APK Standalone com Backend Ngrok

## 🎯 Objetivo
Criar um APK standalone que funciona **independente do Expo** no PC, conectando ao backend via ngrok.

---

## 📋 Pré-requisitos

- [ ] Conta Expo criada
- [ ] EAS CLI instalado (`npm install -g eas-cli`)
- [ ] Ngrok instalado
- [ ] 2 celulares Android para teste

---

## 🔧 Passo a Passo

### 1️⃣ Configurar Backend com Ngrok

```bash
cd Backend

# Rodar backend
npm run dev

# Em outro terminal, rodar ngrok
ngrok http 3000
```

Você verá algo como:
```
Forwarding  https://abc123xyz.ngrok-free.app -> http://localhost:3000
```

**⚠️ COPIE ESSA URL!** Você vai precisar dela.

---

### 2️⃣ Atualizar URL do Backend no Frontend

Edite: `Frontend/services/api.ts`

```typescript
const api = axios.create({
  baseURL: 'https://SUA-URL-NGROK-AQUI.ngrok-free.app',
});
```

**Exemplo**:
```typescript
const api = axios.create({
  baseURL: 'https://abc123xyz.ngrok-free.app',
});
```

---

### 3️⃣ Fazer Login no Expo

```bash
cd Frontend
eas login
```

Se já estiver logado, vai mostrar seu username. Perfeito! ✅

---

### 4️⃣ Criar APK de Produção (Standalone)

```bash
# Build de PRODUÇÃO (APK standalone)
eas build --profile production --platform android
```

**O que acontece:**
- 📦 Código é enviado para servidores Expo
- 🏗️ Compilação demora ~15-20 minutos
- 📱 Gera um APK **standalone** (não precisa de Expo no PC!)
- 🔗 Retorna um link de download

**Diferença do Development Build:**
- ✅ Não precisa rodar `expo start` no PC
- ✅ App funciona sozinho
- ✅ Pode distribuir para quantas pessoas quiser
- ✅ Push notifications funcionam perfeitamente
- ❌ Não tem hot-reload (precisa fazer novo build para cada mudança)

---

### 5️⃣ Baixar e Instalar o APK

Quando o build terminar:

**Opção A: QR Code**
1. Aparecerá um QR Code no terminal
2. Escaneie com câmera do celular
3. Baixe e instale o APK

**Opção B: Link Direto**
1. Acesse: https://expo.dev/accounts/SEU-USERNAME/projects/Voluntariei/builds
2. Clique no build mais recente
3. Clique em "Download"
4. Baixe o APK
5. Envie via WhatsApp/Telegram para o outro celular

**Opção C: Compartilhar Link**
```bash
# Após o build, copie o link de download e envie para seu amigo
# Exemplo: https://expo.dev/artifacts/eas/xxxx.apk
```

---

### 6️⃣ Instalar em Ambos os Celulares

1. **No seu celular**:
   - Baixe o APK
   - Permita "Instalar de fontes desconhecidas"
   - Instale

2. **No celular do seu amigo**:
   - Envie o APK via WhatsApp/Telegram/Google Drive
   - Ele baixa
   - Ele instala

**📱 O app agora é STANDALONE! Funciona sem Expo no PC!**

---

### 7️⃣ Testar Tudo

#### No Backend (seu PC):
```bash
# Terminal 1: Backend rodando
cd Backend
npm run dev

# Terminal 2: Ngrok expondo backend
ngrok http 3000
```

#### Nos Celulares:

1. **Celular 1 (você):**
   - Abra app "Voluntariei"
   - Faça login como **INSTITUIÇÃO**
   - Crie uma vaga

2. **Celular 2 (seu amigo):**
   - Abra app "Voluntariei"
   - Faça login como **VOLUNTÁRIO**
   - 💥 **Push notification chega!**
   - Entre na vaga
   - Converse no chat

---

## 🔄 Workflow Completo

### Para TESTAR (apenas uma vez):
```bash
# 1. Rodar backend
cd Backend
npm run dev

# 2. Expor com ngrok (outro terminal)
ngrok http 3000

# 3. Copiar URL do ngrok
# 4. Atualizar Frontend/services/api.ts
# 5. Criar APK
cd Frontend
eas build --profile production --platform android

# 6. Esperar ~15-20 minutos
# 7. Baixar APK
# 8. Instalar em 2 celulares
# 9. Testar! 🎉
```

### Para USO DIÁRIO (após APK criado):
```bash
# Apenas rodar backend + ngrok
cd Backend
npm run dev

# Outro terminal
ngrok http 3000

# Pronto! Os apps nos celulares vão conectar automaticamente
```

---

## 🚨 Importante sobre Ngrok

### ⚠️ URL Muda a Cada Vez

Quando você **reiniciar o ngrok**, a URL muda!

```
Primeira vez:  https://abc123.ngrok-free.app
Segunda vez:   https://xyz789.ngrok-free.app  ← DIFERENTE!
```

**Solução:**

**Opção 1: URL Fixa (Recomendado)**
```bash
# Criar conta grátis no ngrok
ngrok config add-authtoken SEU_TOKEN

# Usar domínio fixo (plano grátis tem 1 domínio fixo)
ngrok http --domain=seu-dominio-fixo.ngrok-free.app 3000
```

Aí você configura **UMA VEZ** no `api.ts` e nunca mais muda! ✅

**Opção 2: Atualizar APK a Cada Teste**
- Toda vez que ngrok reiniciar
- Atualizar `api.ts` com nova URL
- Fazer novo build
- Distribuir novo APK
- ❌ **Chato!**

---

## 💡 Dicas

### Como saber se funcionou?
- App abre direto (sem precisar de Expo)
- Consegue fazer login
- Consegue criar/ver vagas
- Push notifications funcionam

### Build muito devagar?
- Primeira vez: 20-30 minutos (normal)
- Builds seguintes: 10-15 minutos
- Pode usar conta paga Expo (priority queue)

### Quer testar mudanças no código?
- ❌ Hot-reload não funciona (é APK standalone)
- ✅ Precisa fazer novo build
- Comando: `eas build --profile production --platform android`

### Como distribuir para mais pessoas?
- Link do APK é público
- Pode enviar para quantas pessoas quiser
- Todos vão usar o mesmo APK
- Todos vão conectar no mesmo backend (ngrok)

---

## 🎯 Checklist Final

- [ ] Backend rodando (`npm run dev`)
- [ ] Ngrok rodando (`ngrok http 3000`)
- [ ] URL do ngrok copiada
- [ ] `Frontend/services/api.ts` atualizado com URL ngrok
- [ ] Build de produção criado (`eas build --profile production --platform android`)
- [ ] APK baixado
- [ ] APK instalado no celular 1
- [ ] APK instalado no celular 2
- [ ] App abrindo em ambos
- [ ] Login funcionando
- [ ] Push notifications funcionando 🎉
- [ ] Chat funcionando 🎉

---

## 🆘 Problemas Comuns

### "Network Error" no app
✅ Verifique:
- Backend está rodando?
- Ngrok está rodando?
- URL no `api.ts` está correta?
- Celular está com internet (wifi/dados)?

### "Push notifications não chegam"
✅ Verifique:
- Permissões aceitas no celular?
- Usuário é VOLUNTÁRIO?
- Instituição criou vaga nova?
- Backend está rodando?

### "APK não instala"
✅ Solução:
- Permita "Instalar de fontes desconhecidas"
- Android 11+: Vai pedir permissão para cada app

### "Build failed"
✅ Veja logs em:
- https://expo.dev → Projects → Voluntariei → Builds
- Clique no build que falhou → View Logs

---

## 🎉 Resumo

```bash
# 1. Criar APK (uma vez)
cd Frontend
eas build --profile production --platform android

# 2. Esperar ~15-20 minutos ⏳

# 3. Baixar e instalar em 2 celulares 📱📱

# 4. Rodar backend + ngrok (sempre que for testar)
cd Backend
npm run dev            # Terminal 1
ngrok http 3000        # Terminal 2

# 5. Usar o app! 🎉
```

**Duração total**: ~30 minutos (primeira vez)

**Depois**: Apenas rodar backend + ngrok (~2 minutos) 🚀
