import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const RecordsScreen = () => {
  const [records, setRecords] = useState([
    { date: '2026-03-20', check_in_time: '09:00', check_out_time: '17:30', work_hours: 8.5 },
    { date: '2026-03-21', check_in_time: '09:15', check_out_time: '17:00', work_hours: 7.75 },
    { date: '2026-03-22', check_in_time: '09:05', check_out_time: '18:00', work_hours: 8.9 },
  ]);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.date}</Text>
      <Text style={styles.cell}>{item.check_in_time || '--'}</Text>
      <Text style={styles.cell}>{item.check_out_time || '--'}</Text>
      <Text style={styles.cell}>{item.work_hours?.toFixed(2) || '--'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Records</Text>
      <View style={styles.headerRow}>
        <Text style={[styles.cell, styles.header]}>Date</Text>
        <Text style={[styles.cell, styles.header]}>Check-In</Text>
        <Text style={[styles.cell, styles.header]}>Check-Out</Text>
        <Text style={[styles.cell, styles.header]}>Hours</Text>
      </View>
      <FlatList
        data={records}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default RecordsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: '#1C1C1E' },
  headerRow: { flexDirection: 'row', marginBottom: 8 },
  row: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  cell: { flex: 1, fontSize: 13, color: '#1C1C1E' },
  header: { fontWeight: '700', color: '#5DB7A3' },
});
