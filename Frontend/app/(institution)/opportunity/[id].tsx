import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView, View, StyleSheet, Image as RNImage, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import { Spinner } from '@/components/ui/spinner';
import { Calendar, ChevronLeft, MapPin, Tag, Check, Users, Clock, X } from 'lucide-react-native';
import api from '@/services/api';
import { useAuth } from '@/providers/AuthProvider';
import { SKILL_IMAGE_MAP, DEFAULT_SKILL_IMAGE } from '@/utils/constants/voluntarySkillImages';
import { SKILL_GROUPS } from '@/utils/constants/voluntarySkills';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

interface CardDetail {
  id: number;
  title: string;
  description?: string;
  banner?: string | null;
  startAt: string;
  duration: number; // em minutos
  createdAt?: string;
  isOnline: boolean;
  cep?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  numberHouse?: string;
  street?: string;
  complement?: string;
  locationNote?: string;
  maxVolunteers: number;
  status: 'ACTIVE' | 'PENDING' | 'FINALIZED' | 'CANCELED';
  skills: string[];
  participants?: Participant[];
  participantsCount?: number;
}

interface Participant {
  id: number;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  observation?: string;
  voluntary: {
    id: number;
    name: string;
    city?: string;
    state?: string;
    skills?: Array<{ skill: string }>;
  };
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

function formatDate(dt: string){
  const d = new Date(dt);
  const date = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const time = d.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
  return `${date} - ${time}`;
}

function calculateEndDate(startAt: string, duration: number): string {
  const start = new Date(startAt);
  const end = new Date(start.getTime() + duration * 60000); // duration em minutos
  return end.toISOString();
}

export default function OpportunityDetail(){
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight ? useBottomTabBarHeight() : 70;

  const [data, setData] = useState<CardDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'subscriptions'>('details');
  const [isCancelling, setIsCancelling] = useState(false);
  const [subscriptionFilter, setSubscriptionFilter] = useState<'all' | 'pending' | 'confirmed'>('all');
  const [expandedObservation, setExpandedObservation] = useState<{[key: number]: boolean}>({});

  function handleBack() {
    // Se conseguir voltar, volta. Senão, vai para o hub
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(institution)');
    }
  }

  // wait until backend reflects canceled status
  async function waitForCancellation(maxTries = 14, delayMs = 900){
    for (let i=0; i<maxTries; i++){
      try{
        const { data: d } = await api.get<CardDetail>(`/cards/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (d?.status === 'CANCELED') return true;
      }catch{}
      await new Promise(res=> setTimeout(res, delayMs));
    }
    return false;
  }

  const load = async () => {
    if(!token || !id) return;
    try{
      setLoading(true);
      const { data } = await api.get<CardDetail>(`/cards/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setData(data);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token, id]);

  function formatDate(dt: string){
    const d = new Date(dt);
    const date = d.toLocaleDateString('pt-BR');
    const time = d.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
    return `${date} - ${time}`;
  }

  const address = useMemo(()=>{
    const p = [] as string[];
    if(data?.street) p.push(data.street);
    if(data?.numberHouse) p.push(data.numberHouse);
    if(data?.neighborhood) p.push(data.neighborhood);
    const cityState = [data?.city, data?.state].filter(Boolean).join(', ');
    if(cityState) p.push(cityState);
    if(data?.cep) p.push(data.cep);
    return p.join(', ');
  }, [data]);

  const filteredParticipants = useMemo(() => {
    if (!data?.participants) return [];
    // Filtra apenas PENDING e CONFIRMED (exclui REJECTED)
    const activeParticipants = data.participants.filter(p => p.status !== 'REJECTED');
    
    if (subscriptionFilter === 'all') return activeParticipants;
    if (subscriptionFilter === 'pending') return activeParticipants.filter(p => p.status === 'PENDING');
    if (subscriptionFilter === 'confirmed') return activeParticipants.filter(p => p.status === 'CONFIRMED');
    return activeParticipants;
  }, [data?.participants, subscriptionFilter]);

  // Verifica se a vaga está em andamento ou já terminou
  const opportunityState = useMemo(() => {
    if (!data) return { isFinalized: false, isInProgress: false, isStarted: false };
    
    const now = new Date();
    const startDate = new Date(data.startAt);
    const endDate = new Date(startDate.getTime() + data.duration * 60000);
    
    const isStarted = now >= startDate;
    const isFinalized = now >= endDate;
    const isInProgress = isStarted && !isFinalized;
    
    return { isFinalized, isInProgress, isStarted };
  }, [data]);

  // cancel handler
  const handleCancel = async () => {
    Alert.alert(
      'Cancelar Vaga',
      'Tem certeza que deseja cancelar esta vaga? Esta ação não pode ser desfeita.',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsCancelling(true);
              await api.post(`/cards/${id}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
              });
              router.back();
            } catch (error: any) {
              Alert.alert('Erro', error.response?.data?.message || 'Não foi possível cancelar a vaga.');
            } finally {
              setIsCancelling(false);
            }
          },
        },
      ]
    );
  };

  const handleApprove = async (participationId: number) => {
    try {
      await api.post(`/participations/${participationId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Sucesso', 'Inscrição confirmada!');
      load(); // Reload to update list
    } catch (error: any) {
      console.error('Erro ao aprovar:', error);
      Alert.alert('Erro', error.response?.data?.message || 'Não foi possível confirmar a inscrição.');
    }
  };

  const handleReject = async (participationId: number) => {
    Alert.alert(
      'Recusar Inscrição',
      'Tem certeza que deseja recusar esta inscrição?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Recusar',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.post(`/participations/${participationId}/reject`, {}, {
                headers: { Authorization: `Bearer ${token}` }
              });
              Alert.alert('Sucesso', 'Inscrição recusada.');
              load(); // Reload to update list
            } catch (error: any) {
              console.error('Erro ao recusar:', error);
              Alert.alert('Erro', error.response?.data?.message || 'Não foi possível recusar a inscrição.');
            }
          },
        },
      ]
    );
  };

  if(loading){
    return (
      <SafeAreaView style={{ flex:1 }} edges={['top','left','right']}>
        <VStack style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
          <Spinner />
        </VStack>
      </SafeAreaView>
    )
  }

  if(!data){
    return null;
  }

  return (
    <SafeAreaView style={{ flex:1 }} edges={['top','left','right']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal:20, paddingTop: insets.top + 8, paddingBottom: (tabBarHeight || 70) + 24 }}>
        {/* Header */}
        <HStack style={{ alignItems:'center', gap:8, marginBottom:16 }}>
          <Pressable onPress={handleBack} hitSlop={10} style={{ padding:6 }}>
            <ChevronLeft size={22} color="#173663" />
          </Pressable>
          <Text style={{ fontSize:22, lineHeight:30, fontFamily:'Nunito-Bold', color:'#173663' }}>Gerenciamento da Vaga</Text>
        </HStack>

        {/* Mini Card */}
        <HStack style={{ gap:12, backgroundColor:'#fff', borderRadius:12, overflow:'hidden', borderWidth:1, borderColor:'#E5E7EB', padding:10, elevation:2, shadowColor:'#000', shadowOpacity:0.1, shadowRadius:4 }}>
          <Box style={{ width:140, height:84, borderRadius:8, overflow:'hidden', backgroundColor:'#e5e7eb' }}>
            {data.banner ? (
              <RNImage source={{ uri: data.banner }} style={StyleSheet.absoluteFillObject} resizeMode='cover' />
            ) : null}
          </Box>
          <VStack style={{ flex:1, justifyContent:'space-between', paddingVertical:4 }}>
            <Text style={{ fontSize:18, fontFamily:'Nunito-Bold', color:'#173663' }} numberOfLines={1}>{data.title}</Text>
            {data.createdAt && (
              <Text style={{ fontSize:12, color:'#64748B' }}>Criado: {new Date(data.createdAt).toLocaleDateString('pt-BR')}</Text>
            )}
            <HStack style={{ justifyContent:'flex-start' }}>
              <StatusBadge status={data.status} />
            </HStack>
          </VStack>
        </HStack>

        {/* Tabs header 50/50 */}
        <VStack style={{ marginTop:20, marginBottom:12 }}>
          <HStack style={{ alignItems:'center' }}>
            <Pressable onPress={()=> setActiveTab('details')} style={{ flex:1, alignItems:'center', paddingVertical:8 }}>
              <Text style={{ fontSize:20, lineHeight:27, fontFamily:'Nunito-Bold', color:'#173663' }}>Detalhes</Text>
            </Pressable>
            <Pressable onPress={()=> setActiveTab('subscriptions')} style={{ flex:1, alignItems:'center', paddingVertical:8 }}>
              <Text style={{ fontSize:20, lineHeight:27, fontFamily:'Nunito-Bold', color:'#173663' }}>Inscrições</Text>
            </Pressable>
          </HStack>
          <HStack>
            <Box style={{ height:1, width:'50%', backgroundColor: activeTab==='details' ? '#173663' : '#B7B7B7' }} />
            <Box style={{ height:1, width:'50%', backgroundColor: activeTab==='subscriptions' ? '#173663' : '#B7B7B7' }} />
          </HStack>
        </VStack>

        {/* Content */}
        {activeTab === 'details' ? (
        <VStack style={{ gap:20 }}>
          {/* Datas */}
          <VStack style={{ gap:8 }}>
            <HStack style={{ gap:8, alignItems:'center' }}>
              <Calendar size={18} color="#173663" />
              <Text style={{ fontSize:18, fontFamily:'Nunito-Bold', color:'#173663' }}>Datas</Text>
            </HStack>
            <Text style={{ color:'#1F2937' }}>{formatDate(data.startAt)}</Text>
            <Text style={{ color:'#1F2937' }}>{data.duration ? formatDate(calculateEndDate(data.startAt, data.duration)) : ''}</Text>
          </VStack>

          {/* Local */}
          <VStack style={{ gap:8 }}>
            <HStack style={{ gap:8, alignItems:'center' }}>
              <MapPin size={18} color="#173663" />
              <Text style={{ fontSize:18, fontFamily:'Nunito-Bold', color:'#173663' }}>Local</Text>
            </HStack>
            <Text style={{ color:'#1F2937' }}>{data.isOnline ? 'Online' : address}</Text>
            
            {/* Complemento */}
            {!data.isOnline && data.complement && (
              <VStack style={{ gap:4, marginTop:8, paddingLeft:26 }}>
                <Text style={{ fontSize:14, fontFamily:'Nunito-SemiBold', color:'#173663' }}>Complemento:</Text>
                <Text style={{ color:'#1F2937', fontSize:14 }}>{data.complement}</Text>
              </VStack>
            )}
            
            {/* Observação do local */}
            {!data.isOnline && data.locationNote && (
              <VStack style={{ gap:4, marginTop:8, paddingLeft:26 }}>
                <Text style={{ fontSize:14, fontFamily:'Nunito-SemiBold', color:'#173663' }}>Como chegar:</Text>
                <Text style={{ color:'#1F2937', fontSize:14 }}>{data.locationNote}</Text>
              </VStack>
            )}
          </VStack>

          {/* Descrição */}
          {data.description && (
            <VStack style={{ gap:8 }}>
              <HStack style={{ gap:8, alignItems:'center' }}>
                <Tag size={18} color="#173663" />
                <Text style={{ fontSize:18, fontFamily:'Nunito-Bold', color:'#173663' }}>Descrição</Text>
              </HStack>
              <Text style={{ color:'#1F2937' }}>{data.description}</Text>
            </VStack>
          )}

          {/* Habilidades */}
          {!!data.skills?.length && (
            <VStack style={{ gap:8 }}>
              <Text style={{ fontSize:18, fontFamily:'Nunito-Bold', color:'#173663' }}>Habilidades</Text>
              <HStack style={{ gap:16, flexWrap:'wrap' }}>
                {data.skills.map((s)=> {
                  const img = SKILL_IMAGE_MAP[s] || DEFAULT_SKILL_IMAGE;
                  const label = SKILL_GROUPS.flatMap(g=> g.skills).find(k=> k.value === s)?.label || s;
                  return (
                    <VStack key={s} style={{ width:74, alignItems:'center' }}>
                      <RNImage source={img} style={{ width: 62, height: 62, borderRadius: 9999 }} />
                      <Text style={{ marginTop:6, fontSize:12, color:'#1A202C', textAlign:'center' }} numberOfLines={2}>{label}</Text>
                    </VStack>
                  );
                })}
              </HStack>
            </VStack>
          )}

          {/* Status ou botão de cancelar */}
          {data.status === 'CANCELED' ? (
            <Box style={{ backgroundColor:'#FEE2E2', borderRadius:12, paddingVertical:12, paddingHorizontal:16, marginTop:8 }}>
              <HStack style={{ alignItems:'center', justifyContent:'center', gap:8 }}>
                <X size={18} color="#DC2626" strokeWidth={2} />
                <Text style={{ color:'#DC2626', fontFamily:'Nunito-Bold', fontSize:16 }}>Esta vaga foi cancelada</Text>
              </HStack>
            </Box>
          ) : data.status === 'FINALIZED' || opportunityState.isFinalized ? (
            <Box style={{ backgroundColor:'#E2E8F0', borderRadius:12, paddingVertical:12, paddingHorizontal:16, marginTop:8 }}>
              <HStack style={{ alignItems:'center', justifyContent:'center', gap:8 }}>
                <Check size={18} color="#64748B" strokeWidth={2} />
                <Text style={{ color:'#64748B', fontFamily:'Nunito-Bold', fontSize:16 }}>Vaga finalizada</Text>
              </HStack>
            </Box>
          ) : opportunityState.isInProgress ? (
            <Box style={{ backgroundColor:'#FEF9C3', borderRadius:12, paddingVertical:12, paddingHorizontal:16, marginTop:8 }}>
              <HStack style={{ alignItems:'center', justifyContent:'center', gap:8 }}>
                <Clock size={18} color="#D97706" strokeWidth={2} />
                <Text style={{ color:'#D97706', fontFamily:'Nunito-Bold', fontSize:16 }}>Vaga em andamento</Text>
              </HStack>
            </Box>
          ) : (
            <Button onPress={handleCancel} disabled={isCancelling} style={{ backgroundColor:'#DC2626', height:44, borderRadius:12, marginTop:8, opacity: isCancelling ? 0.8 : 1 }}>
              <Text style={{ color:'#fff', fontFamily:'Nunito-Bold' }}>{isCancelling ? 'Cancelando...' : 'Cancelar Vaga'}</Text>
            </Button>
          )}
        </VStack>
        ) : (
          <VStack style={{ gap:16 }}>
            {/* Header - Número de Inscritos */}
            <HStack 
              style={{ 
                alignItems:'center', 
                paddingVertical:20,
                paddingHorizontal:32,
                gap:16,
                backgroundColor:'#FFFFFF',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 2,
                elevation: 3,
                borderRadius:12,
              }}
            >
              <View style={{ 
                width:40, 
                height:40, 
                backgroundColor:'#1BAF71', 
                borderRadius:4,
                alignItems:'center',
                justifyContent:'center'
              }}>
                <Users size={24} color="#FFFFFF" strokeWidth={2} />
              </View>
              <Text style={{ 
                fontSize:24, 
                fontFamily:'Nunito-Bold', 
                color:'#000000',
              }}>
                Inscritos: {data?.participantsCount ?? 0}/{data?.maxVolunteers || 0}
              </Text>
            </HStack>

            {/* Filtros */}
            <HStack style={{ gap:12, justifyContent:'center', alignItems:'center', flexWrap:'wrap' }}>
              <Pressable
                onPress={() => setSubscriptionFilter('all')}
                style={{
                  paddingVertical:8,
                  paddingHorizontal:16,
                  minWidth:100,
                  borderRadius:12,
                  backgroundColor: subscriptionFilter === 'all' ? '#173663' : '#FFFFFF',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 2,
                  elevation: 3,
                  justifyContent:'center',
                  alignItems:'center',
                }}
              >
                <Text style={{ 
                  fontFamily:'Nunito-Bold', 
                  fontSize:16,
                  color: subscriptionFilter === 'all' ? '#FFFFFF' : '#173663' 
                }}>
                  Todas
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setSubscriptionFilter('pending')}
                style={{
                  paddingVertical:8,
                  paddingHorizontal:16,
                  minWidth:100,
                  borderRadius:12,
                  backgroundColor: subscriptionFilter === 'pending' ? '#173663' : '#FFFFFF',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 2,
                  elevation: 3,
                  justifyContent:'center',
                  alignItems:'center',
                }}
              >
                <Text style={{ 
                  fontFamily:'Nunito-Bold', 
                  fontSize:16,
                  color: subscriptionFilter === 'pending' ? '#FFFFFF' : '#173663' 
                }}>
                  Pendentes
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setSubscriptionFilter('confirmed')}
                style={{
                  paddingVertical:8,
                  paddingHorizontal:16,
                  minWidth:100,
                  borderRadius:12,
                  backgroundColor: subscriptionFilter === 'confirmed' ? '#173663' : '#FFFFFF',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 2,
                  elevation: 3,
                  justifyContent:'center',
                  alignItems:'center',
                }}
              >
                <Text style={{ 
                  fontFamily:'Nunito-Bold', 
                  fontSize:16,
                  color: subscriptionFilter === 'confirmed' ? '#FFFFFF' : '#173663' 
                }}>
                  Confirmados
                </Text>
              </Pressable>
            </HStack>

            {/* Lista de Participantes */}
            {filteredParticipants.length === 0 ? (
              <Text style={{ color:'#9CA3AF', textAlign:'center', marginTop:20, fontSize:16 }}>
                Nenhuma inscrição {subscriptionFilter !== 'all' ? `com status "${subscriptionFilter === 'pending' ? 'Pendente' : 'Confirmado'}"` : ''} encontrada.
              </Text>
            ) : (
              <VStack style={{ gap:20 }}>
                {filteredParticipants.map((participant) => {
                  const location = [participant.voluntary.city, participant.voluntary.state]
                    .filter(Boolean)
                    .join(', ');
                  
                  const statusConfig = {
                    PENDING: { label: 'Pendente', bg: '#F98B26', icon: Clock },
                    CONFIRMED: { label: 'Confirmado', bg: '#1BAF71', icon: Check },
                    REJECTED: { label: 'Recusado', bg: '#E43A3A', icon: X },
                  };
                  const statusStyle = statusConfig[participant.status];
                  const StatusIcon = statusStyle.icon;

                  const isExpanded = expandedObservation[participant.id] || false;
                  const shouldTruncate = participant.observation && participant.observation.length > 50;

                  // Habilidades do voluntário
                  const voluntarySkills = participant.voluntary.skills?.map(s => s.skill) || [];

                  return (
                    <Box 
                      key={participant.id}
                      style={{
                        backgroundColor:'#FFFFFF',
                        borderRadius:12,
                        padding:16,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 2,
                        elevation: 3,
                        gap:12,
                      }}
                    >
                      {/* Nome e Status */}
                      <HStack style={{ alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
                        <Text style={{ 
                          fontSize:20, 
                          fontFamily:'Nunito-Bold', 
                          color:'#173663',
                          flex:1,
                          flexShrink:1
                        }}>
                          {participant.voluntary.name}
                        </Text>
                        <HStack style={{
                          paddingVertical:6,
                          paddingHorizontal:12,
                          gap:4,
                          backgroundColor: statusStyle.bg,
                          borderRadius:12,
                          alignItems:'center',
                          justifyContent:'center',
                        }}>
                          <StatusIcon size={12} color="#FFFFFF" strokeWidth={2} />
                          <Text style={{ 
                            fontSize:12, 
                            fontFamily:'Nunito-Bold', 
                            color:'#FFFFFF',
                          }}>
                            {statusStyle.label}
                          </Text>
                        </HStack>
                      </HStack>

                      {/* Cidade e Estado */}
                      {location && (
                        <HStack style={{ gap:6, alignItems:'center' }}>
                          <MapPin size={14} color="#B7B7B7" />
                          <Text style={{ 
                            fontSize:14, 
                            fontFamily:'Nunito-Regular', 
                            color:'#64748B' 
                          }}>
                            {location}
                          </Text>
                        </HStack>
                      )}

                      {/* Habilidades */}
                      {voluntarySkills.length > 0 && (
                        <VStack style={{ gap:8 }}>
                          <Text style={{ 
                            fontSize:14, 
                            fontFamily:'Nunito-Bold', 
                            color:'#173663' 
                          }}>
                            Habilidades:
                          </Text>
                          <HStack style={{ flexWrap:'wrap', gap:8 }}>
                            {voluntarySkills.map((skill, index) => {
                              const label = SKILL_GROUPS.flatMap(g => g.skills).find(k => k.value === skill)?.label || skill;
                              const isMatchingSkill = data?.skills?.includes(skill);
                              return (
                                <Box 
                                  key={`${participant.id}-skill-${skill}-${index}`}
                                  style={{
                                    backgroundColor: isMatchingSkill ? '#1BAF71' : '#173663',
                                    paddingHorizontal:12,
                                    paddingVertical:6,
                                    borderRadius:16,
                                    alignSelf:'flex-start',
                                  }}
                                >
                                  <Text 
                                    style={{ 
                                      color:'#FFFFFF',
                                      fontSize:13, 
                                      fontFamily:'Nunito-SemiBold',
                                    }}
                                  >
                                    {label}
                                  </Text>
                                </Box>
                              );
                            })}
                          </HStack>
                        </VStack>
                      )}

                      {/* Observação */}
                      {participant.observation && (
                        <VStack style={{ gap:2 }}>
                          <Text style={{ 
                            fontSize:14, 
                            lineHeight:19,
                            fontFamily:'Nunito-Regular', 
                            color:'#000000' 
                          }} numberOfLines={isExpanded ? undefined : 1}>
                            Obs: {participant.observation}
                          </Text>
                          {shouldTruncate && (
                            <Pressable onPress={() => {
                              setExpandedObservation(prev => ({
                                ...prev,
                                [participant.id]: !prev[participant.id]
                              }));
                            }}>
                              <Text style={{ 
                                fontSize:14, 
                                lineHeight:19,
                                fontFamily:'Nunito-Bold', 
                                color:'#173663' 
                              }}>
                                {isExpanded ? 'Ver menos' : 'Ver mais'}
                              </Text>
                            </Pressable>
                          )}
                        </VStack>
                      )}

                      {/* Botões de Ação - só mostrar se PENDING */}
                      {participant.status === 'PENDING' && (
                        <HStack style={{ gap:12, justifyContent:'space-between', alignItems:'center' }}>
                          <Pressable
                            onPress={() => handleApprove(participant.id)}
                            style={{
                              flex:1,
                              flexDirection:'row',
                              justifyContent:'center',
                              alignItems:'center',
                              paddingVertical:10,
                              paddingHorizontal:16,
                              gap:6,
                              backgroundColor:'#1BAF71',
                              borderRadius:12,
                            }}
                          >
                            <Check size={16} color="#FFFFFF" strokeWidth={2} />
                            <Text style={{ 
                              fontSize:14, 
                              fontFamily:'Nunito-Bold', 
                              color:'#FFFFFF' 
                            }}>
                              Confirmar
                            </Text>
                          </Pressable>
                          <Pressable
                            onPress={() => handleReject(participant.id)}
                            style={{
                              flex:1,
                              flexDirection:'row',
                              justifyContent:'center',
                              alignItems:'center',
                              paddingVertical:10,
                              paddingHorizontal:16,
                              gap:6,
                              borderWidth:1,
                              borderColor:'#E43A3A',
                              backgroundColor:'#FFFFFF',
                              borderRadius:12,
                            }}
                          >
                            <X size={16} color="#E43A3A" strokeWidth={2} />
                            <Text style={{ 
                              fontSize:14, 
                              fontFamily:'Nunito-Bold', 
                              color:'#E43A3A' 
                            }}>
                              Recusar
                            </Text>
                          </Pressable>
                        </HStack>
                      )}
                    </Box>
                  );
                })}
              </VStack>
            )}
          </VStack>
        )}
      </ScrollView>

      {isCancelling && (
        <View style={{ position:'absolute', top:0, left:0, right:0, bottom:0, backgroundColor:'rgba(255,255,255,0.85)', alignItems:'center', justifyContent:'center' }} pointerEvents="auto">
          <VStack style={{ alignItems:'center', gap:12 }}>
            <Spinner />
            <Text style={{ fontFamily:'Nunito-Bold', color:'#173663' }}>Cancelando vaga...</Text>
          </VStack>
        </View>
      )}
    </SafeAreaView>
  );
}
