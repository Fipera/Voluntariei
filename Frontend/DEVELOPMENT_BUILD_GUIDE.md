# 🚀 Como Fazer Development Build (Push Notifications)

## ⚠️ IMPORTANTE
Push notifications **NÃO funcionam no Expo Go** a partir do SDK 53!
Você precisa criar um **Development Build**.

---

## 📋 Pré-requisitos

### Para Todos:
- [ ] Conta no Expo (gratuita)
- [ ] EAS CLI instalado globalmente

### Para Android:
- [ ] Celular Android com cabo USB
- [ ] USB Debugging habilitado no celular

### Para iOS (Opcional - Apenas Mac):
- [ ] Mac com Xcode instalado
- [ ] Conta Apple Developer ($99/ano)

---

## 🛠️ Passo a Passo (Android)

### 1. Instalar EAS CLI

```bash
npm install -g eas-cli
```

### 2. Fazer Login no Expo

```bash
cd Frontend
eas login
```

### 3. Configurar Projeto

```bash
eas build:configure
```

Isso vai:
- ✅ Criar `eas.json` (já criado)
- ✅ Gerar um `projectId` no Expo
- ✅ Atualizar `app.json` automaticamente

### 4. Verificar app.config.js

Após rodar o comando acima, o `projectId` será adicionado automaticamente.
Se não for, copie do output e adicione manualmente em `app.config.js`:

```javascript
extra: {
  eas: {
    projectId: "SEU-PROJECT-ID-AQUI"
  }
}
```

### 5. Criar Development Build (Android APK)

```bash
# Build para Android (APK - não precisa de Google Play)
eas build --profile development --platform android
```

Isso vai:
- 📦 Fazer upload do código para Expo
- 🏗️ Compilar o APK nos servidores da Expo (15-20 minutos)
- 📱 Gerar um link para baixar o APK

### 6. Instalar o APK no Celular

**Opção A: QR Code (Mais Fácil)**
1. Quando o build terminar, aparecerá um QR Code
2. Escaneie com a câmera do celular
3. Baixe e instale o APK

**Opção B: Link Direto**
1. Acesse: https://expo.dev/accounts/SEU-USERNAME/projects/Voluntariei/builds
2. Clique no build mais recente
3. Clique em "Download" e baixe o APK
4. Transfira para o celular e instale

**Opção C: Cabo USB (Direto)**
```bash
# Após o build terminar, instale direto via USB
adb install caminho/para/app.apk
```

### 7. Rodar o Development Server

```bash
npx expo start --dev-client
```

### 8. Abrir o App no Celular

1. Abra o app "Voluntariei" (que você instalou no passo 6)
2. O app vai conectar automaticamente no servidor de desenvolvimento
3. Você verá o mesmo efeito do Expo Go, mas **com push notifications funcionando!**

---

## 🎯 Testar Push Notifications

Agora sim, você pode testar! 🎉

1. **Abra o app no celular** (development build)
2. **Faça login como VOLUNTÁRIO**
3. **Aceite permissões de notificação** ✅
4. Você verá no console:
   ```
   📱 Expo Push Token: ExponentPushToken[xxxxx]
   ✅ Push token registrado no backend
   ```
5. **Minimize o app**
6. **No computador**, crie uma vaga via API ou Expo Push Tool
7. **💥 BOOM!** Push notification chega!

---

## 🔄 Workflow de Desenvolvimento

### Quando você muda o código JavaScript/TypeScript:
- ✅ **Não precisa fazer novo build**
- ✅ Apenas salve o arquivo
- ✅ Hot reload funciona normalmente

### Quando você muda configurações nativas:
- ❌ Precisa fazer novo build
- Exemplos: `app.json`, `app.config.js`, adicionar/remover pacotes nativos

---

## 🚀 Alternativa Rápida: Build Local (Android)

Se você tem Android Studio instalado e configurado:

```bash
# Instalar expo-dev-client
npx expo install expo-dev-client

# Rodar build local
npx expo run:android
```

Isso compila no seu PC (mais rápido que Expo servers), mas requer:
- Android Studio instalado
- Android SDK configurado
- Java JDK instalado

---

## 💡 Dicas

### Build está demorando?
- Primeira vez: 15-30 minutos (normal)
- Builds seguintes: 10-15 minutos
- Contas pagas do Expo: Mais rápido (priority queue)

### Como ver o progresso?
```bash
# No terminal onde rodou o build, você verá:
✔ Build finished
✔ Build ID: xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
✔ Download: https://expo.dev/...

# Ou acesse:
https://expo.dev/accounts/SEU-USERNAME/projects/Voluntariei/builds
```

### Build falhou?
Veja os logs em: https://expo.dev/accounts/SEU-USERNAME/projects/Voluntariei/builds
Erros comuns:
- Falta de memória (server Expo)
- Erro no `app.json` / `app.config.js`
- Pacote nativo incompatível

### Quer testar mais rápido?
Use o **Expo Push Tool** para enviar notificações manuais:
https://expo.dev/notifications

---

## 📱 Resumo dos Comandos

```bash
# Setup inicial (uma vez)
npm install -g eas-cli
cd Frontend
eas login
eas build:configure

# Criar build Android (quando necessário)
eas build --profile development --platform android

# Desenvolvimento diário
npx expo start --dev-client
```

---

## ✅ Checklist

- [ ] EAS CLI instalado
- [ ] Login no Expo feito
- [ ] `eas.json` criado
- [ ] `projectId` configurado em `app.config.js`
- [ ] Build Android criado
- [ ] APK instalado no celular
- [ ] Development server rodando
- [ ] App conectado ao server
- [ ] Push notifications pedindo permissão ✅
- [ ] Push token registrado no backend ✅
- [ ] Teste de push funcionando! 🎉

---

## 🆘 Problemas?

### "Expo Go não suporta expo-notifications"
✅ **Solução**: Use development build (este guia)

### "Cannot find module expo-dev-client"
```bash
npx expo install expo-dev-client
```

### "No compatible version found"
```bash
npx expo install --fix
```

### "Build failed"
Veja logs em: https://expo.dev → Projects → Voluntariei → Builds → Clique no build → View Logs

---

## 🎉 Próximo Passo

Depois que o build terminar e você instalar o APK:

1. Abra o app "Voluntariei" no celular
2. Faça login como voluntário
3. Aceite permissões de notificações
4. Minimize o app
5. Crie uma vaga (API ou web)
6. **PUSH CHEGA! 🚀**

**Duração total**: ~30 minutos (primeira vez), depois ~15 minutos para novos builds
