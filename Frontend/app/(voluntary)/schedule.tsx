import React, { useEffect, useState, useMemo } from 'react';
import { ScrollView, Pressable, StyleSheet, Image as RNImage } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { Spinner } from '@/components/ui/spinner';
import { Calendar, Clipboard, Check, Clock } from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import api from '@/services/api';

type ParticipationStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED';
type CardStatus = 'ACTIVE' | 'PENDING' | 'FINALIZED' | 'CANCELED';

interface Commitment {
  id: number;
  status: ParticipationStatus;
  card: {
    id: number;
    title: string;
    banner?: string | null;
    startAt: string;
    duration: number;
    status: CardStatus;
    institution?: string;
  };
}

interface HistoryItem {
  id: number;
  status: ParticipationStatus;
  card: {
    id: number;
    title: string;
    startAt: string;
    duration: number;
    status: CardStatus;
    institution?: string;
  };
}

interface DayData {
  dayOfWeek: string;
  dayNumber: number;
  date: Date;
  hasConfirmed: boolean;
  hasPending: boolean;
}

export default function VoluntaryScheduleScreen() {
  const { token } = useAuth();
  const router = useRouter();
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [token])
  );

  async function loadData() {
    if (!token) return;
    try {
      setLoading(true);
      const [commitmentsRes, historyRes] = await Promise.all([
        api.get<Commitment[]>('/participations/commitments', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get<HistoryItem[]>('/participations/history', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setCommitments(commitmentsRes.data);
      setHistory(historyRes.data);
    } catch (error) {
      console.error('Error loading schedule:', error);
    } finally {
      setLoading(false);
    }
  }

  
  const calendarDays = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: DayData[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayCommitments = commitments.filter((c) => {
        const cardDate = new Date(c.card.startAt);
        return (
          cardDate.getDate() === day &&
          cardDate.getMonth() === month &&
          cardDate.getFullYear() === year
        );
      });

      days.push({
        dayOfWeek: date.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase(),
        dayNumber: day,
        date,
        hasConfirmed: dayCommitments.some((c) => c.status === 'CONFIRMED'),
        hasPending: dayCommitments.some((c) => c.status === 'PENDING'),
      });
    }

    return days;
  }, [commitments]);

  
  const currentMonthHistory = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return history.filter((item) => {
      const itemDate = new Date(item.card.startAt);
      return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
    });
  }, [history]);

  
  const selectedDayCommitments = useMemo(() => {
    return commitments.filter((c) => {
      const cardDate = new Date(c.card.startAt);
      return (
        cardDate.getDate() === selectedDate.getDate() &&
        cardDate.getMonth() === selectedDate.getMonth() &&
        cardDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  }, [commitments, selectedDate]);

  function formatDateTime(dateStr: string) {
    try {
      const d = new Date(dateStr);
      const weekday = d.toLocaleDateString('pt-BR', { weekday: 'short' });
      const date = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      return `${weekday}, ${date} - ${time}h`;
    } catch (e) {
      return dateStr;
    }
  }

  function formatDateTimeWithDuration(dateStr: string, duration: number) {
    try {
      const start = new Date(dateStr);
      const end = new Date(start.getTime() + duration * 60000);
      
      const weekday = start.toLocaleDateString('pt-BR', { weekday: 'short' });
      const date = start.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      const startTime = start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const endTime = end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      return `${weekday}., ${date} - ${startTime}h`;
    } catch (e) {
      return dateStr;
    }
  }

  function formatTimeRange(dateStr: string, duration: number) {
    try {
      const start = new Date(dateStr);
      const end = new Date(start.getTime() + duration * 60000);
      
      const startTime = start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const endTime = end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      return `${startTime}h - ${endTime}h`;
    } catch (e) {
      return '';
    }
  }

  function formatDateTimeRange(dateStr: string, duration: number) {
    try {
      const start = new Date(dateStr);
      const end = new Date(start.getTime() + duration * 60000);
      
      const startDate = start.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      const startTime = start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      const endDate = end.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      const endTime = end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      return {
        start: `${startDate} - ${startTime}h`,
        end: `${endDate} - ${endTime}h`
      };
    } catch (e) {
      return { start: '', end: '' };
    }
  }

  function formatFullDate(dateStr: string) {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  }

  function getStatusColor(participation: HistoryItem) {
    
    if (participation.status === 'REJECTED') return '#F98B26';
    
    if (participation.card.status === 'CANCELED') return '#E43A3A';
    
    if (participation.status === 'CONFIRMED' || participation.card.status === 'FINALIZED') return '#1BAF71';
    return '#B8B8B8';
  }

  function getStatusLabel(participation: HistoryItem) {
    if (participation.status === 'REJECTED') return 'Reprovada';
    if (participation.card.status === 'CANCELED') return 'Cancelada';
    if (participation.card.status === 'FINALIZED') return 'Finalizada';
    return 'Finalizada';
  }

  if (loading) {
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
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        
        <HStack style={styles.sectionTitle}>
          <Calendar size={20} color="#173663" />
          <Text style={styles.titleText}>Meus compromissos</Text>
        </HStack>

        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.calendarScroll}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
        >
          {calendarDays.map((day) => {
            const isSelected =
              day.date.getDate() === selectedDate.getDate() &&
              day.date.getMonth() === selectedDate.getMonth();
            return (
              <Pressable
                key={day.dayNumber}
                onPress={() => setSelectedDate(day.date)}
                style={[styles.dayContainer, isSelected && styles.daySelected]}
              >
                <Text style={[styles.dayOfWeek, isSelected && styles.dayOfWeekSelected]}>
                  {day.dayOfWeek}
                </Text>
                <Text style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}>
                  {String(day.dayNumber).padStart(2, '0')}
                </Text>
                
                {(day.hasConfirmed || day.hasPending) && (
                  <HStack style={styles.indicatorContainer}>
                    {day.hasConfirmed && <Box style={[styles.indicator, { backgroundColor: '#1BAF71' }]} />}
                    {day.hasPending && <Box style={[styles.indicator, { backgroundColor: '#F98B26' }]} />}
                  </HStack>
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        
        <VStack style={{ paddingHorizontal: 20, gap: 16, marginTop: 16 }}>
          {selectedDayCommitments.length > 0 ? (
            selectedDayCommitments.map((commitment) => (
              <Pressable
                key={commitment.id}
                onPress={() => router.push(`/(voluntary)/opportunity/${commitment.card.id}?from=schedule`)}
                style={styles.commitmentCard}
              >
                
                {commitment.card.banner ? (
                  <Box style={styles.cardBanner}>
                    <RNImage 
                      source={{ uri: commitment.card.banner }} 
                      style={{ width: '100%', height: '100%' }} 
                      resizeMode="cover" 
                    />
                  </Box>
                ) : (
                  <Box style={[styles.cardBanner, { backgroundColor: '#e5e7eb' }]} />
                )}

                
                <Box style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {commitment.card.title}
                  </Text>
                  
                  <VStack style={{ gap: 2, marginTop: 6 }}>
                    <Text style={styles.cardSubtitle} numberOfLines={1}>
                      {commitment.card.institution || 'Instituição'}
                    </Text>
                    <Text style={styles.cardDateTime}>
                      Início: {formatDateTimeRange(commitment.card.startAt, commitment.card.duration).start}
                    </Text>
                    <Text style={styles.cardDateTime}>
                      Fim: {formatDateTimeRange(commitment.card.startAt, commitment.card.duration).end}
                    </Text>
                  </VStack>

                  
                  <HStack
                    style={[
                      styles.statusBadge,
                      { backgroundColor: commitment.status === 'CONFIRMED' ? '#1BAF71' : '#F98B26' },
                    ]}
                  >
                    {commitment.status === 'CONFIRMED' ? (
                      <Check size={12} color="#FFFFFF" />
                    ) : (
                      <Clock size={12} color="#FFFFFF" />
                    )}
                    <Text style={styles.statusText}>
                      {commitment.status === 'CONFIRMED' ? 'Confirmada' : 'Pendente'}
                    </Text>
                  </HStack>
                </Box>
              </Pressable>
            ))
          ) : (
            <Text style={{ textAlign: 'center', color: '#B8B8B8', marginVertical: 20 }}>
              Nenhum compromisso neste dia
            </Text>
          )}
        </VStack>

        
        <HStack style={[styles.sectionTitle, { marginTop: 32 }]}>
          <Clipboard size={20} color="#173663" />
          <Text style={styles.titleText}>Histórico do Mês</Text>
        </HStack>

        <ScrollView 
          style={{ maxHeight: 400, marginTop: 16 }}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={true}
        >
          <VStack style={{ paddingHorizontal: 20, gap: 16, paddingBottom: 16 }}>
            {currentMonthHistory.length > 0 ? (
              currentMonthHistory.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => router.push(`/(voluntary)/opportunity/${item.card.id}?from=schedule`)}
                  style={styles.historyCard}
                >
                  <HStack style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <Text style={[styles.cardTitle, { flex: 1 }]} numberOfLines={1}>
                      {item.card.title}
                    </Text>
                    <Text style={styles.historyDate}>{formatFullDate(item.card.startAt)}</Text>
                  </HStack>
                  <HStack style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 8, gap: 12 }}>
                    <Text style={[styles.cardSubtitle, { flex: 1 }]} numberOfLines={1}>
                      {item.card.institution || 'Instituição'}
                    </Text>
                    <Text style={[styles.historyStatus, { color: getStatusColor(item) }]}>
                      {getStatusLabel(item)}
                    </Text>
                  </HStack>
                </Pressable>
              ))
            ) : (
              <Text style={{ textAlign: 'center', color: '#B8B8B8', marginVertical: 20 }}>
                Nenhum histórico este mês
              </Text>
            )}
          </VStack>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    paddingHorizontal: 20,
    paddingTop: 28,
    gap: 12,
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 32,
    lineHeight: 44,
    color: '#173663',
  },
  calendarScroll: {
    marginTop: 12,
  },
  dayContainer: {
    width: 48,
    height: 63,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 4,
    position: 'relative',
  },
  daySelected: {
    backgroundColor: '#173663',
    borderRadius: 8,
    paddingVertical: 4,
  },
  dayOfWeek: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    lineHeight: 19,
    color: '#B8B8B8',
    textAlign: 'center',
  },
  dayOfWeekSelected: {
    color: '#FFFFFF',
  },
  dayNumber: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    lineHeight: 22,
    color: '#B8B8B8',
    textAlign: 'center',
  },
  dayNumberSelected: {
    color: '#FFFFFF',
  },
  indicatorContainer: {
    flexDirection: 'row',
    gap: 4,
    position: 'absolute',
    bottom: 4,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  commitmentCard: {
    width: '100%',
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
  cardBanner: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    lineHeight: 22,
    color: '#173663',
  },
  cardSubtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: '#B8B8B8',
  },
  cardDateTime: {
    fontFamily: 'Nunito-Regular',
    fontSize: 11,
    lineHeight: 15,
    color: '#64748B',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    gap: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    lineHeight: 16,
    color: '#FFFFFF',
  },
  historyCard: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
  historyDate: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: '#000000',
  },
  historyStatus: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    lineHeight: 16,
  },
});
