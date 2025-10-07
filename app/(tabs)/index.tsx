import React from 'react';
import { StyleSheet, ScrollView, Alert, Text, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('hasLoggedIn');
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.welcome}>Welcome to BharatSecure</Text>
      <Text style={styles.subtitle}>Your security is our priority</Text>

      <View style={styles.features}>
        <View style={styles.feature}>
          <Text style={styles.featureTitle}>Secure Authentication</Text>
          <Text style={styles.featureDescription}>
            Your account is protected with industry-standard security measures.
          </Text>
        </View>

        <View style={styles.feature}>
          <Text style={styles.featureTitle}>Phone Verification</Text>
          <Text style={styles.featureDescription}>
            Secure login using your verified phone number.
          </Text>
        </View>

        <View style={styles.feature}>
          <Text style={styles.featureTitle}>Privacy First</Text>
          <Text style={styles.featureDescription}>
            Your personal data is encrypted and never shared with third parties.
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  features: {
    marginBottom: 40,
  },
  feature: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
