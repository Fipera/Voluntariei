import { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, ActivityIndicator, Alert, Pressable, Modal, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { useAuth } from '@/providers/AuthProvider';
import api from '@/services/api';
import { Settings, LogOut, FileText, Info } from 'lucide-react-native';
import { StateSelect } from '@/components/custom/StateSelect';

interface InstitutionMeResponse {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string | null;
  cnpj?: string | null;
  city?: string | null;
  state?: string | null;
  reason?: string | null;
}

export default function InstitutionProfileScreen() {
  const { token, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight ? useBottomTabBarHeight() : 70;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<InstitutionMeResponse | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [stateValue, setStateValue] = useState('');
  const [reason, setReason] = useState('');
  const [settingsVisible, setSettingsVisible] = useState(false);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setLoading(true);
        const { data: me } = await api.get<InstitutionMeResponse>('/institution/me', { headers: { Authorization: `Bearer ${token}` } });
        setData(me);
        setPhoneNumber(me.phoneNumber || '');
        setCity(me.city || '');
        setStateValue(me.state || '');
        setReason(me.reason || '');
      } catch (e: any) {
        Alert.alert('Erro', e.message || 'Falha ao carregar perfil');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  function formatPhone(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
    return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`; // 11 dígitos celular
  }

  const dirty = useMemo(() => {
    if (!data) return false;
    return (
      phoneNumber !== (data.phoneNumber || '') ||
      city !== (data.city || '') ||
      stateValue !== (data.state || '') ||
      reason !== (data.reason || '')
    );
  }, [phoneNumber, city, stateValue, reason, data]);

  const maskedEmail = useMemo(() => {
    if (!data?.email) return '';
    const [user, domain] = data.email.split('@');
    if (!domain) return data.email;
    const maskedUser =
      user.length <= 4
        ? user[0] + '*'.repeat(Math.max(0, user.length - 1))
        : user.slice(0, 2) + '*'.repeat(user.length - 4) + user.slice(-2);
    return `${maskedUser}@${domain}`;
  }, [data?.email]);

  async function handleSave() {
    if (!token || !dirty) return;
    try {
      setSaving(true);
      const updatedResp = await api.patch<InstitutionMeResponse>('/institution/update', {
        phoneNumber: phoneNumber ? phoneNumber.replace(/\D/g,'') : undefined,
        city: city || undefined,
        state: stateValue || undefined,
        reason: reason || undefined,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setData(updatedResp.data);
      Alert.alert('Sucesso', 'Alterações salvas.');
    } catch (e: any) {
      Alert.alert('Erro', e.message || 'Não foi possível salvar');
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    Alert.alert('Sair', 'Deseja realmente sair da conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => { logout(); } }
    ]);
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#173663" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top','left','right']}>
      <Pressable onPress={()=>setSettingsVisible(true)} style={{ position:'absolute', top: insets.top + 4, right:16, zIndex:20, padding:8 }} hitSlop={8}>
        <Settings size={26} color={'#173663'} />
      </Pressable>
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 24, paddingTop: insets.top + 60, paddingBottom: (tabBarHeight + insets.bottom + 140) }}>
          <VStack style={{ alignItems: 'center', marginBottom: 28 }}>
            <Text style={{ fontSize: 24, fontFamily: 'Nunito-Bold', color: '#173663' }}>{data?.name}</Text>
            <Text style={{ fontSize: 13, fontFamily: 'Nunito-Regular', marginTop: 4 }}>{maskedEmail}</Text>
          </VStack>

          <FieldGroup label="Telefone de Contato">
            <Input className="w-full" style={{ height: 43, backgroundColor:'#FDFDFD', borderColor:'#B7B7B7', borderWidth:1, borderRadius:8, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.25, shadowRadius:2, elevation:2 }}>
              <InputField
                value={phoneNumber}
                onChangeText={(t)=>setPhoneNumber(formatPhone(t))}
                placeholder="(00) 00000-0000"
                keyboardType="phone-pad"
                className="text-sm"
              />
            </Input>
          </FieldGroup>

          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ flex: 1 }}>
              <FieldGroup label="Cidade">
                <Input className="w-full" style={{ height: 43, backgroundColor:'#FDFDFD', borderColor:'#B7B7B7', borderWidth:1, borderRadius:8, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.25, shadowRadius:2, elevation:2 }}>
                  <InputField value={city} onChangeText={setCity} placeholder="Cidade" className="text-sm" />
                </Input>
              </FieldGroup>
            </View>
            <View style={{ flex: 1 }}>
              <FieldGroup label="Estado">
                {/* Substituído Input por StateSelect */}
                <StateSelect value={stateValue} onChange={setStateValue} height={43} containerStyle={{ width:'100%', backgroundColor:'#FDFDFD', borderColor:'#B7B7B7', borderWidth:1, borderRadius:8, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.25, shadowRadius:2, elevation:2 }} />
              </FieldGroup>
            </View>
          </View>

          <FieldGroup label="Causa" containerStyle={{ marginTop: 8 }}>
            <Input className="w-full" style={{ height: 43, backgroundColor:'#FDFDFD', borderColor:'#B7B7B7', borderWidth:1, borderRadius:8, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.25, shadowRadius:2, elevation:2 }}>
              <InputField value={reason} onChangeText={setReason} placeholder="Causa" className="text-sm" />
            </Input>
          </FieldGroup>
        </ScrollView>

        <View style={{ position: 'absolute', left: 0, right: 0, bottom: tabBarHeight + insets.bottom + 12 }}>
          <Button
            onPress={handleSave}
            disabled={!dirty || saving}
            style={{ width: 310, height: 44, borderRadius: 12, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 10, gap:8, alignSelf:'center', backgroundColor: !dirty ? '#b7c4da' : '#173663' }}
          >
            <ButtonText style={{ fontSize:18, lineHeight:25, fontFamily:'Nunito-Bold' }}>{saving ? 'Salvando...' : 'Salvar Alterações'}</ButtonText>
          </Button>
        </View>
      </View>

      <Modal visible={settingsVisible} transparent animationType="fade" onRequestClose={()=>setSettingsVisible(false)}>
        <TouchableWithoutFeedback onPress={()=>setSettingsVisible(false)}>
          <View style={{ flex:1, backgroundColor:'rgba(0,0,0,0.25)', justifyContent:'flex-end' }}>
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor:'#FFFFFF', borderTopLeftRadius:24, borderTopRightRadius:24, paddingHorizontal:24, paddingTop:24, paddingBottom: insets.bottom + 16 }}>
                <Text style={{ fontSize:18, fontFamily:'Nunito-Bold', color:'#173663', textAlign:'center', marginBottom:20 }}>Configurações</Text>

                <SettingsItem icon={FileText} label="Política de Uso" onPress={()=>{ /* abrir link/placeholder */ }} />
                <SettingsItem icon={Info} label="Ajuda / Fale Conosco" onPress={()=>{ /* abrir ajuda */ }} />

                <View style={{ height:1, backgroundColor:'#E2E8F0', marginVertical:16 }} />

                <SettingsItem icon={LogOut} label="Sair da conta" destructive onPress={()=>{ setSettingsVisible(false); handleLogout(); }} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

function FieldGroup({ label, children, containerStyle }: { label: string; children: React.ReactNode; containerStyle?: any }) {
  // group: label (22) + gap (14) + field (43)
  return (
    <View style={[{ marginBottom: 24 }, containerStyle]}> 
      <Text style={{ fontSize: 16, fontFamily: 'Nunito-Bold', marginBottom: 14, color: '#173663', lineHeight:22 }}>{label}</Text>
      {children}
    </View>
  );
}

function SettingsItem({ icon:Icon, label, onPress, destructive }: { icon: any; label: string; onPress: ()=>void; destructive?: boolean }) {
  return (
    <Pressable onPress={onPress} style={{ flexDirection:'row', alignItems:'center', gap:12, paddingVertical:10 }}>
      <Icon size={22} color={destructive ? '#C53030' : '#173663'} />
      <Text style={{ fontSize:14, fontFamily:'Nunito-Regular', color: destructive ? '#C53030' : '#1a202c' }}>{label}</Text>
    </Pressable>
  );
}
