import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import Svg, { Circle } from 'react-native-svg';

import Avatar1 from '../../assets/svg/avatar1.svg';
import Avatar2 from '../../assets/svg/avatar2.svg';
import Avatar3 from '../../assets/svg/avatar3.svg';

import styles from './login.style.js';

import { handleLogin } from './index';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Dashboard: undefined;
};

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLoginPress = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      const result = await handleLogin(username, password);
      if (result.success) {
        navigation.replace('Dashboard');
      } else {
        Alert.alert('Login Failed', result.message);
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      {/* TOP SECTION */}
      <View style={styles.topContainer}>

        {/* Background dots */}
        <Svg style={StyleSheet.absoluteFill}>
          <Circle cx="30" cy="60" r="8" fill="#B4F8C8" />
          <Circle cx="320" cy="100" r="10" fill="#A0E7E5" />
          <Circle cx="200" cy="40" r="6" fill="#FFAEBC" />
          <Circle cx="50" cy="200" r="6" fill="#CDB4DB" />
        </Svg>

        {/* Avatar Cluster */}
        <View style={styles.avatarContainer}>
          <Avatar1 width={150} height={150} style={styles.avatarLeft} />
          <Avatar2 width={150} height={150} style={styles.avatarRight} />
          <Avatar3 width={220} height={220} style={styles.avatarBottom} />

          {/* Center Tag */}
          {/* <View style={styles.centerTag}>
            <Text style={styles.centerText}>hello</Text>
          </View> */}
        </View>
        </View>
        {/* Title */}
        <View style={styles.row}>
        <Text style={styles.title}>Let’s get you</Text>
        <Text style={styles.sudotitle}>signed in!</Text>
      </View>

      {/* BOTTOM CARD */}
      <View style={styles.card}>

        <Text style={styles.subtitle}>Sign In</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#666"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onLoginPress}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupText}>
            Don’t have an account? <Text style={{ fontWeight: 'bold' }}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default LoginScreen;