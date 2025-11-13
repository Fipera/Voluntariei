import { useState, useEffect, useRef } from 'react';
import api from '@/services/api';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  cardId?: number;
  read: boolean;
  createdAt: string;
}

export function useNotifications(token: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const prevUnreadCountRef = useRef(0);

  
  const fetchNotifications = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await api.get<Notification[]>('/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  
  const fetchUnreadCount = async () => {
    if (!token) return;
    try {
      const response = await api.get<{ count: number }>('/notifications/unread-count', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Erro ao buscar contador:', error);
    }
  };

  
  const markAsRead = async (id: number) => {
    if (!token) return;
    try {
      await api.patch(`/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  
  const markAllAsRead = async () => {
    if (!token) return;
    try {
      await api.patch('/notifications/mark-all-read', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Erro ao marcar todas:', error);
    }
  };

  
  const deleteNotification = async (id: number) => {
    if (!token) return;
    try {
      await api.delete(`/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const deletedNotification = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      
      
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  
  useEffect(() => {
    if (!token) return;
    
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); 
    
    return () => clearInterval(interval);
  }, [token]);

  
  useEffect(() => {
    prevUnreadCountRef.current = unreadCount;
  }, [unreadCount]);

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
