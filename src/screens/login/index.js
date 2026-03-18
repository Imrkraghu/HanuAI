// login.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiCall } from '../../utils/api';

export async function handleLogin(username, password) {
  if (!username || !password) {
    return { success: false, message: "Please enter username and password" };
  }

  try {
    const loginRes = await apiCall('login', 'POST', { username, password });
    if (!loginRes.success) {
      return { success: false, message: loginRes.message || "Login failed" };
    }

    await AsyncStorage.setItem('attendanceUser', JSON.stringify(loginRes.user));
    if (loginRes.token) {
      await AsyncStorage.setItem('authToken', loginRes.token);
    }

    return { success: true, user: loginRes.user };
  } catch (error) {
    console.error("Login process error:", error);
    return { success: false, message: "Unexpected error during login" };
  }
}