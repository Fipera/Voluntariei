import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';


export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>This screen doesn't exist.</Text>
        <Link href="/" >
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
