import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView, View, StyleSheet, Image as RNImage, Pressable, TextInput, Modal, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import { Spinner } from '@/components/ui/spinner';
import { Calendar, ChevronLeft, MapPin, Tag, BookOpen, Info } from 'lucide-react-native';
import api from '@/services/api';
import { useAuth } from '@/providers/AuthProvider';
import { SKILL_IMAGE_MAP, DEFAULT_SKILL_IMAGE } from '@/utils/constants/voluntarySkillImages';
import { SKILL_GROUPS } from '@/utils/constants/voluntarySkills';

interface CardDetail {
  id: number;
  title: string;
  description?: string;
  banner?: string | null;
  startAt: string;
  duration: number; // em minutos
  isOnline: boolean;
  city?: string;
  state?: string;
  maxVolunteers: number;
  status: 'ACTIVE' | 'PENDING' | 'FINALIZED' | 'CANCELED';
  skills: string[];
  participantsCount?: number;
  institution?: string;
  isApplied?: boolean;
}

export default function VoluntaryOpportunityDetail(){
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [data, setData] = useState<CardDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [observation, setObservation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    async function load(){
      if(!token || !id) return;
      try{
        setLoading(true);
        const response = await api.get<CardDetail>(`/cards/${id}/detail`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setData(response.data);
        setIsApplied(response.data.isApplied || false);
      }catch(error: any){
        console.error('Error loading card detail:', error.response?.data || error.message);
      }finally{
        setLoading(false);
      }
    }
    load();
  }, [token, id]);

  function formatDate(dt: string){
    const d = new Date(dt);
    const date = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const time = d.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
    return `${date} - ${time}`;
  }

  function formatShortDate(dt: string){
    const d = new Date(dt);
    const date = d.toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit' });
    const time = d.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
    return `${date} às ${time}`;
  }

  function calculateEndDate(startAt: string, duration: number): string {
    const start = new Date(startAt);
    const end = new Date(start.getTime() + duration * 60000); // duration em minutos
    return end.toISOString();
  }

  async function handleApply(){
    try{
      setSubmitting(true);
      await api.post(`/cards/${id}/apply`, { observation: observation.trim() || undefined }, { headers: { Authorization: `Bearer ${token}` } });
      setShowModal(false);
      setIsApplied(true);
      Alert.alert('Sucesso!', 'Sua inscrição foi enviada. Você pode acompanhar o status na aba Agenda.');
    }catch(err: any){
      Alert.alert('Erro', err.response?.data?.message || 'Não foi possível realizar a inscrição');
    }finally{
      setSubmitting(false);
    }
  }

  function handleViewStatus(){
    router.push('/(voluntary)/schedule');
  }

  const isOpen = useMemo(() => {
    if(!data) return false;
    const participantsCount = data.participantsCount || 0;
    return participantsCount < data.maxVolunteers && data.status === 'ACTIVE';
  }, [data]);

  const location = useMemo(()=>{
    if(data?.isOnline) return 'Online';
    const parts = [data?.city, data?.state].filter(Boolean);
    return parts.join(', ') || 'Local não especificado';
  }, [data]);

  if(loading){
    return (
      <SafeAreaView style={{ flex:1, backgroundColor:'#fff' }} edges={['top','left','right','bottom']}>
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
    <SafeAreaView style={{ flex:1, backgroundColor:'#fff' }} edges={['top','left','right','bottom']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header Image with Back Button */}
        <Box style={{ width:'100%', height:220, backgroundColor:'#e5e7eb', position:'relative' }}>
          {data.banner ? (
            <RNImage source={{ uri: data.banner }} style={StyleSheet.absoluteFillObject} resizeMode='cover' />
          ) : null}
          
          {/* Back Button */}
          <Pressable 
            onPress={()=> router.back()} 
            style={{ 
              position:'absolute', 
              top: insets.top + 16, 
              left: 20, 
              width:40, 
              height:40, 
              borderRadius:20, 
              backgroundColor:'rgba(255,255,255,0.9)', 
              alignItems:'center', 
              justifyContent:'center',
              shadowColor:'#000',
              shadowOffset:{width:0,height:2},
              shadowOpacity:0.25,
              shadowRadius:4,
              elevation:4
            }}
          >
            <ChevronLeft size={24} color="#173663" />
          </Pressable>
        </Box>

        <VStack style={{ paddingHorizontal:21, paddingTop:20, gap:32 }}>
          {/* Title + Status Tag (lado a lado) */}
          <HStack style={{ alignItems:'center', justifyContent:'space-between', gap:12 }}>
            <Text style={{ fontSize:28, fontFamily:'Nunito-Bold', color:'#173663', lineHeight:38, flex:1 }}>{data.title}</Text>
            <View style={{ 
              paddingHorizontal:10, 
              paddingVertical:10, 
              borderRadius:12, 
              backgroundColor: isOpen ? '#173663' : '#DC2626',
              minWidth:81,
              alignItems:'center'
            }}>
              <Text style={{ 
                fontFamily:'Nunito-Bold', 
                fontSize:14, 
                color:'#FFFFFF',
                lineHeight:19
              }}>
                {isOpen ? 'Aberta' : 'Fechada'}
              </Text>
            </View>
          </HStack>

          {/* Institution Name */}
          {data.institution && (
            <Text style={{ fontSize:16, color:'#B8B8B8', lineHeight:22, marginTop:-24 }}>{data.institution}</Text>
          )}

          {/* Dates */}
          <VStack style={{ gap:8 }}>
            <HStack style={{ gap:12, alignItems:'center' }}>
              <Calendar size={24} color="#173663" />
              <Text style={{ fontSize:20, fontFamily:'Nunito-Bold', color:'#173663', lineHeight:27 }}>Datas</Text>
            </HStack>
            <Text style={{ fontSize:14, color:'#000000', lineHeight:19 }}>
              {formatDate(data.startAt)}{'\n'}{data.duration ? formatDate(calculateEndDate(data.startAt, data.duration)) : ''}
            </Text>
          </VStack>

          {/* Location */}
          <VStack style={{ gap:8 }}>
            <HStack style={{ gap:12, alignItems:'center' }}>
              <MapPin size={24} color="#173663" />
              <Text style={{ fontSize:20, fontFamily:'Nunito-Bold', color:'#173663', lineHeight:27 }}>Local</Text>
            </HStack>
            <Text style={{ fontSize:14, color:'#000000', lineHeight:19 }}>{location}</Text>
          </VStack>

          {/* Description */}
          {data.description && (
            <VStack style={{ gap:8 }}>
              <HStack style={{ gap:12, alignItems:'center' }}>
                <BookOpen size={24} color="#173663" />
                <Text style={{ fontSize:20, fontFamily:'Nunito-Bold', color:'#173663', lineHeight:27 }}>Descrição</Text>
              </HStack>
              <Text style={{ fontSize:14, color:'#000000', lineHeight:19, textAlign:'justify' }}>{data.description}</Text>
            </VStack>
          )}

          {/* Skills */}
          {!!data.skills?.length && (
            <VStack style={{ gap:16, alignItems:'center' }}>
              <HStack style={{ gap:12, alignItems:'center', alignSelf:'flex-start' }}>
                <Tag size={24} color="#173663" />
                <Text style={{ fontSize:20, fontFamily:'Nunito-Bold', color:'#173663', lineHeight:27 }}>Habilidades</Text>
              </HStack>
              <HStack style={{ gap:32, flexWrap:'wrap', justifyContent:'center' }}>
                {data.skills.map((s)=> {
                  const img = SKILL_IMAGE_MAP[s] || DEFAULT_SKILL_IMAGE;
                  const label = SKILL_GROUPS.flatMap(g=> g.skills).find(k=> k.value === s)?.label || s;
                  return (
                    <VStack key={s} style={{ width:64, alignItems:'center' }}>
                      <RNImage source={img} style={{ width: 64, height: 64, borderRadius: 9999 }} />
                      <Text style={{ marginTop:8, fontSize:12, color:'#000000', textAlign:'center', lineHeight:16 }} numberOfLines={2}>{label}</Text>
                    </VStack>
                  );
                })}
              </HStack>
            </VStack>
          )}

          {/* Subscribe Button */}
          {isApplied ? (
            <Button 
              onPress={handleViewStatus} 
              style={{ 
                backgroundColor:'#173663', 
                height:52, 
                borderRadius:12, 
                marginTop:8,
                marginBottom:32
              }}
            >
              <Text style={{ color:'#fff', fontFamily:'Nunito-Bold', fontSize:16 }}>Ver Status</Text>
            </Button>
          ) : (
            <Button 
              onPress={()=> setShowModal(true)} 
              style={{ 
                backgroundColor:'#173663', 
                height:52, 
                borderRadius:12, 
                marginTop:8,
                marginBottom:32
              }}
            >
              <Text style={{ color:'#fff', fontFamily:'Nunito-Bold', fontSize:16 }}>Quero me Inscrever</Text>
            </Button>
          )}
        </VStack>
      </ScrollView>

      {/* Modal de Inscrição */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={()=> setShowModal(false)}
      >
        <View style={{ flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:'center', paddingHorizontal:20 }}>
          <VStack style={{ 
            width:'100%', 
            maxWidth:374,
            backgroundColor:'#FFFFFF', 
            borderRadius:12, 
            padding:20, 
            gap:12,
            shadowColor:'#000',
            shadowOffset:{width:0,height:2},
            shadowOpacity:0.25,
            shadowRadius:2,
            elevation:4
          }}>
            {/* Título */}
            <Text style={{ fontSize:28, fontFamily:'Nunito-Bold', color:'#173663', lineHeight:38, textAlign:'center' }}>
              Realizar Inscrição
            </Text>

            {/* Subtítulo com nome do projeto e data */}
            <Text style={{ fontSize:16, color:'#000000', lineHeight:22, textAlign:'center' }}>
              {data?.title} - {data?.institution}, {data ? formatShortDate(data.startAt) : ''}
            </Text>

            {/* Label Observações */}
            <Text style={{ fontSize:16, fontFamily:'Nunito-Bold', color:'#173663', lineHeight:22, marginTop:8 }}>
              Observações (opcional)
            </Text>

            {/* Campo de Observação */}
            <TextInput
              value={observation}
              onChangeText={setObservation}
              placeholder="Inclua informações adicionais que possam ajudar a instituição."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              style={{
                width:'100%',
                height:100,
                backgroundColor:'#FDFDFD',
                borderWidth:1,
                borderColor:'#B7B7B7',
                borderRadius:8,
                padding:12,
                fontFamily:'Nunito-Regular',
                fontSize:14,
                color:'#000000',
                textAlignVertical:'top',
                shadowColor:'#000',
                shadowOffset:{width:0,height:2},
                shadowOpacity:0.25,
                shadowRadius:2,
                elevation:2
              }}
            />

            {/* Aviso com ícone Info */}
            <HStack style={{ gap:10, alignItems:'flex-start' }}>
              <Info size={24} color="#173663" style={{ marginTop:2 }} />
              <Text style={{ flex:1, fontSize:14, color:'#000000', lineHeight:19, textAlign:'justify' }}>
                A instituição confirmará sua inscrição. Você será notificado e poderá acompanhar pela Agenda.
              </Text>
            </HStack>

            {/* Botão Confirmar */}
            <Pressable
              onPress={handleApply}
              disabled={submitting}
              style={{
                width:'100%',
                height:44,
                backgroundColor:'#1BAF71',
                borderRadius:12,
                justifyContent:'center',
                alignItems:'center',
                opacity: submitting ? 0.6 : 1
              }}
            >
              <Text style={{ fontSize:18, fontFamily:'Nunito-Bold', color:'#FFFFFF', lineHeight:25 }}>
                {submitting ? 'Enviando...' : 'Confirmar Inscrição'}
              </Text>
            </Pressable>

            {/* Botão Cancelar */}
            <Pressable onPress={()=> setShowModal(false)}>
              <Text style={{ fontSize:18, fontFamily:'Nunito-Bold', color:'#173663', lineHeight:25, textAlign:'center' }}>
                Cancelar
              </Text>
            </Pressable>
          </VStack>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
