// login.js

import AsyncStorage from '@react-native-async-storage/async-storage';

// Get stored logged-in user
export async function getCurrentUser() {
  try {

    const userData =
      await AsyncStorage.getItem('attendanceUser');

    if (!userData) {
      return null;
    }

    return JSON.parse(userData);

  } catch (error) {

    console.error(
      "Error getting current user:",
      error
    );

    return null;
  }
}