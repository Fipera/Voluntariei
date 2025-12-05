import { SafeAreaView } from 'react-native-safe-area-context';
import { Linking, ScrollView, View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { ArrowLeft, HelpCircle } from 'lucide-react-native';

const EMAIL = 'VoluntarieiOficial@gmail.com';

export default function SupportScreen() {
  const mailto = () => Linking.openURL(`mailto:${EMAIL}`);
  const router = useRouter();
  function handleClose(){
    try { router.back(); } catch { router.replace('/'); }
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top','left','right','bottom']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 56 }}>
  <Pressable onPress={handleClose} hitSlop={8} style={{ width:36, height:36, borderRadius:18, backgroundColor:'#17366310', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
          <ArrowLeft size={20} color="#173663" />
        </Pressable>
        <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 24, lineHeight: 32, color: '#173663', textAlign: 'center', marginBottom:20 }}>Fale Conosco</Text>

        <SupportCard title="Contato Direto">
          Precisa de ajuda? Envie um e-mail para <Text style={{ fontFamily:'Nunito-Bold', color:'#173663' }}>{EMAIL}</Text> descrevendo sua dúvida ou problema. Respondemos o mais rápido possível.
        </SupportCard>
        <SupportCard title="Dicas Rápidas">
          - Verifique sua conexão de internet.
          {'\n'}- Atualize o aplicativo para a versão mais recente.
          {'\n'}- Limpe cache ou reinstale se estiver enfrentando travamentos recorrentes.
        </SupportCard>
        <SupportCard title="Privacidade e Dados">
          Para solicitar exclusão de conta ou dados, envie o pedido pelo e-mail de suporte com o assunto: EXCLUIR CONTA.
        </SupportCard>
        <SupportCard title="Feedback">
          Sua opinião ajuda a melhorar. Pode enviar sugestões de funcionalidades ou melhorias de interface.
        </SupportCard>

        <Button onPress={mailto} style={{ alignSelf: 'center', width: 220, height: 46, borderRadius: 14, backgroundColor: '#173663', justifyContent: 'center', marginTop:12 }}>
          <ButtonText style={{ fontFamily: 'Nunito-Bold', fontSize: 16, color: '#FFFFFF' }}>Abrir e-mail</ButtonText>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

function SupportCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom:14, backgroundColor:'#F9FAFB', borderRadius:12, padding:14, borderWidth:1, borderColor:'#E2E8F0', shadowColor:'#000', shadowOpacity:0.06, shadowRadius:4, shadowOffset:{width:0,height:2}, elevation:2 }}>
      <Text style={{ fontFamily:'Nunito-Bold', fontSize:15, color:'#173663', marginBottom:6 }}>{title}</Text>
      <Text style={{ fontFamily:'Nunito-Regular', fontSize:14, lineHeight:20, color:'#1f2937' }}>{children}</Text>
    </View>
  );
}
