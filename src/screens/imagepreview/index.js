import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiCall } from '../../utils/api';
import { Alert } from 'react-native';
import { getCurrentDateTime } from '../../utils/datetime';

export async function MarkAttendance({ selectedType, selectedOffice, capturedPhotoData, location_lat, location_lng, navigation }) {
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

  const currentUser = JSON.parse(await AsyncStorage.getItem('attendanceUser'));
  const now = getCurrentDateTime();

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
    photo: capturedPhotoData,
  };

  try {
    const r = await apiCall('mark-attendance', 'POST', payload);
    if (r && r.success) {
      Alert.alert('Success', 'Attendance marked successfully');
      navigation.navigate('Dashboard');
    } else {
      Alert.alert('Error', (r && r.message) || 'Failed to mark attendance');
    }
  } catch (e) {
    Alert.alert('Error', 'Something went wrong while marking attendance');
  }
}