import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen: React.FC = () => {

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout', 
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.clear();
          } catch (err) {
            console.error('Logout error:', err);
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>R</Text>
        </View>
        <Text style={styles.name}>Rohit</Text>
      </View>

      <TouchableOpacity style={styles.option} onPress={handleLogout}>
        <Text style={styles.logout}>Log out</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>App version: 3.0</Text>
        <Text style={styles.footerText}>Date: 28/01/2026</Text>
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc' },
  profile: { alignItems: 'center', marginBottom: 30 },
  avatar: {
    backgroundColor: '#016dbf',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '700' },
  name: { fontSize: 20, fontWeight: '700', marginTop: 10, color: '#1C1C1E' },
  option: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  logout: { color: '#FF3B30', fontWeight: '700', fontSize: 16 },
  footer: { marginTop: 'auto', alignItems: 'center' },
  footerText: { fontSize: 13, color: '#8E8E93', marginTop: 4 },
});


