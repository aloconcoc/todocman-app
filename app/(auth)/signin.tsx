import { Text, View } from "@/components/Themed";
import { StyleSheet, Button } from "react-native";
import { router } from 'expo-router';

export default function Login() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <Button
        title="home"
        onPress={() => router.navigate('(drawer)/(tabs)/home')}
      />
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',
    },
  });