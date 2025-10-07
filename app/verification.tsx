import React, { useState } from 'react';
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
  const [isSending, setIsSending] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [countdown, setCountdown] = useState(20);
  const [verificationCode, setVerificationCode] = useState('');

  // Generate a unique 6-digit verification code
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

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
    }
  };

  const handleProceedVerification = async () => {
    setIsSending(true);

    try {
      const code = generateVerificationCode();
      setVerificationCode(code);

      const phoneNumber = '9025740156';
      const message = `Your BharatSecure verification code is: ${code}. Please enter this code to complete your login. Valid for 20 seconds.`;

      // Send the SMS
      const smsSuccess = await sendSMS(phoneNumber, message);

      if (smsSuccess) {
        setSmsSent(true);
        setCountdown(20);

        // Start countdown timer
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
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
      console.error('SMS error:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (smsSent) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

        <View style={styles.header}>
          <Text style={styles.title}>BharatSecure</Text>
          <Text style={styles.subtitle}>SMS Sent Successfully</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✅</Text>
          </View>

          <Text style={styles.successTitle}>Verification Code Sent!</Text>
          <Text style={styles.successDescription}>
            We ve sent a 6-digit verification code to your phone number. The code will expire in:
          </Text>

          <View style={styles.countdownContainer}>
            <Text style={styles.countdownText}>{countdown}</Text>
            <Text style={styles.countdownLabel}>seconds</Text>
          </View>

          <Text style={styles.codeDisplay}>
            Code: <Text style={styles.codeHighlight}>{verificationCode}</Text>
          </Text>

          <Text style={styles.instructionText}>
            Please check your SMS and the app will automatically proceed once the timer expires.
          </Text>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.skipButtonText}>Skip Timer (Demo)</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      <View style={styles.header}>
        <Text style={styles.title}>BharatSecure</Text>
        <Text style={styles.subtitle}>Phone Verification</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.verificationIcon}>
          <Text style={styles.iconText}>📱</Text>
        </View>

        <Text style={styles.mainTitle}>Verify Your Phone Number</Text>
        <Text style={styles.description}>
          To ensure the security of your account, we need to verify your phone number. We ll send you a verification code via SMS.
        </Text>

        <View style={styles.phoneInfo}>
          <Text style={styles.phoneLabel}>Phone Number:</Text>
          <Text style={styles.phoneNumber}>+91 9025740156</Text>
        </View>

        <TouchableOpacity
          style={[styles.verifyButton, isSending && styles.buttonDisabled]}
          onPress={handleProceedVerification}
          disabled={isSending}
        >
          <Text style={styles.verifyButtonText}>
            {isSending ? 'Sending SMS...' : 'Send Verification Code'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          By proceeding, you ll receive an SMS with a 6-digit verification code. The code expires in 20 seconds.
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
});
