# 🔐 CONFIGURAR NGROK (Uma vez só)

## ✅ Passo a Passo:

### 1. Criar conta (GRÁTIS)
Acesse: https://dashboard.ngrok.com/signup

- Cadastre-se com email/Google/GitHub
- É totalmente gratuito!

### 2. Pegar o Authtoken
Após criar a conta, você vai ver uma página com seu token.

Ou acesse: https://dashboard.ngrok.com/get-started/your-authtoken

### 3. Configurar o token (uma vez só)
```bash
ngrok config add-authtoken SEU-TOKEN-AQUI
```

Exemplo:
```bash
ngrok config add-authtoken 2aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpP
```

### 4. Pronto! Agora pode usar:
```bash
ngrok http 3000
```

---

## 📋 COMANDOS COMPLETOS

```bash
# 1. Criar conta
# → https://dashboard.ngrok.com/signup

# 2. Copiar seu authtoken
# → https://dashboard.ngrok.com/get-started/your-authtoken

# 3. Configurar (cole seu token)
ngrok config add-authtoken SEU-TOKEN-AQUI

# 4. Usar (sempre que precisar)
ngrok http 3000
```

---

## 🎯 DEPOIS DE CONFIGURAR

Você verá algo assim:

```
ngrok

Session Status                online
Account                       seu@email.com (Plan: Free)
Version                       3.30.0
Region                        South America (sa)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc-123-def.ngrok-free.app -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**Copie a URL do "Forwarding":**
```
https://abc-123-def.ngrok-free.app
```

---

## ✅ PRÓXIMO PASSO

Após configurar o authtoken:

1. Cole a URL do ngrok no Frontend/services/api.ts
2. Faça novo build:
```bash
cd Frontend
eas build --profile development --platform android
```

3. Compartilhe o link do APK!

---

## 💡 ALTERNATIVA: Localtunnel (Sem cadastro)

Se não quiser criar conta no ngrok, use localtunnel:

```bash
npx localtunnel --port 3000
```

- Não precisa cadastro
- Não precisa authtoken
- Funciona imediatamente
- Menos estável que ngrok
