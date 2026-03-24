import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // use community picker

const LeaveApplicationScreen = () => {
  const [leaveType, setLeaveType] = useState('Annual Leave');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reason, setReason] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleSubmit = () => {
    // Placeholder for submit logic
    console.log('Leave submitted:', {
      leaveType,
      startDate,
      endDate,
      reason,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leave Application</Text>

      <Text style={styles.label}>Leave Type</Text>
      <Picker
        selectedValue={leaveType}
        style={styles.picker}
        onValueChange={(itemValue) => setLeaveType(itemValue)}
      >
        <Picker.Item label="Annual Leave" value="Annual Leave" />
        <Picker.Item label="Sick Leave" value="Sick Leave" />
        <Picker.Item label="Special Leave" value="Special Leave" />
      </Picker>

      <Text style={styles.label}>Start Date</Text>
      <TouchableOpacity
        style={styles.dateBtn}
        onPress={() => setShowStartPicker(true)}
      >
        <Text>{startDate.toDateString()}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>End Date</Text>
      <TouchableOpacity
        style={styles.dateBtn}
        onPress={() => setShowEndPicker(true)}
      >
        <Text>{endDate.toDateString()}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Reason</Text>
      <TextInput
        style={styles.input}
        value={reason}
        onChangeText={setReason}
        placeholder="Enter reason for leave"
        multiline
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Application</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LeaveApplicationScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 20, color: '#1C1C1E' },
  label: { fontSize: 14, fontWeight: '600', marginTop: 12, marginBottom: 6 },
  picker: { backgroundColor: '#fff', borderRadius: 8 },
  dateBtn: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#5DB7A3',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
