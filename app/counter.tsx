import InfoModal from '@/components/InfoModal';
import { TrackingSession } from '@/types/tracking';
import { StorageService } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';

export default function CounterScreen() {
  const router = useRouter();
  const [kickCount, setKickCount] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isTracking && kickCount < 10) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTracking, kickCount]);

  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleKick = () => {
    if (!isTracking) {
      setIsTracking(true);
      startTimeRef.current = Date.now();
    }

    if (kickCount < 10) {
      Vibration.vibrate(50);
      setKickCount((prev) => prev + 1);
      
      // Auto-save when 10 kicks are reached
      if (kickCount + 1 === 10) {
        setIsTracking(false);
      }
    }
  };

  const handleSave = async () => {
    if (kickCount === 0) {
      Alert.alert('No Kicks Recorded', 'Please record at least one kick before saving.');
      return;
    }

    const timeInMinutes = Math.ceil(seconds / 60);

    const session: TrackingSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      timeInMinutes: timeInMinutes || 1, // Minimum 1 minute
      kickCount: kickCount,
      createdAt: Date.now(),
    };

    try {
      await StorageService.saveSession(session);
      Alert.alert(
        'Session Saved!',
        `You tracked ${kickCount} kicks in ${timeInMinutes} minute${timeInMinutes !== 1 ? 's' : ''}.`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save session. Please try again.');
      console.error('Save error:', error);
    }
  };

  const handleBack = () => {
    if (kickCount > 0 || isTracking) {
      Alert.alert(
        'Discard Session?',
        'Are you sure you want to go back? Your current tracking session will be lost.',
        [
          {
            text: 'Stay',
            style: 'cancel',
          },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };

  const showInfoQuestion = () => {
    Alert.alert(
      'Not Getting Enough Kicks?',
      'If you\'re not feeling enough movements, try:\n\n• Having a cold drink or snack\n• Lying on your left side\n• Gently poking your belly\n• Playing music\n\nIf you\'re still concerned, contact your healthcare provider immediately.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Record DFM</Text>
        <TouchableOpacity 
          style={styles.infoButton}
          onPress={() => setInfoModalVisible(true)}
        >
          <Ionicons name="information-circle-outline" size={28} color="#7B61FF" />
        </TouchableOpacity>
      </View>

      {/* Status Message */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {kickCount === 10 
            ? 'Stop recording after' 
            : kickCount === 0 
            ? 'Tap button to start counting' 
            : `Recording... ${kickCount} of 10 kicks`}
        </Text>
        <Text style={styles.statusSubtext}>
          {kickCount === 10 ? '10 kicks' : kickCount > 0 ? `${10 - kickCount} more to go` : ''}
        </Text>
      </View>

      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(seconds)}</Text>
      </View>

      {/* Kick Counter Circle */}
      <View style={styles.counterCircle}>
        <Text style={styles.counterNumber}>{kickCount}</Text>
        <Text style={styles.counterLabel}>/ 10</Text>
        {kickCount === 10 && (
          <View style={styles.completeBadge}>
            <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
          </View>
        )}
      </View>

      {/* Kick Button */}
      <TouchableOpacity
        style={[
          styles.kickButton,
          kickCount >= 10 && styles.kickButtonDisabled,
          !isTracking && kickCount === 0 && styles.kickButtonInitial
        ]}
        onPress={handleKick}
        disabled={kickCount >= 10}
        activeOpacity={0.7}
      >
        {kickCount >= 10 ? (
          <View style={styles.kickButtonContent}>
            <Ionicons name="checkmark" size={60} color="white" />
            <Text style={styles.kickButtonText}>Complete</Text>
          </View>
        ) : (
          <View style={styles.kickButtonContent}>
            <Ionicons name="hand-left" size={60} color="white" />
            <Text style={styles.kickButtonText}>Tap to Count</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSave}
        >
          <Text style={styles.actionButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.questionButton]}
          onPress={showInfoQuestion}
        >
          <Text style={styles.questionButtonText}>
            What if I am not getting enough kicks?
          </Text>
        </TouchableOpacity>
      </View>

      {/* Info Modal */}
      <InfoModal 
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 5,
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  infoButton: {
    padding: 5,
    width: 40,
    alignItems: 'flex-end',
  },
  statusContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  statusSubtext: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  timerText: {
    fontSize: 72,
    fontWeight: '300',
    color: '#333',
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
  },
  counterCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#7B61FF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 30,
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  counterNumber: {
    fontSize: 64,
    fontWeight: 'bold',
    color: 'white',
  },
  counterLabel: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  completeBadge: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 2,
  },
  kickButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  kickButtonInitial: {
    backgroundColor: '#7B61FF',
  },
  kickButtonDisabled: {
    backgroundColor: '#000000',
  },
  kickButtonContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  kickButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginTop: 8,
  },
  actionButtons: {
    paddingHorizontal: 20,
    gap: 16,
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  questionButton: {
    backgroundColor: 'white',
    borderColor: '#E0E0E0',
  },
  questionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
});
