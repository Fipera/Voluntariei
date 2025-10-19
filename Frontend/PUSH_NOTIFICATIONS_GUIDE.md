# 📱 Guia de Push Notifications - Voluntariei

## ✅ Implementação Completa

### Arquivos Criados/Modificados

1. **Backend (Você já fez):**
   - ✅ `schema.prisma` - Campo `pushToken` adicionado
   - ✅ `push-notification.service.ts` - Serviço de envio
   - ✅ `push-token.controller.ts` - Endpoints de registro
   - ✅ `push-token.route.ts` - Rotas
   - ✅ `notification.service.ts` - Integração com push

2. **Frontend (Implementado agora):**
   - ✅ `hooks/usePushNotifications.ts` - Hook principal
   - ✅ `app.json` - Configuração de notificações
   - ✅ `app.config.js` - Configuração do EAS project ID
   - ✅ `app/_layout.tsx` - Inicialização do hook
   - ✅ `providers/AuthProvider.tsx` - Desregistro no logout
   - ✅ `assets/images/notification-icon.png` - Ícone (temporário)

---

## 🚀 Como Testar

### Pré-requisitos
⚠️ **IMPORTANTE**: Push notifications **NÃO funcionam em simuladores/emuladores**. Você precisa de um **dispositivo físico Android ou iOS**.

### 1. Configurar EAS Project ID

```bash
cd Frontend

# Se ainda não tem EAS CLI instalado
npm install -g eas-cli

# Login no Expo
eas login

# Criar projeto EAS (se não existir)
eas build:configure

# O comando acima vai criar um eas.json e gerar um projectId
# Copie o projectId que aparecer
```

Depois, edite o `app.config.js` e substitua `"your-project-id-here"` pelo projectId real.

**Alternativa:** Se não quiser usar EAS ainda, pode deixar como está. O Expo vai gerar um token mesmo assim durante o desenvolvimento.

### 2. Compilar e Rodar no Dispositivo

```bash
# Iniciar o servidor de desenvolvimento
npx expo start

# No terminal, pressione:
# - 'a' para Android (conecte via USB ou Wi-Fi)
# - 'i' para iOS (apenas Mac)

# Ou escaneie o QR Code com o app Expo Go
```

### 3. Testar o Fluxo Completo

#### A. Login e Registro de Token
1. Faça login no app (voluntário ou instituição)
2. O app vai pedir permissão para notificações - **aceite**
3. Verifique no console do Expo:
   ```
   📱 Expo Push Token: ExponentPushToken[xxxxx]
   ✅ Push token registrado no backend: ExponentPushToken[xxxxx]
   ```

#### B. Verificar Token no Backend
```bash
# No banco de dados, verifique se o pushToken foi salvo
# Instituição: tabela Institution, campo pushToken
# Voluntário: tabela Voluntary, campo pushToken
```

#### C. Testar Notificações

**Cenário 1: Nova Vaga (Voluntário)**
1. Crie uma vaga como instituição com skills específicas
2. Voluntários com essas skills devem receber push notification:
   - Título: "Nova vaga disponível!"
   - Mensagem: "[Nome da vaga] - [Local]"
   - Ao tocar: abre o card da vaga

**Cenário 2: Nova Inscrição (Instituição)**
1. Voluntário se inscreve em uma vaga
2. Instituição recebe push notification:
   - Título: "Nova inscrição recebida!"
   - Mensagem: "[Nome do Voluntário] se inscreveu em [Nome da Vaga]"
   - Ao tocar: abre o gerenciamento da vaga

**Cenário 3: Inscrição Aprovada (Voluntário)**
1. Instituição aprova uma inscrição
2. Voluntário recebe push notification:
   - Título: "Inscrição aprovada!"
   - Mensagem: "Sua inscrição em [Nome da Vaga] foi aprovada!"
   - Ao tocar: abre o card da vaga

**Cenário 4: Vaga Cancelada**
1. Instituição cancela uma vaga
2. Todos os inscritos recebem push notification:
   - Título: "Vaga cancelada"
   - Mensagem: "A vaga [Nome da Vaga] foi cancelada"
   - Ao tocar: abre o card (com status cancelado)

#### D. Testar Comportamento da Notificação

**App Aberto:**
- Notificação aparece como banner no topo
- Som toca
- Badge incrementa

**App em Background:**
- Notificação aparece na barra de status
- Ao tocar, abre o app e navega para o card

**App Fechado:**
- Notificação aparece na barra de status
- Ao tocar, abre o app e navega para o card

### 4. Teste Manual via Expo Push Tool

Você pode enviar notificações manualmente para testar:

1. Acesse: https://expo.dev/notifications
2. Cole o Expo Push Token (aparece no console)
3. Configure a mensagem:
   ```json
   {
     "to": "ExponentPushToken[xxxxx]",
     "title": "Teste Manual",
     "body": "Esta é uma notificação de teste",
     "data": {
       "cardId": "id-de-uma-vaga-real",
       "type": "NEW_OPPORTUNITY"
     }
   }
   ```
4. Clique em "Send a Notification"
5. Verifique se chegou no dispositivo

### 5. Testar Logout

1. Com push notifications funcionando
2. Faça logout
3. Verifique no console:
   ```
   ✅ Push token desregistrado
   ```
4. No banco de dados, o campo `pushToken` deve estar NULL
5. Tente enviar notificação - não deve chegar mais

---

## 🐛 Troubleshooting

### Problema: "Permission denied"
**Solução:** Usuário negou permissão. Peça para ir em Configurações > Apps > Voluntariei > Notificações e ativar.

### Problema: "projectId não encontrado"
**Solução:** Configure o EAS project ID no `app.config.js` ou deixe como está para desenvolvimento.

### Problema: Token não está sendo registrado
**Solução:** 
- Verifique se o backend está rodando
- Verifique se as rotas `/institution/register-push-token` e `/voluntary/register-push-token` existem
- Verifique logs no console do Expo

### Problema: Notificação não navega ao tocar
**Solução:**
- Verifique se `data.cardId` está sendo enviado no push
- Verifique se o card existe no banco de dados
- Verifique logs no console quando tocar na notificação

### Problema: Funciona no Expo Go mas não no build
**Solução:**
- Certifique-se de fazer um novo build após adicionar expo-notifications
- Para Android: `eas build -p android`
- Para iOS: `eas build -p ios` (requer conta Apple Developer)

---

## 📊 Logs Úteis

Durante o teste, observe estes logs no console do Expo:

```
✅ Bons sinais:
📱 Expo Push Token: ExponentPushToken[xxxxx]
✅ Push token registrado no backend: ExponentPushToken[xxxxx]
📩 Notificação recebida: {...}
👆 Notificação tocada: {...}
✅ Push token desregistrado

❌ Problemas:
⚠️ Push notifications só funcionam em dispositivos físicos
❌ Permissão de notificação negada
❌ Erro ao registrar push token: {...}
❌ Erro ao obter push token: {...}
```

---

## 🎯 Checklist de Validação

- [ ] Push token é registrado no login
- [ ] Nova vaga → Voluntários com skills recebem push
- [ ] Nova inscrição → Instituição recebe push
- [ ] Inscrição aprovada → Voluntário recebe push
- [ ] Inscrição rejeitada → Voluntário recebe push
- [ ] Vaga cancelada → Inscritos recebem push
- [ ] Tocar na notificação navega para o card correto
- [ ] Push funciona com app aberto
- [ ] Push funciona com app em background
- [ ] Push funciona com app fechado
- [ ] Push token é removido no logout
- [ ] Após logout, não recebe mais notificações

---

## 🔮 Melhorias Futuras

1. **Notificação 1h antes da vaga começar**
   - Backend: Job scheduler (node-cron)
   - Enviar push 1h antes do `startDate`

2. **Notificações agrupadas**
   - Android: Usar `android.groupId`
   - iOS: Usar `threadId`

3. **Sons customizados**
   - Adicionar arquivos de áudio em `assets/sounds/`
   - Configurar em `app.json` > `notification.sounds`

4. **Rich notifications (imagens)**
   - Adicionar campo `image` no push
   - Mostra thumbnail da vaga

5. **Ações rápidas**
   - Android: Quick actions (aprovar/rejeitar direto da notificação)
   - iOS: Actionable notifications

---

## 📝 Endpoints do Backend

```typescript
POST /institution/register-push-token
POST /voluntary/register-push-token
Body: { pushToken: string }
Headers: { Authorization: Bearer <token> }

DELETE /institution/unregister-push-token
DELETE /voluntary/unregister-push-token
Body: { pushToken: string }
Headers: { Authorization: Bearer <token> }
```

---

## 🎨 Próximo Passo: Ícone Personalizado

Crie um ícone 96x96px branco com fundo transparente e substitua:
`Frontend/assets/images/notification-icon.png`

Sugestões:
- Sino (clássico para notificações)
- Coração (voluntariado)
- Mãos unidas (solidariedade)
- Ícone simplificado do seu logo

---

**✨ Implementação Completa! Teste no dispositivo físico e veja a mágica acontecer! 🚀**
