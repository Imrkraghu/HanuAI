import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { apiCall } from '../../utils/api';
import { Alert } from 'react-native';
import { getCurrentDateTime } from '../../utils/datetime';

export async function MarkAttendance({
  selectedType,
  selectedOffice,
  capturedPhotoData,
  location_lat,
  location_lng,
  navigation,
}) {
  if (!selectedType) {
    Alert.alert('Error', 'Please select WFH / Office / Client');
    return;
  }
  if (selectedType === 'office' && !selectedOffice) {
    Alert.alert('Error', 'Please select an office');
    return;
  }
  if (!capturedPhotoData) {
    Alert.alert('Error', 'Please capture a photo');
    return;
  }

  try {
    const currentUser = JSON.parse(await AsyncStorage.getItem('attendanceUser'));
    const now = getCurrentDateTime();

    // Log original size
    const originalStats = await RNFS.stat(capturedPhotoData);
    console.log('Original size KB:', (originalStats.size / 1024).toFixed(2));

    // Convert to base64
    const base64Image = await RNFS.readFile(capturedPhotoData, 'base64');
    console.log('Base64 length:', base64Image.length);
    console.log('Approx size KB:', (base64Image.length * 3 / 4 / 1024).toFixed(2));

    // Build payload
    const payload = {
      employee_id: currentUser.id,
      date: now.date,
      check_in: now.time,
      type: selectedType,
      status: selectedType === 'office' ? 'present' : selectedType,
      office_id: selectedType === 'office' ? selectedOffice : null,
      location: {
        latitude: location_lat,
        longitude: location_lng,
      },
      photo: `data:image/jpeg;base64,${base64Image}`,
    };

    console.log('Payload:', payload);

    // API call
    const r = await apiCall('mark-attendance', 'POST', payload);
    if (r && r.success) {
      Alert.alert('Success', 'Attendance marked successfully');
      navigation.navigate('Dashboard');
    } else {
      Alert.alert('Error', (r && r.message) || 'Failed to mark attendance');
    }
  } catch (e) {
    console.error('MarkAttendance error:', e);
    Alert.alert('Error', 'Something went wrong while marking attendance');
  }
}