import React, { useEffect, useState, useMemo } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView, RefreshControl, StyleSheet, Image as RNImage, Pressable, TextInput, View } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import { Input, InputField } from '@/components/ui/input';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { Bell, Calendar, Users, Check, Search, MapPin } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import api from '@/services/api';
import { useNotifications } from '@/hooks/useNotifications';

type CardItem = {
  id: number;
  title: string;
  description?: string | null;
  banner?: string | null;
  startAt: string;
  duration: number; 
  isOnline: boolean;
  city?: string | null;
  state?: string | null;
  maxVolunteers: number;
  status: 'ACTIVE' | 'PENDING' | 'FINALIZED' | 'CANCELED';
  skills: string[];
  participantsCount?: number;
  institution?: string | null;
};

interface VoluntaryMeResponse {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string | null;
  city?: string | null;
  state?: string | null;
  skills?: string[] | null;
}

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

export default function VoluntaryHubScreen() {
  const { token } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight ? useBottomTabBarHeight() : 70;
  const { unreadCount } = useNotifications(token);

  const [userName, setUserName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CardItem[]>([]);
  const [recommended, setRecommended] = useState<CardItem[]>([]);
  const [allCards, setAllCards] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    async function loadUserName(){
      if(!token) return;
      try{
        const { data } = await api.get<VoluntaryMeResponse>('/voluntary/me', { headers: { Authorization: `Bearer ${token}` } });
        setUserName(data.name || 'Voluntário');
      }catch{}
    }
    loadUserName();
  }, [token]);

  
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [token])
  );

  async function loadData() {
    if (!token) return;
    try {
      setLoading(true);
      const [feedRes, allRes] = await Promise.all([
        api.get<CardItem[]>('/cards/feed', { headers: { Authorization: `Bearer ${token}` } }),
        api.get<CardItem[]>('/cards/all', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      console.log('Feed response:', feedRes.data);
      console.log('All cards response:', allRes.data);
      setRecommended(Array.isArray(feedRes.data) ? feedRes.data : []);
      setAllCards(Array.isArray(allRes.data) ? allRes.data : []);
    } catch (e: any) {
      console.warn('Falha ao carregar demandas:', e?.message || e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(query: string){
    setSearchQuery(query);
    if(!query.trim()){
      setSearchResults([]);
      return;
    }
    try{
      setSearchLoading(true);
      const { data } = await api.get<CardItem[]>(`/cards/search?q=${encodeURIComponent(query)}`, { headers: { Authorization: `Bearer ${token}` } });
      setSearchResults(Array.isArray(data) ? data : []);
    }catch{
      setSearchResults([]);
    }finally{
      setSearchLoading(false);
    }
  }

  function formatDateRange(startISO: string, endISO: string) {
    const s = new Date(startISO);
    const e = new Date(endISO);
    const sDate = s.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    const eDate = e.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    return `${sDate} • ${eDate}`;
  }

  function formatTimeRange(startISO: string, duration: number) {
    const s = new Date(startISO);
    const e = new Date(s.getTime() + duration * 60000);
    const sTime = s.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const eTime = e.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `${sTime} - ${eTime}`;
  }

  function formatSingleDate(dateISO: string) {
    const d = new Date(dateISO);
    const day = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return day;
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  
  
  const displayCards = useMemo(() => {
    if (searchQuery.trim()) {
      return searchResults;
    }
    
    
    const recommendedIds = new Set(recommended.map(c => c.id));
    return allCards.filter(c => !recommendedIds.has(c.id));
  }, [searchQuery, searchResults, allCards, recommended]);
  
  const showRecommended = !searchQuery.trim() && recommended.length > 0;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top','left','right']}> 
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: insets.top + 8, paddingBottom: tabBarHeight + insets.bottom + 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        
        <HStack style={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <Text style={{ fontSize: 30, fontFamily: 'Nunito-Bold', color: '#173663', lineHeight: 41 }}>Olá, {userName}</Text>
          <Pressable onPress={() => router.push('/(voluntary)/notifications')} style={{ position: 'relative' }}>
            <View style={{ height: 36, width: 36, borderRadius: 18, backgroundColor: '#E2E8F0', alignItems:'center', justifyContent:'center' }}>
              <Bell size={18} color="#173663" />
            </View>
            {unreadCount > 0 && (
              <View style={{ 
                position: 'absolute', 
                top: -4, 
                right: -4, 
                minWidth: 20, 
                height: 20, 
                borderRadius: 10, 
                backgroundColor: '#DC2626', 
                alignItems: 'center', 
                justifyContent: 'center',
                paddingHorizontal: 6
              }}>
                <Text style={{ color: '#FFFFFF', fontSize: 11, fontFamily: 'Nunito-Bold' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
          </Pressable>
        </HStack>

        <Text style={{ fontSize: 16, fontFamily: 'Nunito-Regular', color: '#000000', marginBottom: 16, lineHeight: 22 }}>Encontre a demanda certa e transforme vidas com suas habilidades</Text>

        
        <HStack style={{ backgroundColor:'#F9F9F9', borderRadius:12, paddingHorizontal:16, height:48, marginBottom:16, alignItems:'center', gap:12, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.25, shadowRadius:2, elevation:2 }}>
          <Search size={24} color="#173663" />
          <TextInput
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Buscar demanda"
            placeholderTextColor="#000000"
            style={{ flex:1, fontSize:16, fontFamily:'Nunito-Regular', color:'#000000', lineHeight:22 }}
          />
        </HStack>

        {loading ? (
          <VStack style={{ alignItems:'center', justifyContent:'center', paddingVertical: 40 }}>
            <Spinner />
          </VStack>
        ) : (
          <>
            
            {showRecommended && (
              <VStack style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 20, fontFamily: 'Nunito-Bold', color: '#173663', marginBottom: 16, lineHeight: 27 }}>Recomendados para Você</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 4 }}>
                  {recommended.slice(0, 5).map((c) => {
                    const participantsCount = c.participantsCount || 0;
                    const remainingSlots = c.maxVolunteers - participantsCount;
                    return (
                      <Pressable key={c.id} onPress={()=> router.push(`/(voluntary)/opportunity/${c.id}` as any)}>
                        <VStack style={{ width: 179, height:202, backgroundColor:'#FFFFFF', borderRadius:12, overflow:'hidden', shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.25, shadowRadius:2, elevation:2 }}>
                          <Box style={{ width:'100%', height:119, backgroundColor:'#e5e7eb', position:'relative' }}>
                            {c.banner ? (
                              <RNImage source={{ uri: c.banner }} style={StyleSheet.absoluteFillObject} resizeMode='cover' />
                            ) : null}
                          </Box>
                          <VStack style={{ flex:1, paddingHorizontal:11, paddingTop:5, paddingBottom:11, justifyContent:'space-between' }}>
                            <VStack style={{ gap:2 }}>
                              <Text style={{ fontSize:16, fontFamily:'Nunito-Bold', color:'#173663', lineHeight:22 }} numberOfLines={1}>{c.title}</Text>
                              {c.institution && (
                                <Text style={{ fontSize:12, fontFamily:'Nunito-Regular', color:'#B8B8B8', lineHeight:16 }} numberOfLines={1}>{c.institution}</Text>
                              )}
                            </VStack>
                            <HStack style={{ alignItems:'center', justifyContent:'space-between' }}>
                              <Text style={{ fontSize:10, fontFamily:'Nunito-Light', color:'#000000', lineHeight:14 }}>{participantsCount}/{c.maxVolunteers} vagas</Text>
                              <View style={{ backgroundColor:'#173663', paddingVertical:10, paddingHorizontal:10, borderRadius:12, justifyContent:'center', alignItems:'center' }}>
                                <Text style={{ color:'#FFFFFF', fontSize:12, fontFamily:'Nunito-Bold', lineHeight:16 }}>Ver mais</Text>
                              </View>
                            </HStack>
                          </VStack>
                        </VStack>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </VStack>
            )}

            
            <VStack style={{ gap: 12 }}>
              <Text style={{ fontSize: 20, fontFamily: 'Nunito-Bold', color: '#173663', lineHeight: 27 }}>
                {searchQuery.trim() ? 'Resultados da Busca' : 'Novas Demandas'}
              </Text>
              {searchLoading ? (
                <VStack style={{ alignItems:'center', paddingVertical: 20 }}>
                  <Spinner />
                </VStack>
              ) : displayCards.length === 0 ? (
                <Text style={{ color:'#64748B', textAlign:'center', paddingVertical:20 }}>
                  {searchQuery.trim() ? 'Nenhuma demanda encontrada' : 'Nenhuma demanda disponível'}
                </Text>
              ) : (
                displayCards.map((c) => {
                  const participantsCount = c.participantsCount || 0;
                  const remainingSlots = c.maxVolunteers - participantsCount;
                  return (
                    <Pressable key={c.id} onPress={()=> router.push(`/(voluntary)/opportunity/${c.id}` as any)}>
                      <HStack style={{ backgroundColor:'#FFFFFF', borderRadius:12, overflow:'hidden', height:140, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.25, shadowRadius:2, elevation:2 }}>
                        
                        <Box style={{ width:120, height:140, backgroundColor:'#e5e7eb', position:'relative' }}>
                          {c.banner ? (
                            <RNImage source={{ uri: c.banner }} style={StyleSheet.absoluteFillObject} resizeMode='cover' />
                          ) : null}
                        </Box>
                        
                        <VStack style={{ flex:1, padding:16, paddingRight:12, justifyContent:'space-between' }}>
                          <VStack style={{ gap:2 }}>
                            <Text style={{ fontSize:16, fontFamily:'Nunito-Bold', color:'#173663', lineHeight:22 }} numberOfLines={1}>{c.title}</Text>
                            <HStack style={{ alignItems:'center', gap:6 }}>
                              <Text style={{ fontSize:12, fontFamily:'Nunito-Regular', color:'#B8B8B8', lineHeight:16 }} numberOfLines={1}>
                                {c.institution || ''}
                              </Text>
                              <Text style={{ fontSize:12, fontFamily:'Nunito-Regular', color:'#B8B8B8', lineHeight:16 }} numberOfLines={1}>
                                {formatSingleDate(c.startAt).split('/').slice(0,2).join('/')} - {formatTimeRange(c.startAt, c.duration).split(' - ')[0]}
                              </Text>
                            </HStack>
                          </VStack>
                          <VStack style={{ gap:8 }}>
                            <HStack style={{ alignItems:'center', gap:6 }}>
                              <MapPin size={12} color="#173663" />
                              <Text style={{ fontSize:12, fontFamily:'Nunito-Regular', color:'#B8B8B8', lineHeight:16 }} numberOfLines={1}>
                                {c.isOnline ? 'Online' : `${c.city || ''}-${c.state || ''}`}
                              </Text>
                            </HStack>
                            <HStack style={{ alignItems:'center', justifyContent:'space-between' }}>
                              <Text style={{ fontSize:10, fontFamily:'Nunito-Bold', color:'#173663', lineHeight:14 }}>
                                {remainingSlots} {remainingSlots === 1 ? 'demanda restante' : 'vagas restantes'}
                              </Text>
                              <View style={{ backgroundColor:'#173663', paddingVertical:10, paddingHorizontal:10, borderRadius:12, justifyContent:'center', alignItems:'center' }}>
                                <Text style={{ color:'#FFFFFF', fontSize:12, fontFamily:'Nunito-Bold', lineHeight:16 }}>Ver mais</Text>
                              </View>
                            </HStack>
                          </VStack>
                        </VStack>
                      </HStack>
                    </Pressable>
                  );
                })
              )}
            </VStack>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
