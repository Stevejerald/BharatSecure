import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SecurityCheckStatus = 'checking' | 'passed' | 'failed';
type CurrentCheck = 'jailbreak' | 'malware' | 'integrity' | 'authenticating' | '';

export default function SecurityCheck() {
  const [securityStatus, setSecurityStatus] = useState<SecurityCheckStatus>('checking');
  const [currentCheck, setCurrentCheck] = useState<CurrentCheck>('jailbreak');
  const [progress, setProgress] = useState(0);

  // Simulate device security checks
  const checkJailbreak = async (): Promise<boolean> => {
    setCurrentCheck('jailbreak');
    setProgress(25);

    // Simulate jailbreak detection delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate random check (in real app, this would use actual detection libraries)
    const isJailbroken = Math.random() < 0.1; // 10% chance of detection for demo
    return !isJailbroken;
  };

  const checkMalware = async (): Promise<boolean> => {
    setCurrentCheck('malware');
    setProgress(50);

    // Simulate malware scanning delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Simulate random check (in real app, this would use antivirus SDK)
    const hasMalware = Math.random() < 0.05; // 5% chance of detection for demo
    return !hasMalware;
  };

  const checkDeviceIntegrity = async (): Promise<boolean> => {
    setCurrentCheck('integrity');
    setProgress(75);

    // Simulate integrity verification delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate random check (in real app, this would check device certificates, etc.)
    const isCompromised = Math.random() < 0.08; // 8% chance of detection for demo
    return !isCompromised;
  };

  const performSecurityChecks = useCallback(async () => {
    try {
      const results = await Promise.all([
        checkJailbreak(),
        checkMalware(),
        checkDeviceIntegrity(),
      ]);

      const allPassed = results.every(result => result === true);

      if (allPassed) {
        setProgress(100);
        setCurrentCheck('authenticating');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mark user as logged in
        await AsyncStorage.setItem('hasLoggedIn', 'true');

        // Navigate to verification screen instead of main app
        router.replace('/verification');
      } else {
        setSecurityStatus('failed');
        setProgress(0);

        Alert.alert(
          'Security Check Failed',
          'Your device failed security verification. This could be due to jailbreak, malware, or compromised device integrity. Please contact support if you believe this is an error.',
          [
            {
              text: 'Try Again',
              onPress: () => {
                setSecurityStatus('checking');
                setCurrentCheck('jailbreak');
                performSecurityChecks();
              }
            },
            {
              text: 'Back to Login',
              style: 'cancel',
              onPress: () => router.replace('/login')
            }
          ]
        );
      }
    } catch (error) {
      setSecurityStatus('failed');
      Alert.alert('Error', 'Security check failed. Please try again.');
      console.error('Security check error:', error);
    }
  }, []);

  useEffect(() => {
    const runSecurityChecks = async () => {
      await performSecurityChecks();
    };

    runSecurityChecks();
  }, [performSecurityChecks]);

  const getCheckMessage = () => {
    switch (currentCheck) {
      case 'jailbreak':
        return 'Checking for jailbreak/root access...';
      case 'malware':
        return 'Scanning for malware and viruses...';
      case 'integrity':
        return 'Verifying device integrity...';
      case 'authenticating':
        return 'Authenticating...';
      default:
        return 'Performing security checks...';
    }
  };

  const getStatusColor = () => {
    switch (securityStatus) {
      case 'checking':
        return '#007AFF';
      case 'passed':
        return '#34C759';
      case 'failed':
        return '#FF3B30';
      default:
        return '#007AFF';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      <View style={styles.header}>
        <Text style={styles.title}>BharatSecure</Text>
        <Text style={styles.subtitle}>Device Security Verification</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.securityIcon}>
          <ActivityIndicator size="large" color={getStatusColor()} />
        </View>

        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getCheckMessage()}
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                  backgroundColor: getStatusColor()
                }
              ]}
            />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>

        <View style={styles.securityInfo}>
          <Text style={styles.infoTitle}>Security Checks Include:</Text>
          <Text style={styles.infoItem}>• Jailbreak/Root Detection</Text>
          <Text style={styles.infoItem}>• Malware & Virus Scanning</Text>
          <Text style={styles.infoItem}>• Device Integrity Verification</Text>
          <Text style={styles.infoItem}>• System Security Validation</Text>
        </View>

        {securityStatus === 'failed' && (
          <View style={styles.failedContainer}>
            <Text style={styles.failedTitle}>Security Check Failed</Text>
            <Text style={styles.failedText}>
              Your device did not pass security verification. This may be due to:
            </Text>
            <Text style={styles.failedReason}>• Unauthorized system modifications</Text>
            <Text style={styles.failedReason}>• Malware or security threats detected</Text>
            <Text style={styles.failedReason}>• Compromised device integrity</Text>
          </View>
        )}
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
  securityIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  statusText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 32,
    minHeight: 28,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 40,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#666',
  },
  securityInfo: {
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  infoItem: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    lineHeight: 22,
  },
  failedContainer: {
    backgroundColor: '#fff5f5',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#fed7d7',
    marginTop: 20,
  },
  failedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e53e3e',
    marginBottom: 12,
  },
  failedText: {
    fontSize: 16,
    color: '#e53e3e',
    marginBottom: 12,
    lineHeight: 22,
  },
  failedReason: {
    fontSize: 14,
    color: '#e53e3e',
    marginBottom: 6,
    lineHeight: 20,
  },
});
