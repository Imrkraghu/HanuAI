import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import styles from './setting.style.js';

const SettingsScreen: React.FC = () => {

  const navigation = useNavigation();

  const [user, setUser] = useState<any>(null);

  // Load user when screen opens
  useEffect(() => {

    const loadUser = async () => {

      try {

        const userData =
          await AsyncStorage.getItem('attendanceUser');

        if (userData) {

          const parsedUser =
            JSON.parse(userData);

          setUser(parsedUser);

          console.log(
            'Current user in Settings:',
            parsedUser
          );

        }

      } catch (error) {

        console.error(
          'Error loading user:',
          error
        );

      }

    };

    loadUser();

  }, []);

  // Logout Function
  const handleLogout = () => {

    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },

        {
          text: 'Logout',
          style: 'destructive',

          onPress: async () => {

            try {

              await AsyncStorage.clear();

              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });

            } catch (err) {

              console.error(
                'Logout error:',
                err
              );

              Alert.alert(
                'Error',
                'Failed to logout. Please try again.'
              );

            }

          },
        },
      ]
    );

  };

  // Default values
  const userName =
    user?.name || 'User';

  const avatarEmoji =
    user?.avatar_emoji || '👤';

  return (

    <View style={styles.container}>

      {/* Profile Section */}

      <View style={styles.profile}>

        <View style={styles.avatar}>

          <Text style={styles.avatarText}>
            {avatarEmoji}
          </Text>

        </View>

        <Text style={styles.name}>
          {userName}
        </Text>

        <Text style={styles.email}>
          {user?.email}
        </Text>

      </View>


      {/* Logout Option */}

      <TouchableOpacity
        style={styles.option}
        onPress={handleLogout}
      >

        <Text style={styles.logout}>
          Log out
        </Text>

      </TouchableOpacity>


      {/* Footer */}

      <View style={styles.footer}>

        <Text style={styles.footerText}>
          App version: 0.2
        </Text>

        <Text style={styles.footerText}>
          Date: 28/01/2026
        </Text>

      </View>

    </View>

  );

};

export default SettingsScreen;