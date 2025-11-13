import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Pressable, StyleSheet, View } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Trash2, CheckCheck, Bell, BellOff } from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'expo-router';
import { useNotifications } from '@/hooks/useNotifications';
import { useFocusEffect } from '@react-navigation/native';

export default function NotificationsScreen() {
  const { token } = useAuth();
  const router = useRouter();
  const {
    notifications,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications(token);

  
  useFocusEffect(
    React.useCallback(() => {
      fetchNotifications();
    }, [token])
  );

  function handleNotificationClick(notification: any) {
    
    if (!notification.read) {
      markAsRead(notification.id);
    }

    
    if (notification.cardId) {
      router.push(`/(institution)/opportunity/${notification.cardId}?from=notifications` as any);
    }
  }

  function formatRelativeTime(dateStr: string) {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays}d atrás`;
    
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }

  function getNotificationIcon(type: string) {
    switch (type) {
      case 'NEW_APPLICATION':
        return '👤';
      default:
        return '📬';
    }
  }

  if (loading && notifications.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top', 'left', 'right', 'bottom']}>
        <VStack style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Spinner />
        </VStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top', 'left', 'right', 'bottom']}>
      
      <HStack style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#173663" />
        </Pressable>
        <Text style={styles.headerTitle}>Notificações</Text>
        <View style={{ width: 40 }} />
      </HStack>

      
      {notifications.some(n => !n.read) && (
        <HStack style={styles.actionBar}>
          <Button onPress={markAllAsRead} style={styles.markAllButton}>
            <CheckCheck size={16} color="#173663" />
            <Text style={styles.markAllText}>Marcar todas como lidas</Text>
          </Button>
        </HStack>
      )}

      
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
        {notifications.length === 0 ? (
          <VStack style={styles.emptyState}>
            <BellOff size={64} color="#B8B8B8" />
            <Text style={styles.emptyText}>Nenhuma notificação</Text>
            <Text style={styles.emptySubtext}>
              Você receberá notificações sobre suas demandas aqui
            </Text>
          </VStack>
        ) : (
          <VStack style={{ gap: 1 }}>
            {notifications.map((notification) => (
              <Pressable
                key={notification.id}
                onPress={() => handleNotificationClick(notification)}
                style={[
                  styles.notificationItem,
                  !notification.read && styles.notificationUnread
                ]}
              >
                <HStack style={{ flex: 1, gap: 12, alignItems: 'flex-start' }}>
                  
                  <Text style={styles.notificationEmoji}>
                    {getNotificationIcon(notification.type)}
                  </Text>

                  
                  <VStack style={{ flex: 1, gap: 4 }}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationMessage} numberOfLines={2}>
                      {notification.message}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {formatRelativeTime(notification.createdAt)}
                    </Text>
                  </VStack>

                  
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    style={styles.deleteButton}
                  >
                    <Trash2 size={18} color="#64748B" />
                  </Pressable>
                </HStack>

                
                {!notification.read && <View style={styles.unreadIndicator} />}
              </Pressable>
            ))}
          </VStack>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: '#173663',
    lineHeight: 27,
  },
  actionBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    height: 'auto',
  },
  markAllText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#173663',
  },
  notificationItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    position: 'relative',
  },
  notificationUnread: {
    backgroundColor: '#F0F9FF',
  },
  notificationEmoji: {
    fontSize: 32,
    lineHeight: 40,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#111827',
    lineHeight: 22,
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#4B5563',
    lineHeight: 19,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#9CA3AF',
    lineHeight: 16,
  },
  deleteButton: {
    padding: 8,
  },
  unreadIndicator: {
    position: 'absolute',
    left: 8,
    top: '50%',
    marginTop: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#6B7280',
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
