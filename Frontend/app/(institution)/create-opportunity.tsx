import React, { useMemo, useState } from 'react';
import { Platform, ScrollView, View, Pressable, Image as RNImage, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Checkbox, CheckboxIndicator, CheckboxLabel } from '@/components/ui/checkbox';
import { useAuth } from '@/providers/AuthProvider';
import api from '@/services/api';
import * as ImagePicker from 'expo-image-picker';
import { StateSelect } from '@/components/custom/StateSelect';
import { SkillsEditor } from '@/components/custom/voluntaryskills/skillseditor/SkillsEditor';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Calendar, Clock, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Spinner } from '@/components/ui/spinner';

export default function CreateOpportunityScreen(){
  const { token } = useAuth();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight ? useBottomTabBarHeight() : 70;
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [startAt, setStartAt] = useState<Date | null>(null);
  const [durationHours, setDurationHours] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [useInstitutionAddress, setUseInstitutionAddress] = useState(true);
  const [cep, setCep] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [street, setStreet] = useState('');
  const [numberHouse, setNumberHouse] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [complement, setComplement] = useState('');
  const [locationNote, setLocationNote] = useState('');
  const [maxVolunteers, setMaxVolunteers] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [banner, setBanner] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [showStartDate, setShowStartDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function pickBanner(){
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if(!res.canceled){
      const asset = res.assets[0];
      setBanner(asset.uri);
    }
  }

  // Calcula a duração máxima permitida (até 23:59 do mesmo dia)
  const maxDurationMinutes = useMemo(() => {
    if (!startAt) return 1439; // 23h59m
    const endOfDay = new Date(startAt);
    endOfDay.setHours(23, 59, 0, 0);
    const diffMs = endOfDay.getTime() - startAt.getTime();
    return Math.floor(diffMs / 60000); // converte ms para minutos
  }, [startAt]);

  // Validação de duração
  const durationError = useMemo(() => {
    const duration = (Number(durationHours) || 0) * 60 + (Number(durationMinutes) || 0);
    if (duration === 0) return null;
    if (duration > maxDurationMinutes) {
      const maxHours = Math.floor(maxDurationMinutes / 60);
      const maxMins = maxDurationMinutes % 60;
      return `A duração não pode ultrapassar o mesmo dia. Máximo: ${maxHours}h${maxMins > 0 ? ` ${maxMins}min` : ''}`;
    }
    return null;
  }, [durationHours, durationMinutes, maxDurationMinutes]);

  const canSubmit = useMemo(()=>{
    const duration = (Number(durationHours) || 0) * 60 + (Number(durationMinutes) || 0);
    return !!(title && startAt && duration > 0 && !durationError && (isOnline || useInstitutionAddress || (city && state)) && maxVolunteers && skills.length>=1 && skills.length<=3);
  },[title, startAt, durationHours, durationMinutes, durationError, isOnline, useInstitutionAddress, city, state, maxVolunteers, skills]);

  // poll helper to give backend time to persist
  async function waitForCreation(delayMs = 1500){
    await new Promise(res=> setTimeout(res, delayMs)); // simple grace delay
  }

  async function handleCreate(){
    if(!token) return;
    if(skills.length === 0 || skills.length > 3) return;
    
    const duration = (Number(durationHours) || 0) * 60 + (Number(durationMinutes) || 0);
    
    // Valida duração
    if (duration > maxDurationMinutes) {
      alert('A duração não pode ultrapassar 23:59 do mesmo dia.');
      return;
    }
    
    try{
      setSaving(true);
      const payload: any = {
        title,
        description: description || undefined,
        startAt: (startAt as Date).toISOString(),
        duration,
        isOnline,
        maxVolunteers: Number(maxVolunteers),
        skills,
        useInstitutionAddress: isOnline ? undefined : useInstitutionAddress,
        banner: banner || undefined,
        ...(isOnline || useInstitutionAddress ? {} : { city, state, cep: cep.replace(/\D/g,''), street, numberHouse, neighborhood, complement, locationNote }),
      };
      await api.post('/cards', payload, { headers: { Authorization: `Bearer ${token}` } });

      // reset form before redirecting so next creation starts clean
      setTitle('');
      setStartAt(null);
      setDurationHours('');
      setDurationMinutes('');
      setIsOnline(false);
      setUseInstitutionAddress(true);
      setCep('');
      setCity('');
      setState('');
      setStreet('');
      setNumberHouse('');
      setNeighborhood('');
      setComplement('');
      setLocationNote('');
      setMaxVolunteers('');
      setDescription('');
      setSkills([]);
      setBanner(null);
      setSuccessMsg(null);

      setRedirecting(true);
      await waitForCreation();
      router.replace({ pathname: '/(institution)', params: { filter: 'ALL' } } as any);
      return;
    }catch(e: any){
      alert(e?.response?.data?.error || 'Erro ao criar');
    }finally{
      setSaving(false);
      setRedirecting(false);
    }
  }

  return (
    <SafeAreaView style={{ flex:1 }} edges={['top','left','right']}> 
      <ScrollView contentContainerStyle={{ paddingHorizontal:24, paddingTop: insets.top + 8, paddingBottom: tabBarHeight + insets.bottom + 24 }}>
        {successMsg && (
          <View style={{ backgroundColor:'#E6FFFA', borderColor:'#2C7A7B', borderWidth:1, padding:12, borderRadius:10, flexDirection:'row', alignItems:'center', gap:8, marginBottom:12 }}>
            <Check size={18} color="#2C7A7B" />
            <Text style={{ color:'#234E52', fontFamily:'Nunito-Bold' }}>{successMsg}</Text>
          </View>
        )}
        {/* Banner */}
        <VStack style={{ alignItems:'center', marginBottom:16 }}>
          <View style={{ width:'100%', height:140, borderRadius:12, backgroundColor:'#d1d5db', overflow:'hidden', position:'relative' }}>
            {banner ? (
              <RNImage
                source={{ uri: banner }}
                style={StyleSheet.absoluteFillObject}
                resizeMode='cover'
              />
            ) : (
              <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
                <Text style={{ color:'#1F2937' }}>Adicionar Imagem</Text>
              </View>
            )}
            <Pressable onPress={pickBanner} style={StyleSheet.absoluteFillObject} />
          </View>
        </VStack>

        <Text style={{ fontSize:24, fontFamily:'Nunito-Bold', color:'#173663', marginBottom:12 }}>Digite o Título</Text>
        <Input style={{ height:43, backgroundColor:'#FDFDFD', borderColor:'#B7B7B7', borderWidth:1, borderRadius:8, marginBottom:16 }}>
          <InputField value={title} onChangeText={setTitle} placeholder='Título da oportunidade' />
        </Input>

        <VStack style={{ gap:16, marginBottom:16 }}>
          <View style={{ width:'100%' }}>
            <Text style={{ fontSize:16, fontFamily:'Nunito-Bold', color:'#173663', marginBottom:8 }}>Início</Text>
            {Platform.OS === 'web' ? (
              <Input style={{ height:56, backgroundColor:'#FDFDFD', borderColor:'#B7B7B7', borderWidth:1, borderRadius:12 }}>
                <InputField
                  value={startAt ? (startAt as Date).toISOString().slice(0,16).replace('T',' ') : ''}
                  onChangeText={(v)=> setStartAt(v ? new Date(v) : null)}
                  placeholder='YYYY-MM-DD HH:mm'
                  style={{ fontSize:16 }}
                />
              </Input>
            ) : (
              <VStack style={{ gap:10 }}>
                <Pressable onPress={()=> setShowStartDate(true)} accessibilityRole='button' hitSlop={10}>
                  <Input pointerEvents='none' style={{ height:56, backgroundColor:'#FDFDFD', borderColor:'#B7B7B7', borderWidth:1, borderRadius:12, paddingRight:44 }}>
                    <InputField editable={false} value={startAt ? startAt.toLocaleDateString() : ''} placeholder='Data' style={{ paddingRight: 10, fontSize:16 }} />
                  </Input>
                  <Calendar size={20} color="#173663" pointerEvents='none' style={{ position:'absolute', right:12, top:'50%', marginTop:-10 }} />
                </Pressable>
                <Pressable onPress={()=> setShowStartTime(true)} accessibilityRole='button' hitSlop={10}>
                  <Input pointerEvents='none' style={{ height:56, backgroundColor:'#FDFDFD', borderColor:'#B7B7B7', borderWidth:1, borderRadius:12, paddingRight:44 }}>
                    <InputField editable={false} value={startAt ? startAt.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }) : ''} placeholder='Hora' style={{ paddingRight: 10, fontSize:16 }} />
                  </Input>
                  <Clock size={20} color="#173663" pointerEvents='none' style={{ position:'absolute', right:12, top:'50%', marginTop:-10 }} />
                </Pressable>
              </VStack>
            )}
          </View>

          <View style={{ width:'100%' }}>
            <Text style={{ fontSize:16, fontFamily:'Nunito-Bold', color:'#173663', marginBottom:8 }}>Duração</Text>
            <HStack style={{ gap:12 }}>
              <View style={{ flex:1 }}>
                <Input style={{ height:56, backgroundColor:'#FDFDFD', borderColor: durationError ? '#DC2626' : '#B7B7B7', borderWidth:1, borderRadius:12 }}>
                  <InputField
                    value={durationHours}
                    onChangeText={setDurationHours}
                    placeholder='Horas'
                    keyboardType='number-pad'
                    style={{ fontSize:16, textAlign:'center' }}
                  />
                </Input>
              </View>
              <View style={{ flex:1 }}>
                <Input style={{ height:56, backgroundColor:'#FDFDFD', borderColor: durationError ? '#DC2626' : '#B7B7B7', borderWidth:1, borderRadius:12 }}>
                  <InputField
                    value={durationMinutes}
                    onChangeText={setDurationMinutes}
                    placeholder='Minutos'
                    keyboardType='number-pad'
                    style={{ fontSize:16, textAlign:'center' }}
                  />
                </Input>
              </View>
            </HStack>
            {durationError && (
              <Text style={{ fontSize:12, color:'#DC2626', marginTop:6, lineHeight:16 }}>
                {durationError}
              </Text>
            )}
          </View>
        </VStack>

        {Platform.OS !== 'web' && (
          <>
            {showStartDate && (
               <DateTimePicker
                 value={startAt || new Date()}
                 mode='date'
                 display={Platform.OS === 'android' ? 'calendar' : 'default'}
                onChange={(event: DateTimePickerEvent, d?: Date)=>{ setShowStartDate(false); if(d) setStartAt(prev=>{ const base = prev || d; const res = new Date(base); res.setFullYear(d.getFullYear(), d.getMonth(), d.getDate()); return res; }); }}
               />
             )}
            {showStartTime && (
               <DateTimePicker
                 value={startAt || new Date()}
                 mode='time'
                 is24Hour
                 display={Platform.OS === 'android' ? 'clock' : 'default'}
                onChange={(event: DateTimePickerEvent, d?: Date)=>{ setShowStartTime(false); if(d) setStartAt(prev=>{ const base = prev || d; const res = new Date(base); res.setHours(d.getHours(), d.getMinutes(), 0, 0); return res; }); }}
               />
             )}
          </>
        )}

        <HStack style={{ alignItems:'center', gap:12, marginBottom:8 }}>
          <Checkbox value="online" isChecked={isOnline} onChange={() => setIsOnline(!isOnline)}>
            <CheckboxIndicator />
            <CheckboxLabel>Atividade Online</CheckboxLabel>
          </Checkbox>
        </HStack>

        {!isOnline && (
          <>
            <HStack style={{ alignItems:'center', gap:12, marginBottom:8 }}>
              <Checkbox value="institution-address" isChecked={useInstitutionAddress} onChange={() => setUseInstitutionAddress(!useInstitutionAddress)}>
                <CheckboxIndicator />
                <CheckboxLabel>Usar endereço da instituição</CheckboxLabel>
              </Checkbox>
            </HStack>
            {!useInstitutionAddress && (
              <VStack style={{ gap:12, marginBottom:8 }}>
                <HStack style={{ gap:16 }}>
                  <View style={{ flex:1 }}>
                    <Text style={{ fontSize:16, fontFamily:'Nunito-Bold', color:'#173663', marginBottom:8 }}>Cidade</Text>
                    <Input style={{ height:43, backgroundColor:'#FDFDFD', borderColor:'#B7B7B7', borderWidth:1, borderRadius:8 }}>
                      <InputField value={city} onChangeText={setCity} placeholder='Cidade' />
                    </Input>
                  </View>
                  <View style={{ flex:1 }}>
                    <Text style={{ fontSize:16, fontFamily:'Nunito-Bold', color:'#173663', marginBottom:8 }}>Estado</Text>
                    <StateSelect value={state} onChange={setState} height={43} containerStyle={{ width:'100%', backgroundColor:'#FDFDFD', borderColor:'#B7B7B7', borderWidth:1, borderRadius:8 }} />
                  </View>
                </HStack>
                <HStack style={{ gap:16 }}>
                  <View style={{ flex:1 }}>
                    <Text style={{ fontSize:16, fontFamily:'Nunito-Bold', color:'#173663', marginBottom:8 }}>CEP</Text>
                    <Input style={{ height:43, backgroundColor:'#FDFDFD', borderColor:'#B7B7B7', borderWidth:1, borderRadius:8 }}>
                      <InputField value={cep} onChangeText={setCep} placeholder='00000000' keyboardType='number-pad' />
                    </Input>
                  </View>
                  <View style={{ flex:1 }}>
                    <Text style={{ fontSize:16, fontFamily:'Nunito-Bold', color:'#173663', marginBottom:8 }}>Bairro</Text>
                    <Input style={{ height:43, backgroundColor:'#FDFDFD', borderColor:'#B7B7B7', borderWidth:1, borderRadius:8 }}>
                      <InputField value={neighborhood} onChangeText={setNeighborhood} placeholder='Bairro' />
                    </Input>
                  </View>
                </HStack>
                <HStack style={{ gap:16 }}>
                  <View style={{ flex:2 }}>
                    <Text style={{ fontSize:16, fontFamily:'Nunito-Bold', color:'#173663', marginBottom:8 }}>Rua</Text>
                    <Input style={{ height:43, backgroundColor:'#FDFDFD', borderColor:'#B7B7B7', borderWidth:1, borderRadius:8 }}>
                      <InputField value={street} onChangeText={setStreet} placeholder='Rua' />
                    </Input>
                  </View>
                  <View style={{ flex:1 }}>
                    <Text style={{ fontSize:16, fontFamily:'Nunito-Bold', color:'#173663', marginBottom:8 }}>Número</Text>
                    <Input style={{ height:43, backgroundColor:'#FDFDFD', borderColor:'#B7B7B7', borderWidth:1, borderRadius:8 }}>
                      <InputField value={numberHouse} onChangeText={setNumberHouse} placeholder='Número' />
                    </Input>
                  </View>
                </HStack>
                <Text style={{ fontSize:16, fontFamily:'Nunito-Bold', color:'#173663', marginBottom:8 }}>Complemento</Text>
                <Input style={{ height:43, backgroundColor:'#FDFDFD', borderColor:'#B7B7B7', borderWidth:1, borderRadius:8, marginBottom:8 }}>
                  <InputField value={complement} onChangeText={setComplement} placeholder='Complemento' />
                </Input>
                <Text style={{ fontSize:16, fontFamily:'Nunito-Bold', color:'#173663', marginBottom:8 }}>Observação do local</Text>
                <Input style={{ height:43, backgroundColor:'#FDFDFD', borderColor:'#B7B7B7', borderWidth:1, borderRadius:8 }}>
                  <InputField value={locationNote} onChangeText={setLocationNote} placeholder='Referências para chegar' />
                </Input>
              </VStack>
            )}
          </>
        )}

        <Text style={{ fontSize:16, fontFamily:'Nunito-Bold', color:'#173663', marginBottom:8, marginTop:12 }}>Quantidade de Voluntários</Text>
        <Input style={{ height:43, backgroundColor:'#FDFDFD', borderColor:'#B7B7B7', borderWidth:1, borderRadius:8, marginBottom:8 }}>
          <InputField value={maxVolunteers} onChangeText={setMaxVolunteers} placeholder='0' keyboardType='number-pad' />
        </Input>

        <Text style={{ fontSize:16, fontFamily:'Nunito-Bold', color:'#173663', marginBottom:8 }}>Descrição</Text>
        <Input style={{ minHeight:90, backgroundColor:'#FDFDFD', borderColor:'#B7B7B7', borderWidth:1, borderRadius:8, paddingVertical:8, marginBottom:8 }}>
          <InputField value={description} onChangeText={setDescription} placeholder='Descreva a oportunidade' multiline />
        </Input>

        <View style={{ marginTop: 8 }}>
          <SkillsEditor value={skills} onChange={setSkills} max={3} />
        </View>

        <Button onPress={handleCreate} disabled={!canSubmit || saving} style={{ width: 310, height: 44, borderRadius: 12, alignSelf:'center', marginTop: 16, backgroundColor: !canSubmit ? '#b7c4da' : '#173663' }}>
          <ButtonText style={{ fontSize:18, lineHeight:25, fontFamily:'Nunito-Bold' }}>{saving ? 'Criando...' : 'Criar Vaga'}</ButtonText>
        </Button>
      </ScrollView>

      {(saving || redirecting) && (
        <View style={{ position:'absolute', top:0, left:0, right:0, bottom:0, backgroundColor:'rgba(255,255,255,0.85)', alignItems:'center', justifyContent:'center' }}>
          <VStack style={{ alignItems:'center', gap:12 }}>
            <Spinner />
            <Text style={{ fontFamily:'Nunito-Bold', color:'#173663' }}>{saving ? 'Criando vaga...' : 'Abrindo Hub...'}</Text>
          </VStack>
        </View>
      )}
    </SafeAreaView>
  );
}
