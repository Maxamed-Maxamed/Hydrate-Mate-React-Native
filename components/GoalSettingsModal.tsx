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

interface GoalSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  currentGoal: number;
  onUpdateGoal: (goal: number) => void;
}

export const GoalSettingsModal: React.FC<GoalSettingsModalProps> = ({
  visible,
  onClose,
  currentGoal,
  onUpdateGoal,
}) => {
  const [goalText, setGoalText] = useState(currentGoal.toString());

  const handleSave = () => {
    const newGoal = parseInt(goalText, 10);
    
    if (isNaN(newGoal) || newGoal < 500 || newGoal > 5000) {
      Alert.alert(
        'Invalid Goal',
        'Please enter a goal between 500ml and 5000ml (0.5L - 5L)'
      );
      return;
    }

    onUpdateGoal(newGoal);
    onClose();
  };

  const presetGoals = [1500, 2000, 2500, 3000];

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
            <Text style={styles.title}>Daily Goal</Text>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.description}>
              Set your daily hydration goal. Most adults should aim for 2-3 liters per day.
            </Text>

            <View style={styles.inputSection}>
              <Text style={styles.label}>Custom Goal (ml)</Text>
              <TextInput
                style={styles.input}
                value={goalText}
                onChangeText={setGoalText}
                placeholder="Enter goal in ml"
                placeholderTextColor="#95a5a6"
                keyboardType="numeric"
                returnKeyType="done"
                maxLength={4}
              />
            </View>

            <View style={styles.presetSection}>
              <Text style={styles.label}>Quick Select</Text>
              <View style={styles.presetGrid}>
                {presetGoals.map((goal) => (
                  <TouchableOpacity
                    key={goal}
                    style={[
                      styles.presetButton,
                      parseInt(goalText, 10) === goal && styles.presetButtonSelected,
                    ]}
                    onPress={() => setGoalText(goal.toString())}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.presetText,
                      parseInt(goalText, 10) === goal && styles.presetTextSelected,
                    ]}>
                      {goal}ml
                    </Text>
                  <Text style={[
                    styles.presetSubtext,
                    parseInt(goalText, 10) === goal && styles.presetSubtextSelected,
                  ]}>
                    {(goal / 1000).toFixed(1)}L
                  </Text>
                </TouchableOpacity>
              ))}
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
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#007BFF',
    borderRadius: 8,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 30,
    lineHeight: 24,
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
  presetSection: {
    marginBottom: 20,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  presetButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e1e4e8',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    minWidth: '45%',
  },
  presetButtonSelected: {
    borderColor: '#007BFF',
    backgroundColor: '#e3f2fd',
  },
  presetText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  presetTextSelected: {
    color: '#007BFF',
  },
  presetSubtext: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  presetSubtextSelected: {
    color: '#007BFF',
  },
});
