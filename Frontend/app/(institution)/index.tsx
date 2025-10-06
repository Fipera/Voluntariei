import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView, RefreshControl, StyleSheet, Image as RNImage, Pressable } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
// Using RN Image here to guarantee absolute fill cover like create-opportunity
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Bell, Calendar, Users, Check } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import api from '@/services/api';

type CardItem = {
  id: number;
  title: string;
  description?: string | null;
  banner?: string | null;
  startAt: string;
  endAt: string;
  isOnline: boolean;
  city?: string | null;
  state?: string | null;
  maxVolunteers: number;
  status: 'ACTIVE' | 'PENDING' | 'FINALIZED' | 'CANCELED';
  skills: string[];
  participantsCount: number;
};

type FilterKey = 'ALL' | 'ACTIVE' | 'PENDING' | 'FINALIZED' | 'CANCELED';

function StatusBadge({ status }: { status: 'ACTIVE' | 'PENDING' | 'FINALIZED' | 'CANCELED' }){
  const map = {
    ACTIVE: { label: 'Ativa', bg: '#1BAF71', icon: true },
    PENDING: { label: 'Pendente', bg: '#D97706', icon: false },
    FINALIZED: { label: 'Finalizada', bg: '#64748B', icon: false },
    CANCELED: { label: 'Cancelada', bg: '#DC2626', icon: false },
  } as const;
  const cfg = map[status];
  return (
    <HStack style={{ height:24, minWidth:100, paddingHorizontal:10, borderRadius:12, backgroundColor: cfg.bg, alignItems:'center', justifyContent:'center', gap:4 }}>
      {cfg.icon && <Check size={12} color="#fff" strokeWidth={2} />}
      <Text style={{ color:'#fff', fontFamily:'Nunito-Bold', fontSize:12 }}>{cfg.label}</Text>
    </HStack>
  );
}

export default function InstitutionHubScreen() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ filter?: string }>();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight ? useBottomTabBarHeight() : 70;

  const [cards, setCards] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterKey>('ALL');

  useEffect(() => {
    const incoming = (params?.filter || '').toUpperCase();
    if (incoming === 'ALL' || incoming === 'TODOS') {
      setFilter('ALL');
    } else if (incoming === 'ACTIVE' || incoming === 'PENDING' || incoming === 'FINALIZED' || incoming === 'CANCELED') {
      setFilter(incoming as FilterKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.filter]);

  async function loadCards() {
    if (!token) return;
    try {
      setLoading(true);
      const { data } = await api.get<CardItem[]>('/cards', { headers: { Authorization: `Bearer ${token}` } });
      setCards(Array.isArray(data) ? data : []);
    } catch (e: any) {
      // Fallback: simple alert, keep impersonal
      console.warn('Falha ao carregar vagas:', e?.message || e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const counts = useMemo(() => {
    return cards.reduce(
      (acc, c) => {
        if (c.status === 'ACTIVE') acc.ativas += 1;
        else if (c.status === 'PENDING') acc.pendentes += 1;
        else if (c.status === 'FINALIZED') acc.finalizadas += 1;
        else if (c.status === 'CANCELED') acc.canceladas += 1;
        return acc;
      },
      { ativas: 0, pendentes: 0, finalizadas: 0, canceladas: 0 }
    );
  }, [cards]);

  const filtered = useMemo(() => {
    if (filter === 'ALL') return cards;
    return cards.filter(c => c.status === filter);
  }, [cards, filter]);

  function formatDateRange(startISO: string, endISO: string) {
    const s = new Date(startISO);
    const e = new Date(endISO);
    const sDate = s.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    const eDate = e.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    return `${sDate} • ${eDate}`;
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCards();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top','left','right']}> 
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: insets.top + 8, paddingBottom: tabBarHeight + insets.bottom + 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <HStack style={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text style={{ fontSize: 24, fontFamily: 'Nunito-Bold', color: '#173663' }}>Minhas Vagas</Text>
          <Button style={{ height: 36, width: 36, borderRadius: 18, backgroundColor: '#E2E8F0', alignItems:'center', justifyContent:'center', padding:0 }}>
            <Bell size={18} color="#173663" />
          </Button>
        </HStack>

        {/* Stats */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 8 }} style={{ marginBottom: 16 }}>
          <HStack style={{ gap: 12 }}>
            <StatPill label="Ativas" value={counts.ativas} color="#16A34A" />
            <StatPill label="Pendentes" value={counts.pendentes} color="#D97706" />
            <StatPill label="Finalizadas" value={counts.finalizadas} color="#64748B" />
            <StatPill label="Canceladas" value={counts.canceladas} color="#DC2626" />
          </HStack>
        </ScrollView>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 8 }} style={{ marginBottom: 16 }}>
          <HStack style={{ gap: 8 }}>
            <FilterChip label="Todos" active={filter==='ALL'} onPress={() => setFilter('ALL')} />
            <FilterChip label="Ativas" active={filter==='ACTIVE'} onPress={() => setFilter('ACTIVE')} />
            <FilterChip label="Pendentes" active={filter==='PENDING'} onPress={() => setFilter('PENDING')} />
            <FilterChip label="Finalizadas" active={filter==='FINALIZED'} onPress={() => setFilter('FINALIZED')} />
            <FilterChip label="Canceladas" active={filter==='CANCELED'} onPress={() => setFilter('CANCELED')} />
          </HStack>
        </ScrollView>

        {loading ? (
          <VStack style={{ alignItems:'center', justifyContent:'center', paddingVertical: 40 }}>
            <Spinner />
          </VStack>
        ) : (
          <VStack style={{ gap: 16 }}>
            {filtered.length === 0 ? (
              <Text style={{ color:'#4B5563' }}>Nenhuma vaga para este filtro.</Text>
            ) : (
              filtered.map((c) => (
                <Pressable key={c.id} onPress={()=> router.push(`/(institution)/opportunity/${c.id}` as any)}>
                <VStack style={{ backgroundColor:'#fff', borderRadius:12, overflow:'hidden', borderWidth:1, borderColor:'#E5E7EB' }}>
                  <Box style={{ width:'100%', height:120, backgroundColor:'#e5e7eb', position:'relative' }}>
                    {c.banner ? (
                        <RNImage source={{ uri: c.banner }} style={StyleSheet.absoluteFillObject} resizeMode='cover' />
                    ) : null}
                  </Box>
                  <VStack style={{ padding:12, gap:8 }}>
                    <HStack style={{ alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
                      <Text style={{ flex:1, fontSize:16, fontFamily:'Nunito-Bold', color:'#111827' }} numberOfLines={2}>{c.title}</Text>
                      <StatusBadge status={c.status} />
                    </HStack>
                    <HStack style={{ alignItems:'center', gap:8 }}>
                      <Calendar size={16} color="#173663" />
                      <Text style={{ fontSize:12, color:'#334155' }}>{formatDateRange(c.startAt, c.endAt)}</Text>
                    </HStack>
                    <HStack style={{ alignItems:'center', gap:8 }}>
                      <Users size={16} color="#173663" />
                      <Text style={{ fontSize:12, color:'#334155' }}>{c.participantsCount}/{c.maxVolunteers}</Text>
                    </HStack>
                  </VStack>
                </VStack>
                </Pressable>
              ))
            )}
          </VStack>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatPill({ label, value, color }: { label: string; value: number; color: string }){
  return (
    <HStack style={{ gap:8, alignItems:'center', backgroundColor:'#F8FAFC', borderWidth:1, borderColor:'#E2E8F0', paddingHorizontal:12, paddingVertical:8, borderRadius:999 }}>
      <Box style={{ width:8, height:8, borderRadius:4, backgroundColor: color }} />
      <Text style={{ fontFamily:'Nunito-Bold', color:'#0F172A' }}>{label}</Text>
      <Text style={{ color:'#334155' }}>({value})</Text>
    </HStack>
  );
}

function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }){
  return (
    <Button onPress={onPress} style={{ paddingHorizontal:14, paddingVertical:8, height: 36, borderRadius:999, backgroundColor: active ? '#173663' : '#E2E8F0' }}>
      <Text style={{ fontFamily:'Nunito-Bold', color: active ? '#fff' : '#1F2937' }}>{label}</Text>
    </Button>
  );
}

function StatusTag({ status }: { status: 'ACTIVE' | 'PENDING' | 'FINALIZED' | 'CANCELED' }){
  const map = {
    ACTIVE: { label: 'Ativa', bg: '#DCFCE7', fg: '#166534' },
    PENDING: { label: 'Pendente', bg: '#FEF9C3', fg: '#92400E' },
    FINALIZED: { label: 'Finalizada', bg: '#E2E8F0', fg: '#0F172A' },
    CANCELED: { label: 'Cancelada', bg: '#FEE2E2', fg: '#991B1B' },
  } as const;
  const cfg = map[status];
  return (
    <HStack style={{ paddingHorizontal:10, paddingVertical:6, borderRadius:999, backgroundColor: cfg.bg, alignItems:'center' }}>
      <Text style={{ fontFamily:'Nunito-Bold', color: cfg.fg, fontSize:12 }}>{cfg.label}</Text>
    </HStack>
  );
}
