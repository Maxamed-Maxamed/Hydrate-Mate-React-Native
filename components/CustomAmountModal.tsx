import { HydrationEntry } from '@/context/hydrationStore';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface CustomAmountModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (amount: number, type: HydrationEntry['type']) => void;
  units: 'ml' | 'oz';
}

const drinkTypes: HydrationEntry['type'][] = ['Water', 'Tea', 'Coffee', 'Juice', 'Sports Drink', 'Other'];

export const CustomAmountModal: React.FC<CustomAmountModalProps> = ({
  visible,
  onClose,
  onAdd,
  units,
}) => {
  const [amount, setAmount] = useState('');
  const [selectedType, setSelectedType] = useState<HydrationEntry['type']>('Water');

  const handleAdd = () => {
    const numAmount = parseFloat(amount);
    
    if (!amount.trim()) {
      Alert.alert('Missing Amount', 'Please enter an amount');
      return;
    }
    
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0');
      return;
    }
    
    // Different validation limits based on units
    const maxAmount = units === 'ml' ? 3000 : 100; // 3L or 100oz
    if (numAmount > maxAmount) {
      Alert.alert(
        'Large Amount', 
        `That seems like a very large amount (${numAmount}${units}). Are you sure?`, 
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Add Anyway', 
            onPress: () => {
              onAdd(Math.round(numAmount), selectedType);
              setAmount('');
              onClose();
            }
          }
        ]
      );
      return;
    }

    onAdd(Math.round(numAmount), selectedType);
    setAmount('');
    onClose();
  };

  const getDrinkEmoji = (type: HydrationEntry['type']): string => {
    switch (type) {
      case 'Water': return '💧';
      case 'Tea': return '🍵';
      case 'Coffee': return '☕';
      case 'Juice': return '🧃';
      case 'Sports Drink': return '🥤';
      default: return '🥛';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Add Custom Amount</Text>
            <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
              <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Amount Input */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Amount ({units})</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder={`Enter amount in ${units}`}
                placeholderTextColor="#95a5a6"
                keyboardType="numeric"
                autoFocus
                returnKeyType="done"
                maxLength={6}
              />
            </View>

            {/* Drink Type Selection */}
            <View style={styles.typeSection}>
              <Text style={styles.label}>Drink Type</Text>
              <View style={styles.typeGrid}>
                {drinkTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      selectedType === type && styles.typeButtonSelected,
                    ]}
                    onPress={() => setSelectedType(type)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.typeEmoji}>{getDrinkEmoji(type)}</Text>
                    <Text style={[
                      styles.typeText,
                      selectedType === type && styles.typeTextSelected,
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Quick Amount Suggestions */}
            <View style={styles.quickSection}>
              <Text style={styles.label}>Quick Add</Text>
              <View style={styles.quickButtons}>
                {(units === 'ml' ? [100, 250, 500, 750] : [4, 8, 16, 24]).map((quickAmount) => (
                  <TouchableOpacity
                    key={quickAmount}
                    style={styles.quickButton}
                    onPress={() => setAmount(quickAmount.toString())}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.quickButtonText}>{quickAmount}{units}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Helpful Tips */}
            <View style={styles.tipsSection}>
              <Text style={styles.label}>💡 Tips</Text>
              <View style={styles.tipCard}>
                <Text style={styles.tipText}>
                  • Standard water bottle: 500ml (16oz)
                </Text>
                <Text style={styles.tipText}>
                  • Coffee mug: 250ml (8oz)
                </Text>
                <Text style={styles.tipText}>
                  • Large glass: 300ml (10oz)
                </Text>
                <Text style={styles.tipText}>
                  • Sports bottle: 750ml (24oz)
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelText: {
    color: '#007BFF',
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#007BFF',
    borderRadius: 8,
  },
  addText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputSection: {
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e4e8',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    color: '#2c3e50',
  },
  typeSection: {
    marginBottom: 30,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e1e4e8',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    minWidth: '30%',
    marginBottom: 10,
  },
  typeButtonSelected: {
    borderColor: '#007BFF',
    backgroundColor: '#e3f2fd',
  },
  typeEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  typeText: {
    fontSize: 14,
    color: '#2c3e50',
    textAlign: 'center',
  },
  typeTextSelected: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  quickSection: {
    marginBottom: 30,
  },
  quickButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  quickButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  quickButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tipsSection: {
    marginBottom: 20,
  },
  tipCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e1e4e8',
  },
  tipText: {
    fontSize: 14,
    color: '#5a6c7d',
    marginBottom: 5,
    lineHeight: 20,
  },
});
