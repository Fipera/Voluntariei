# 🧪 Teste Rápido - Push Notifications

## Cenário de Teste Completo

### 1️⃣ **Setup Inicial**

No seu app Expo/React Native:

```typescript
// App.tsx ou similar
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configure o handler global
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function getPushToken() {
  if (!Device.isDevice) {
    alert('Push notifications só funcionam em dispositivo físico!');
    return null;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permissão negada!');
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('📱 Push Token:', token);
  return token;
}
```

### 2️⃣ **Registrar Token Após Login**

**Para Voluntário:**
```typescript
const token = await getPushToken();

fetch('http://localhost:3000/voluntary/register-push-token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${seuTokenJWT}`
  },
  body: JSON.stringify({ pushToken: token })
});
```

**Para Instituição:**
```typescript
const token = await getPushToken();

fetch('http://localhost:3000/institution/register-push-token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${seuTokenJWT}`
  },
  body: JSON.stringify({ pushToken: token })
});
```

### 3️⃣ **Testar Notificações**

#### Teste 1: Nova Oportunidade
```bash
# Instituição cria oportunidade
curl -X POST http://localhost:3000/cards \
  -H "Authorization: Bearer SEU_TOKEN_INSTITUICAO" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ajuda em hospital",
    "description": "Precisamos de voluntários",
    "startAt": "2025-12-01T09:00:00Z",
    "duration": 240,
    "isOnline": false,
    "maxVolunteers": 10,
    "skills": ["Saúde"]
  }'
```

**Resultado esperado:**
- ✅ Todos os voluntários com skill "Saúde" recebem push
- ✅ Notificação in-app criada no banco

#### Teste 2: Voluntário se Inscreve
```bash
curl -X POST http://localhost:3000/cards/123/apply \
  -H "Authorization: Bearer SEU_TOKEN_VOLUNTARIO" \
  -H "Content-Type: application/json" \
  -d '{
    "observation": "Tenho experiência com idosos"
  }'
```

**Resultado esperado:**
- ✅ Instituição dona do card recebe push
- ✅ Notificação in-app criada

#### Teste 3: Instituição Aprova
```bash
curl -X POST http://localhost:3000/participations/456/approve \
  -H "Authorization: Bearer SEU_TOKEN_INSTITUICAO"
```

**Resultado esperado:**
- ✅ Voluntário recebe push "Inscrição aprovada! 🎉"
- ✅ Notificação in-app criada

#### Teste 4: Instituição Rejeita
```bash
curl -X POST http://localhost:3000/participations/457/reject \
  -H "Authorization: Bearer SEU_TOKEN_INSTITUICAO"
```

**Resultado esperado:**
- ✅ Voluntário recebe push "Inscrição não aprovada"
- ✅ Notificação in-app criada

#### Teste 5: Cancelamento
```bash
curl -X POST http://localhost:3000/cards/123/cancel \
  -H "Authorization: Bearer SEU_TOKEN_INSTITUICAO"
```

**Resultado esperado:**
- ✅ Todos voluntários CONFIRMADOS recebem push
- ✅ Notificações in-app criadas

---

## 📱 Verificar Recebimento

### No App (React Native)
```typescript
useEffect(() => {
  // Notificação recebida (app aberto)
  const subscription1 = Notifications.addNotificationReceivedListener(notification => {
    console.log('📩 Recebida:', notification.request.content);
    Alert.alert(
      notification.request.content.title,
      notification.request.content.body
    );
  });

  // Notificação tocada pelo usuário
  const subscription2 = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('👆 Tocada:', response.notification.request.content.data);
    const { cardId } = response.notification.request.content.data;
    // Navegar para tela do card
    navigation.navigate('CardDetails', { cardId });
  });

  return () => {
    subscription1.remove();
    subscription2.remove();
  };
}, []);
```

---

## 🐛 Troubleshooting

### Problema: "Push token not valid"
**Solução:** Certifique-se de que o token tem o formato correto:
```
ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
```

### Problema: Notificação não aparece
**Checklist:**
- [ ] Dispositivo físico (não emulador)
- [ ] Permissão concedida
- [ ] Token registrado no backend
- [ ] App em background ou fechado
- [ ] Verifique logs do backend: `docker logs -f backend_container`

### Problema: "Failed to register push token"
**Solução:**
1. Verifique se está autenticado (JWT válido)
2. Verifique logs do backend
3. Teste o endpoint manualmente com curl

---

## 🔍 Validação Completa

### 1. Verificar Token no Banco
```bash
# Entre no container do PostgreSQL
docker exec -it postgres_container psql -U seu_usuario -d voluntariei

# Verifique tokens salvos
SELECT id, email, pushToken FROM "Voluntary" LIMIT 5;
SELECT id, email, pushToken FROM "Institution" LIMIT 5;
```

### 2. Testar com Expo Push Tool
Acesse: https://expo.dev/notifications

Cole seu pushToken e envie:
```json
{
  "to": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "title": "Teste Manual",
  "body": "Se você recebeu isso, está funcionando! ✅",
  "data": { "test": true }
}
```

### 3. Monitorar Backend
```bash
# Logs do servidor
docker logs -f backend_container

# Você deve ver:
# "✅ Push notification sent successfully"
# ou
# "❌ Push token invalid: ..."
```

---

## ✅ Checklist de Sucesso

- [ ] Push token obtido no app
- [ ] Token registrado via `/register-push-token`
- [ ] Token salvo no banco de dados
- [ ] Notificação de teste recebida (via Expo Tool)
- [ ] Notificação real recebida (via ação no app)
- [ ] Tocar na notificação navega corretamente
- [ ] Notificação in-app também criada
- [ ] Logs do backend sem erros

---

## 📊 Fluxo Completo de Teste

```mermaid
graph TD
    A[App Inicia] --> B[Solicita Permissão]
    B --> C[Obtém Push Token]
    C --> D[Usuário Faz Login]
    D --> E[Registra Token no Backend]
    E --> F[Token Salvo no DB]
    F --> G[Ação Dispara Notificação]
    G --> H[Backend Envia Push]
    H --> I[Expo Push Service]
    I --> J[Dispositivo Recebe]
    J --> K{App Aberto?}
    K -->|Sim| L[Handler: addNotificationReceivedListener]
    K -->|Não| M[Notificação na Bandeja]
    M --> N[Usuário Toca]
    N --> O[Handler: addNotificationResponseReceivedListener]
    O --> P[Navega para Tela]
```

---

**🎯 Tudo pronto para testar!** Siga o fluxo acima e qualquer dúvida, consulte `PUSH_NOTIFICATIONS.md` para detalhes