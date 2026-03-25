import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import LoginScreen from '../screens/login/login';
import Dashboard from '../screens/dashboard/DashBoard';
import SettingsScreen from '../screens/setting/setting';
import SignupScreen from '../screens/signup/signup';
import FaceDetectionScreen from '../screens/camera/camera';
import ImagePreviewScreen from '../screens/imagepreview/imagepreview';
import LeaveApplicationScreen from '../screens/leave/leave';
import RecordsScreen from '../screens/records/records';
import TaskBoard from '../screens/tasks/task';
import { useSelector } from 'react-redux';
import { RootState } from '../store/index';
export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Settings: undefined;
  markattendance: undefined;
  Signup: undefined;
  imagepreview: { imageUri: string };
  LeaveApplication: undefined;
  Records: undefined;
  TaskBoard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const isAuthenticated = useSelector((state: RootState) => state.session.isAuthenticated);
  console.log("authenticated or not", isAuthenticated);
  return (
    <NavigationContainer>
       {isAuthenticated ? (
        <Stack.Navigator>
          <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
          <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="markattendance" component={FaceDetectionScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="imagepreview" component={ImagePreviewScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="LeaveApplication" component={LeaveApplicationScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Records" component={RecordsScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="TaskBoard" component={TaskBoard} options={{ headerShown: false }}/>
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="markattendance" component={FaceDetectionScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="imagepreview" component={ImagePreviewScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="LeaveApplication" component={LeaveApplicationScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Records" component={RecordsScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="TaskBoard" component={TaskBoard} options={{ headerShown: false }}/>
      </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
