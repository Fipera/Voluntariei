# 📱 Push Notifications - Guia Completo

## Visão Geral

O backend está totalmente configurado para enviar **notificações push** via **Expo Push Notification Service**. As notificações push são enviadas **simultaneamente** com as notificações in-app, garantindo:

- ✅ **Notificação push** → Alerta imediato no dispositivo
- ✅ **Notificação in-app** → Histórico persistente dentro do app

---

## 🔧 Configuração no Backend

### 1. **Instalação de Dependências**

```bash
npm install expo-server-sdk --legacy-peer-deps
```

### 2. **Migração do Banco de Dados**

O campo `pushToken` foi adicionado aos modelos `Voluntary` e `Institution`:

```prisma
model Voluntary {
  // ... outros campos
  pushToken   String? // Token do Expo para push notifications
}

model Institution {
  // ... outros campos
  pushToken   String? // Token do Expo para push notifications
}
```

Migração executada: `20251019004827_add_push_token_fields`

---

## 📡 Endpoints para Registro de Push Token

### **Voluntário**

```http
POST /voluntary/register-push-token
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "pushToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Push token registered successfully"
}
```

### **Instituição**

```http
POST /institution/register-push-token
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "pushToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Push token registered successfully"
}
```

---

## 🔔 Gatilhos de Notificações Push

As push notifications são enviadas nos mesmos momentos que as notificações in-app:

| Evento | Destinatário | Título | Mensagem |
|--------|-------------|--------|----------|
| **Nova oportunidade criada** | Voluntários com skills correspondentes | "Nova oportunidade disponível!" | "A oportunidade '[TÍTULO]' foi criada e combina com suas habilidades." |
| **Voluntário se inscreveu** | Instituição dona da oportunidade | "Nova inscrição recebida" | "[NOME] se inscreveu em '[TÍTULO]'." |
| **Inscrição aprovada** | Voluntário inscrito | "Inscrição aprovada! 🎉" | "Sua inscrição em '[TÍTULO]' foi aprovada!" |
| **Inscrição rejeitada** | Voluntário inscrito | "Inscrição não aprovada" | "Sua inscrição em '[TÍTULO]' não foi aprovada desta vez." |
| **Oportunidade cancelada** | Voluntários com status CONFIRMED | "Oportunidade cancelada" | "A oportunidade '[TÍTULO]' foi cancelada pela instituição." |

---

## 🛠️ Arquitetura Técnica

### **Serviço de Push (`src/services/push.service.ts`)**

Funções principais:

```typescript
// Envia push para um único token
sendPushNotification(pushToken, title, body, data?)

// Envia push em lote (bulk)
sendBulkPushNotifications(recipients[])

// Notifica voluntário específico
notifyVoluntaryPush(voluntaryId, title, body, data?)

// Notifica instituição específica
notifyInstitutionPush(institutionId, title, body, data?)

// Notifica múltiplos voluntários
notifyVoluntariesPush(voluntaryIds[], title, body, data?)
```

### **Integração nos Services**

O arquivo `notification.service.ts` agora **envia ambas as notificações** (in-app e push) em cada gatilho:

```typescript
// Exemplo: Nova oportunidade
export async function notifyVolunteersAboutNewOpportunity(cardId, skillNames) {
  // ... busca voluntários e card

  // ✅ Cria notificações in-app
  await createBulkNotifications(notifications);

  // ✅ Envia push notifications
  await notifyVoluntariesPush(
    volunteers.map((v) => v.id),
    title,
    message,
    { cardId, type: "NEW_OPPORTUNITY" }
  );
}
```

---

## 📲 Integração no Frontend (Expo)

### 1. **Instalar Dependências**

```bash
npx expo install expo-notifications expo-device
```

### 2. **Obter Push Token**

```typescript
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Permissão de notificações negada!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Push notifications só funcionam em dispositivos físicos');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}
```

### 3. **Registrar Token no Backend**

```typescript
async function registerPushToken(token: string, userType: 'voluntary' | 'institution') {
  const endpoint = userType === 'voluntary' 
    ? '/voluntary/register-push-token'
    : '/institution/register-push-token';

  await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({ pushToken: token })
  });
}
```

### 4. **Configurar Handler de Notificações**

```typescript
import { useEffect, useRef } from 'react';

// Define comportamento quando app está em foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function usePushNotifications() {
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    // Listener para notificação recebida (app aberto)
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificação recebida:', notification);
      // Atualizar estado local, mostrar badge, etc.
    });

    // Listener para quando usuário toca na notificação
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notificação tocada:', response);
      const data = response.notification.request.content.data;
      
      // Navegar para tela específica
      if (data.cardId) {
        navigation.navigate('CardDetails', { cardId: data.cardId });
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);
}
```

### 5. **Hook Completo**

```typescript
import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';

export function useRegisterPushToken(userType: 'voluntary' | 'institution', authToken?: string) {
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (!authToken) return;

    async function register() {
      try {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          await registerPushToken(token, userType);
          setRegistered(true);
          console.log('✅ Push token registrado:', token);
        }
      } catch (error) {
        console.error('❌ Erro ao registrar push token:', error);
      }
    }

    register();
  }, [authToken, userType]);

  return registered;
}
```

### 6. **Uso no App**

```typescript
function App() {
  const { authToken, userType } = useAuth(); // seu hook de autenticação
  
  // Registra push token após login
  useRegisterPushToken(userType, authToken);
  
  // Configura listeners
  usePushNotifications();

  return <YourAppNavigator />;
}
```

---

## 🧪 Testando Push Notifications

### **Via Expo App no Celular**

1. Abra o projeto no Expo Go
2. Faça login no app
3. O push token será registrado automaticamente
4. Execute ações que disparam notificações:
   - **Instituição**: Crie uma oportunidade
   - **Voluntário**: Se inscreva em uma oportunidade
   - **Instituição**: Aprove/Rejeite inscrição
   - **Instituição**: Cancele oportunidade

### **Via Ferramenta Expo Push Tool**

Teste manualmente: https://expo.dev/notifications

```json
{
  "to": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "title": "Teste de notificação",
  "body": "Esta é uma notificação de teste!",
  "data": { "cardId": 123 }
}
```

---

## 🔍 Debugging

### **Verificar se Token foi Salvo**

```sql
-- PostgreSQL
SELECT id, email, pushToken FROM "Voluntary" WHERE pushToken IS NOT NULL;
SELECT id, email, pushToken FROM "Institution" WHERE pushToken IS NOT NULL;
```

### **Logs do Backend**

O serviço de push loga automaticamente erros:

```typescript
console.error(`Push token ${pushToken} is not a valid Expo push token`);
console.error('Error sending push notification:', error);
```

### **Validação de Token**

Tokens Expo seguem o formato:
```
ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
```

O serviço valida automaticamente usando `Expo.isExpoPushToken()`.

---

## ⚙️ Configurações Avançadas

### **Prioridade das Notificações**

Todas as notificações são enviadas com:
```typescript
priority: 'high'  // Garante entrega imediata
sound: 'default'  // Som padrão do sistema
```

### **Dados Personalizados**

Cada notificação inclui `data`:
```typescript
{
  cardId: number,
  type: NotificationType
}
```

Isso permite navegação específica quando o usuário toca na notificação.

### **Batching**

Push notifications em lote são automaticamente divididas em chunks de 100 (limite do Expo):

```typescript
const chunks = expo.chunkPushNotifications(messages);
```

---

## 📊 Status Atual

✅ **Instalado**: expo-server-sdk  
✅ **Banco**: Campo `pushToken` adicionado  
✅ **Endpoints**: `/register-push-token` para ambos os tipos  
✅ **Serviços**: `push.service.ts` completo  
✅ **Integração**: Todos os 5 gatilhos integrados  
✅ **Dual-mode**: In-app + Push simultâneos  
✅ **Validação**: Token validation e error handling  

---

## 🚀 Próximos Passos (Futuro)

- [ ] **Notificação 1h antes** do evento (via cron job)
- [ ] **Badge count** automático no ícone do app
- [ ] **Deep linking** para navegar direto para card específico
- [ ] **Rich notifications** com imagens e actions
- [ ] **Analytics** de taxa de abertura de notificações

---

## 📞 Suporte

Para dúvidas sobre push notifications:
- Documentação Expo: https://docs.expo.dev/push-notifications/overview/
- Expo Push Tool: https://expo.dev/notifications
- Limits & Best Practices: https://docs.expo.dev/push-notifications/sending-notifications/#limitations

---

**✨ Push Notifications implementadas com sucesso!**
