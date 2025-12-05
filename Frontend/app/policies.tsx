import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function PoliciesScreen() {
  const router = useRouter();
  function handleClose(){
    // tenta voltar, se não conseguir vai para home pública
    try {
      router.back();
    } catch {
      router.replace('/');
    }
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top','left','right','bottom']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 56 }}>
        <Pressable onPress={handleClose} hitSlop={8} style={{ width:36, height:36, borderRadius:18, backgroundColor:'#17366310', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
          <ArrowLeft size={20} color="#173663" />
        </Pressable>
        <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 24, lineHeight: 32, color: '#173663', textAlign: 'center', marginBottom:20 }}>Políticas de Uso</Text>

        <PolicyCard title="1. Aceitação">
          Ao acessar ou usar o aplicativo você declara estar de acordo com estes Termos e Políticas de Privacidade. Se não concordar, deve interromper o uso imediatamente.
        </PolicyCard>
        <PolicyCard title="2. Cadastro e Veracidade">
          Você se compromete a fornecer informações verdadeiras e mantê-las atualizadas. Podemos suspender ou remover contas com dados falsos ou uso indevido.
        </PolicyCard>
        <PolicyCard title="3. Uso Adequado">
          É proibido publicar conteúdo ilegal, ofensivo, discriminatório ou que viole direitos de terceiros. Qualquer abuso poderá resultar em banimento.
        </PolicyCard>
        <PolicyCard title="4. Dados e Privacidade">
          Coletamos dados mínimos necessários para funcionamento, segurança e melhoria da experiência. Você pode solicitar exclusão conforme a legislação aplicável (LGPD). Não vendemos seus dados.
        </PolicyCard>
        <PolicyCard title="5. Segurança">
          Empregamos medidas técnicas e organizacionais razoáveis. Nenhum sistema é 100% seguro; também é sua responsabilidade manter suas credenciais protegidas.
        </PolicyCard>
        <PolicyCard title="6. Atualizações">
          Estes termos podem ser modificados. Manteremos a data da última revisão e o uso contínuo após mudanças significa concordância.
        </PolicyCard>
        <PolicyCard title="7. Suporte">
          Em caso de dúvidas utilize a opção Fale Conosco ou envie e-mail para VoluntarieiOficial@gmail.com.
        </PolicyCard>
        <PolicyCard title="8. Rescisão">
          Podemos encerrar ou suspender o acesso caso haja violação dos termos ou exigência legal. Você pode pedir remoção da sua conta a qualquer momento.
        </PolicyCard>
        <PolicyCard title="9. Limitação de Responsabilidade">
          O aplicativo é fornecido "como está" sem garantias implícitas; não nos responsabilizamos por danos indiretos decorrentes do uso.
        </PolicyCard>
        <PolicyCard title="10. Legislação">
          Aplica-se a legislação brasileira. Foro: sua comarca ou outro previsto em lei de defesa do consumidor.
        </PolicyCard>

        <Button onPress={handleClose} style={{ alignSelf:'center', width:220, height:46, borderRadius:14, backgroundColor:'#173663', justifyContent:'center', marginTop:12 }}>
          <ButtonText style={{ fontFamily:'Nunito-Bold', fontSize:16, color:'#FFFFFF' }}>Entendi</ButtonText>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

function PolicyCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom:14, backgroundColor:'#F9FAFB', borderRadius:12, padding:14, borderWidth:1, borderColor:'#E2E8F0', shadowColor:'#000', shadowOpacity:0.06, shadowRadius:4, shadowOffset:{width:0,height:2}, elevation:2 }}>
      <Text style={{ fontFamily:'Nunito-Bold', fontSize:15, color:'#173663', marginBottom:6 }}>{title}</Text>
      <Text style={{ fontFamily:'Nunito-Regular', fontSize:14, lineHeight:20, color:'#1f2937' }}>{children}</Text>
    </View>
  );
}
