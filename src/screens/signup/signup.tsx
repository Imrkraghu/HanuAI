import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { handleSignup as signupApi } from './index.js'; 
import styles from './signup.style.js';

const SignupScreen = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false); 

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    department: '',
    office: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const onSignupPress = async () => {
    await signupApi(form, setLoading, navigation);
  };

  return (
    <View style={styles.container}>

      {/* Top Section */}
      <View style={styles.topContainer}>
        <Text style={styles.title}>Create your account</Text>
      </View>

      {/* Bottom Card */}
      <View style={styles.card}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Row 1 */}
          <View style={styles.row}>
            <TextInput
              style={styles.halfInput}
              placeholder="Full Name"
              placeholderTextColor="#666"
              value={form.fullName}
              onChangeText={(t) => handleChange('fullName', t)}
            />
            <TextInput
              style={styles.halfInput}
              placeholder="Mobile"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              value={form.mobile}
              onChangeText={(t) => handleChange('mobile', t)}
            />
          </View>

          {/* Email */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(t) => handleChange('email', t)}
          />

          {/* Row 2 */}
          <View style={styles.row}>
            <TextInput
              style={styles.halfInput}
              placeholder="Username"
              placeholderTextColor="#666"
              value={form.username}
              onChangeText={(t) => handleChange('username', t)}
            />
            <TextInput
              style={styles.halfInput}
              placeholder="Department"
              placeholderTextColor="#666"
              value={form.department}
              onChangeText={(t) => handleChange('department', t)}
            />
          </View>

          {/* Office */}
          <TextInput
            style={styles.input}
            placeholder="Office Location"
            placeholderTextColor="#666"
            value={form.office}
            onChangeText={(t) => handleChange('office', t)}
          />

          {/* Password */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={form.password}
            onChangeText={(t) => handleChange('password', t)}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={form.confirmPassword}
            onChangeText={(t) => handleChange('confirmPassword', t)}
          />

          {/* Button */}
          <TouchableOpacity style={styles.button} onPress={onSignupPress}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.loginText}>
              Already have an account? <Text style={{ fontWeight: 'bold' }}>Sign In</Text>
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </View>
  );
};

export default SignupScreen;