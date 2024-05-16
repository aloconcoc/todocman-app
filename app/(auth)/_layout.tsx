import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {

  //if logged in
  //return <Redirect href="/(tabs)" />;
  
  return (
    
    <Stack>
            <Stack.Screen name="signin" options={{headerShown:false}}/>
            <Stack.Screen name="signup" options={{headerShown:false}}/>
        </Stack>
  )
}
