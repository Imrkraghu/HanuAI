import { Alert } from 'react-native';
import { apiCall } from '../../utils/api';
export async function handleSignup(form, setLoading, navigation) {
  const {
    fullName,
    email,
    mobile,
    department,
    office,
    username,
    password,
    confirmPassword,
  } = form;

  // Validation
  if (!fullName || !email || !mobile || !username || !password) {
    Alert.alert('Error', 'Please fill all required fields');
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert('Error', 'Passwords do not match');
    return;
  }

  const formData = {
    name: fullName,
    phone: mobile,
    email: email,
    department: department,
    primary_office: office,
    username: username,
    password: password,
  };

  try {
    setLoading(true);

    const result = await apiCall('register', 'POST', formData);

    if (result.success) {
      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('Login');

    } else {
      Alert.alert('Error', result.message || 'Registration failed');
    }

  } catch (err) {
    console.error(err);
    Alert.alert('Error', 'Something went wrong');
  } finally {
    setLoading(false);
  }
};