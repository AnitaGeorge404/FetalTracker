import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function InfoModal({ visible, onClose }: InfoModalProps) {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="footsteps" size={20} color="#333" style={{ marginRight: 8 }} />
          <Text style={styles.title}>Steps to count fetal kicks</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.infoSection}>
            <View style={styles.bulletPoint}>
              <Text style={styles.bulletNumber}>1.</Text>
              <Text style={styles.bulletText}>
                Choose a time when you are <Text style={styles.boldText}>least distracted</Text> or when you typically <Text style={styles.boldText}>feel the fetus move.</Text>
              </Text>
            </View>

            <View style={styles.bulletPoint}>
              <Text style={styles.bulletNumber}>2.</Text>
              <Text style={styles.bulletText}>
                Get comfortable. Lie on your <Text style={styles.boldText}>left side</Text> or sit with your feet propped up.
              </Text>
            </View>

            <View style={styles.bulletPoint}>
              <Text style={styles.bulletNumber}>3.</Text>
              <Text style={styles.bulletText}>
                Place your <Text style={styles.boldText}>hands on your belly.</Text>
              </Text>
            </View>

            <View style={styles.bulletPoint}>
              <Text style={styles.bulletNumber}>4.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Start a timer</Text> or watch the clock.
              </Text>
            </View>

            <View style={styles.bulletPoint}>
              <Text style={styles.bulletNumber}>5.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Count</Text> each kick. Keep counting until you get to <Text style={styles.boldText}>10 kicks / flutters / swishes/rolls.</Text>
              </Text>
            </View>

            <View style={styles.bulletPoint}>
              <Text style={styles.bulletNumber}>6.</Text>
              <Text style={styles.bulletText}>
                Once you reach <Text style={styles.boldText}>10 kicks</Text>, <Text style={styles.boldText}>jot down</Text> how many <Text style={styles.boldText}>minutes</Text> it took.
              </Text>
            </View>
          </View>

          <View style={styles.questionSection}>
            <Text style={styles.questionText}>
              What if I am not getting enough kicks?
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  content: {
    padding: 20,
    paddingTop: 16,
  },
  infoSection: {
    marginBottom: 20,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingRight: 10,
    alignItems: 'flex-start',
  },
  bulletNumber: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginRight: 12,
    marginTop: 2,
    minWidth: 20,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  boldText: {
    fontWeight: '600',
    color: '#000',
  },
  questionSection: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  questionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
