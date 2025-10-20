# 🚀 Como Expor o Backend (FÁCIL E GRÁTIS)

## 🎯 Método 1: Localtunnel (MAIS FÁCIL - 1 comando)

### Passo a Passo:

```bash
# 1. Backend rodando
cd Backend
npm run dev
# Backend na porta 3000

# 2. Em OUTRO terminal, expor:
npx localtunnel --port 3000

# Vai mostrar:
# your url is: https://random-name.loca.lt
```

### Atualizar o App:

1. Copie a URL gerada (ex: `https://random-name.loca.lt`)

2. Abra `Frontend/services/api.ts` e mude:
```typescript
const api = axios.create({
  baseURL: 'https://random-name.loca.lt'  // Cole a URL aqui
})
```

3. Fazer novo build:
```bash
cd Frontend
eas build --profile development --platform android
```

4. Aguarde ~10-15 minutos

5. Compartilhe o novo link do build!

---

## 🎯 Método 2: Ngrok (MAIS ESTÁVEL)

### Instalar (uma vez):
```bash
sudo snap install ngrok
```

### Usar:
```bash
# 1. Backend rodando
cd Backend
npm run dev

# 2. Expor:
ngrok http 3000

# Vai mostrar:
# Forwarding: https://abc-123.ngrok-free.app -> http://localhost:3000
```

### Atualizar o App:
Mesmo processo do localtunnel, mas com a URL do ngrok.

---

## 🎯 Método 3: Mesma WiFi (SEM INTERNET)

### Se todos os testers estiverem na mesma WiFi:

```bash
# 1. Descubra seu IP:
hostname -I | awk '{print $1}'
# Ex: 192.168.1.100

# 2. Configure no Frontend/services/api.ts:
const api = axios.create({
  baseURL: 'http://192.168.1.100:3000'
})

# 3. Novo build:
eas build --profile development --platform android
```

---

## ⚡ RESUMO RÁPIDO

### Opção Mais Fácil (Testar AGORA):
```bash
# Terminal 1
cd Backend
npm run dev

# Terminal 2
npx localtunnel --port 3000
# Copie a URL gerada

# Atualize Frontend/services/api.ts com a URL
# Faça novo build
```

### Opção Mais Estável (Testar por dias):
```bash
# Instalar ngrok
sudo snap install ngrok

# Usar
ngrok http 3000
# Copie a URL gerada

# Atualize Frontend/services/api.ts com a URL
# Faça novo build
```

---

## 💡 DICA

**Toda vez que reiniciar o ngrok/localtunnel:**
- A URL muda
- Precisa atualizar o código
- Precisa fazer novo build

**Solução:**
- Use ngrok pago ($8/mês) - URL fixa
- Ou hospede o backend (Railway, Render - grátis)

---

## 🆘 Problemas?

### "This site can't be reached"
- Backend está rodando?
- Ngrok/localtunnel está ativo?
- URL correta no código?

### "URL mudou"
- Normal no plano free
- Atualize o código e refaça o build

### "Muito lento"
- Localtunnel às vezes é lento
- Use ngrok (mais estável)
- Ou hospede o backend
