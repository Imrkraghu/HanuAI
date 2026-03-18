// import React, { useEffect, useState } from 'react';
// import { StyleSheet, View, Text } from 'react-native';
// import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
// import { runOnJS } from 'react-native-reanimated';
// // Import the face detector plugin
// import { scanFaces } from 'vision-camera-face-detector';

// const FaceDetectionScreen: React.FC = () => {
//   const devices = useCameraDevices();
//   const device = devices.front; // or devices.back
//   const [faces, setFaces] = useState<any[]>([]);

//   useEffect(() => {
//     (async () => {
//       const status = await Camera.requestCameraPermission();
//       if (status !== 'authorized') {
//         console.warn('Camera permission not granted');
//       }
//     })();
//   }, []);

//   const frameProcessor = useFrameProcessor((frame) => {
//     'worklet';
//     const detectedFaces = scanFaces(frame);
//     runOnJS(setFaces)(detectedFaces);
//   }, []);

//   if (!device) return <Text>Loading camera...</Text>;

//   return (
//     <View style={styles.container}>
//       <Camera
//         style={StyleSheet.absoluteFill}
//         device={device}
//         isActive={true}
//         frameProcessor={frameProcessor}
//         frameProcessorFps={5} // adjust for performance
//       />
//       <View style={styles.overlay}>
//         <Text style={styles.text}>
//           {faces.length > 0 ? `Faces detected: ${faces.length}` : 'No face detected'}
//         </Text>
//       </View>
//     </View>
//   );
// };

// export default FaceDetectionScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   overlay: {
//     position: 'absolute',
//     bottom: 40,
//     alignSelf: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     padding: 12,
//     borderRadius: 8,
//   },
//   text: {
//     color: 'white',
//     fontSize: 16,
//   },
// });
