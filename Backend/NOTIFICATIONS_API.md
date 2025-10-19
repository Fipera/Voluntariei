# 📬 Sistema de Notificações - Documentação para Frontend

## 📋 Visão Geral

Sistema de notificações in-app que envia automaticamente notificações para voluntários e instituições baseado em ações realizadas na plataforma.

---

## 🔔 Tipos de Notificações

### Para VOLUNTÁRIOS:

1. **NEW_OPPORTUNITY** - Nova oportunidade criada com suas skills
2. **APPLICATION_APPROVED** - Inscrição aprovada pela instituição
3. **APPLICATION_REJECTED** - Inscrição rejeitada pela instituição
4. **OPPORTUNITY_CANCELED** - Oportunidade cancelada pela instituição
Q
### Para INSTITUIÇÕES:

1. **NEW_APPLICATION** - Novo voluntário se inscreveu em uma oportunidade

---

## 🌐 Endpoints da API

### **1. Buscar todas as notificações**
```http
GET /notifications
Authorization: Bearer {token}
```

**Resposta 200:**
```json
[
  {
    "id": 1,
    "type": "APPLICATION_APPROVED",
    "title": "Inscrição aprovada! 🎉",
    "message": "Sua inscrição em \"Aulas de Violão\" foi aprovada!",
    "cardId": 10,
    "read": false,
    "createdAt": "2025-10-18T20:30:00.000Z"
  },
  {
    "id": 2,
    "type": "NEW_OPPORTUNITY",
    "title": "Nova oportunidade disponível!",
    "message": "A oportunidade \"Plantio de Árvores\" foi criada e combina com suas habilidades.",
    "cardId": 15,
    "read": true,
    "createdAt": "2025-10-17T14:20:00.000Z"
  }
]
```

---

### **2. Contar notificações não lidas**
```http
GET /notifications/unread-count
Authorization: Bearer {token}
```

**Resposta 200:**
```json
{
  "count": 3
}
```

**Uso recomendado:** Consultar a cada 30-60 segundos para atualizar badge do sino.

---

### **3. Marcar notificação como lida**
```http
PATCH /notifications/:id/read
Authorization: Bearer {token}
```

**Resposta 200:**
```json
{
  "id": 1,
  "read": true
}
```

**Erro 400:**
```json
{
  "message": "Notificação não encontrada"
}
```

---

### **4. Marcar todas como lidas**
```http
PATCH /notifications/mark-all-read
Authorization: Bearer {token}
```

**Resposta 200:**
```json
{
  "message": "Todas as notificações foram marcadas como lidas"
}
```

---

### **5. Deletar notificação**
```http
DELETE /notifications/:id
Authorization: Bearer {token}
```

**Resposta 204:** (sem corpo)

**Erro 400:**
```json
{
  "message": "Notificação não encontrada"
}
```

---

## 💡 Implementação no Frontend

### **1. Hook React para Notificações**

```typescript
// hooks/useNotifications.ts
import { useState, useEffect } from 'react';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  cardId?: number;
  read: boolean;
  createdAt: string;
}

export function useNotifications(token: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Buscar notificações
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar contador de não lidas
  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/notifications/unread-count', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Erro ao buscar contador:', error);
    }
  };

  // Marcar como lida
  const markAsRead = async (id: number) => {
    try {
      await fetch(`/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Atualiza estado local
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  // Marcar todas como lidas
  const markAllAsRead = async () => {
    try {
      await fetch('/notifications/mark-all-read', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Erro ao marcar todas:', error);
    }
  };

  // Deletar notificação
  const deleteNotification = async (id: number) => {
    try {
      await fetch(`/notifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(prev => prev.filter(n => n.id !== id));
      await fetchUnreadCount(); // Recarrega contador
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  // Polling automático do contador (a cada 30s)
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [token]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}
```

---

### **2. Componente de Badge de Notificações**

```tsx
// components/NotificationBadge.tsx
import { useNotifications } from '../hooks/useNotifications';

export function NotificationBadge({ token }: { token: string }) {
  const { unreadCount } = useNotifications(token);

  return (
    <button className="relative">
      <BellIcon className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}
```

---

### **3. Componente de Lista de Notificações**

```tsx
// components/NotificationList.tsx
import { useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { useNavigate } from 'react-router-dom';

export function NotificationList({ token }: { token: string }) {
  const navigate = useNavigate();
  const {
    notifications,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications(token);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    // Marca como lida
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navega para o card se existir
    if (notification.cardId) {
      navigate(`/cards/${notification.cardId}`);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="notification-list">
      <div className="header">
        <h2>Notificações</h2>
        <button onClick={markAllAsRead}>Marcar todas como lidas</button>
      </div>

      {notifications.length === 0 ? (
        <p>Nenhuma notificação</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={notification.read ? 'read' : 'unread'}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="content">
                <strong>{notification.title}</strong>
                <p>{notification.message}</p>
                <small>{new Date(notification.createdAt).toLocaleString()}</small>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notification.id);
                }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

## 🎨 Exemplos de Mensagens por Tipo

### **NEW_OPPORTUNITY**
```
Título: "Nova oportunidade disponível!"
Mensagem: "A oportunidade \"Aulas de Violão\" foi criada e combina com suas habilidades."
```

### **NEW_APPLICATION**
```
Título: "Nova inscrição recebida"
Mensagem: "João Silva se inscreveu em \"Aulas de Violão\"."
```

### **APPLICATION_APPROVED**
```
Título: "Inscrição aprovada! 🎉"
Mensagem: "Sua inscrição em \"Aulas de Violão\" foi aprovada!"
```

### **APPLICATION_REJECTED**
```
Título: "Inscrição não aprovada"
Mensagem: "Sua inscrição em \"Aulas de Violão\" não foi aprovada desta vez."
```

### **OPPORTUNITY_CANCELED**
```
Título: "Oportunidade cancelada"
Mensagem: "A oportunidade \"Aulas de Violão\" foi cancelada pela instituição."
```

---

## ⚡ Gatilhos Automáticos

As notificações são criadas automaticamente quando:

1. **Instituição cria oportunidade** → Todos voluntários com skills matching recebem
2. **Voluntário se inscreve** → Instituição dona do card recebe
3. **Instituição aprova inscrição** → Voluntário aprovado recebe
4. **Instituição rejeita inscrição** → Voluntário rejeitado recebe
5. **Instituição cancela oportunidade** → Todos voluntários confirmados recebem

---

## 🔒 Segurança

- ✅ Todas as rotas requerem autenticação JWT
- ✅ Usuário só pode ver/modificar suas próprias notificações
- ✅ `userId` e `userType` validados automaticamente via JWT

---

## 📱 Boas Práticas

### **Polling Inteligente:**
```typescript
// Atualiza contador a cada 30s quando app está ativo
useEffect(() => {
  const interval = setInterval(() => {
    if (document.visibilityState === 'visible') {
      fetchUnreadCount();
    }
  }, 30000);
  
  return () => clearInterval(interval);
}, []);
```

### **Notificação Visual:**
```typescript
// Mostrar toast quando receber nova notificação
useEffect(() => {
  const previousCount = prevUnreadCountRef.current;
  if (unreadCount > previousCount) {
    showToast('Nova notificação recebida!');
  }
  prevUnreadCountRef.current = unreadCount;
}, [unreadCount]);
```

### **Cache Local:**
```typescript
// Cachear notificações no localStorage
useEffect(() => {
  localStorage.setItem('notifications', JSON.stringify(notifications));
}, [notifications]);
```

---

## 🐛 Tratamento de Erros

```typescript
try {
  await markAsRead(id);
} catch (error) {
  if (error.response?.status === 401) {
    // Token expirado - redirecionar para login
    navigate('/login');
  } else if (error.response?.status === 400) {
    // Notificação não encontrada ou já deletada
    showToast('Notificação não encontrada');
  } else {
    // Erro de rede ou servidor
    showToast('Erro ao processar notificação');
  }
}
```

---

## ✅ Checklist de Implementação

- [ ] Criar hook `useNotifications`
- [ ] Implementar componente `NotificationBadge`
- [ ] Implementar componente `NotificationList`
- [ ] Configurar polling do contador
- [ ] Adicionar navegação ao clicar em notificação
- [ ] Implementar feedback visual (toasts/badges)
- [ ] Testar com múltiplos tipos de notificação
- [ ] Adicionar loading states
- [ ] Implementar tratamento de erros
- [ ] Adicionar analytics (opcional)

---

## 🚀 Próximas Melhorias (Futuras)

- [ ] WebSocket para notificações em tempo real
- [ ] Notificação "1 hora antes" via cron job
- [ ] Push notifications (PWA)
- [ ] Filtros por tipo de notificação
- [ ] Paginação de notificações antigas
