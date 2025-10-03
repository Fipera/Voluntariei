import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VoluntaryScheduleScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top','left','right','bottom']}>
      <VStack style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
        <Text style={{ fontSize:22, fontFamily:'Nunito-Bold' }}>Agenda</Text>
      </VStack>
    </SafeAreaView>
  );
}
