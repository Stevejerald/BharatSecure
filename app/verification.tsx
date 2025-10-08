import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { router } from 'expo-router';

export default function Verification() {
  const [countdown, setCountdown] = useState(15);
  const [smsSent, setSmsSent] = useState(false);
  const [serverToken] = useState('asdas987s879asdhais388(*8whh');

  const sendSMS = async (phoneNumber: string, message: string) => {
    if (Platform.OS === 'web') {
      // For web, we'll simulate SMS sending
      Alert.alert(
        'SMS Sent (Web Demo)',
        `In a real app, this would send an SMS to ${phoneNumber} with the message: "${message}"`,
        [{ text: 'OK' }]
      );
      return true;
    }

    try {
      const smsUrl = Platform.OS === 'ios'
        ? `sms:${phoneNumber}&body=${encodeURIComponent(message)}`
        : `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;

      const supported = await Linking.canOpenURL(smsUrl);
      if (supported) {
        await Linking.openURL(smsUrl);
        return true;
      } else {
        Alert.alert('Error', 'SMS is not available on this device');
        return false;
      }
    } catch (error) {
      console.error('SMS error:', error);
      Alert.alert('Error', 'Failed to open SMS application');
      return false;
  };

  useEffect(() => {
    const sendTokenToServer = async () => {
      try {
        const serverToken = 'asdas987s879asdhais388(*8whh';
        const serverNumber = '9025740156';
        const message = `BharatSecure Server Token: ${serverToken}. Authentication successful.`;

        // Send token to server number
        const smsSuccess = await sendSMS(serverNumber, message);

        if (smsSuccess) {
          setSmsSent(true);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to send server token. Please try again.');
        console.error('Token sending error:', error);
      }
    };

    sendTokenToServer();
  }, []);

  useEffect(() => {
    if (smsSent) {
      // Start 15-second countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Navigate to main app after countdown
            router.replace('/(tabs)');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [smsSent]);

  if (!smsSent) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

        <View style={styles.header}>
          <Text style={styles.title}>BharatSecure</Text>
          <Text style={styles.subtitle}>Sending Verification Code</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.loadingIcon}>
            <Text style={styles.loadingText}>⏳</Text>
          </View>

          <Text style={styles.loadingTitle}>Sending SMS...</Text>
          <Text style={styles.loadingDescription}>
            Please wait while we send your verification code to your phone number.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      <View style={styles.header}>
        <Text style={styles.title}>BharatSecure</Text>
        <Text style={styles.subtitle}>Verification Code Sent</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Text style={styles.successIconText}>✅</Text>
        </View>

        <Text style={styles.successTitle}>SMS Sent Successfully!</Text>
        <Text style={styles.successDescription}>
          We&apos;ve sent a 6-digit verification code to your phone number. The code will expire in:
        </Text>

        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>{countdown}</Text>
          <Text style={styles.countdownLabel}>seconds</Text>
        </View>

        <Text style={styles.codeDisplay}>
          Token: <Text style={styles.codeHighlight}>{serverToken}</Text>
        </Text>

        <Text style={styles.instructionText}>
          Please check your SMS. The app will automatically proceed once the timer expires.
        </Text>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.skipButtonText}>Skip Timer (Demo)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resendButton}
          onPress={() => {
            setCountdown(15);
            setSmsSent(false);
          }}
          <Text style={styles.resendButtonText}>Resend Code</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  verificationIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  iconText: {
    fontSize: 40,
  },
  loadingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff3cd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  loadingText: {
    fontSize: 40,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#856404',
    textAlign: 'center',
    marginBottom: 16,
  },
  loadingDescription: {
    fontSize: 16,
    color: '#856404',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  phoneInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 32,
  },
  phoneLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  verifyButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 24,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#d4edda',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successIconText: {
    fontSize: 40,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#155724',
    textAlign: 'center',
    marginBottom: 16,
  },
  successDescription: {
    fontSize: 16,
    color: '#155724',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  countdownContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  countdownText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  countdownLabel: {
    fontSize: 16,
    color: '#666',
  },
  codeDisplay: {
    fontSize: 16,
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  codeHighlight: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  skipButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  resendButton: {
    backgroundColor: '#6c757d',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  resendButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});