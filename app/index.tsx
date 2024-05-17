import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';

export default function HomeScreen() {
  return (
    <ImageBackground
      source={require('@/assets/images/load4.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Redirect href={'/(auth)/signin'} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
