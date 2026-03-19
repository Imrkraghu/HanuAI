import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Camera, useCameraDevice, useCameraFormat } from 'react-native-vision-camera';

export const FaceDetectionScreen: React.FC = () => {
  const [facing, setFacing] = useState<'front' | 'back'>('front');
  const [isActive, setIsActive] = useState(true);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const device = useCameraDevice(facing);
  const cameraRef = useRef<Camera>(null);
  const format = useCameraFormat(device, [
    { videoResolution: { width: 1280, height: 720 } },
    { fps: 30 },
  ]);

  const flipCamera = () => {
    setFacing(f => (f === 'back' ? 'front' : 'back'));
  };

  const togglePause = () => {
    setIsActive(a => !a);
  };
  const capturePhoto = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'quality',
        });
        console.log('Captured photo:', photo);
        setCapturedPhoto(photo.path);
      }
    } catch (err) {
      console.error('Error capturing photo:', err);
    }
  };

  if (!device) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errText}>No camera device found</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        format={format}
        isActive={isActive}
        fps={30}
      />

      {/* Controls */}
      {/* <SafeAreaView style={styles.controls} pointerEvents="box-none">
        <TouchableOpacity style={styles.ctrl} onPress={flipCamera}>
          <Text style={styles.ctrlIcon}>🔄</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.ctrl, !isActive && styles.ctrlPaused]}
          onPress={togglePause}
        >
          <Text style={styles.ctrlIcon}>{isActive ? '⏸' : '▶️'}</Text>
        </TouchableOpacity>
      </SafeAreaView> */}

      {/* Capture Button */}
      <SafeAreaView style={styles.captureContainer} pointerEvents="box-none">
        <TouchableOpacity style={styles.captureButton} onPress={capturePhoto} />
      </SafeAreaView>
    </View>
  );
};

export default FaceDetectionScreen;
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  errText: { color: '#FF3B30', fontSize: 16 },

  controls: {
    position: 'absolute',
    bottom: 40,
    right: 16,
    gap: 12,
  },
  ctrl: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctrlPaused: {
    backgroundColor: 'rgba(255,59,48,0.55)',
  },
  ctrlIcon: { fontSize: 22 },
   captureContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'white',
    borderWidth: 4,
    borderColor: '#ccc',
  }
});




// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     Image,
//     ActivityIndicator,
//     Alert,
//     Platform,
//     PermissionsAndroid,
//     StatusBar,
//     Dimensions,
//     Linking,
// } from 'react-native';

// import ViewShot from "react-native-view-shot";
// import { launchCamera } from 'react-native-image-picker';
// import Geolocation from "@react-native-community/geolocation";
// import { CameraRoll } from "@react-native-camera-roll/camera-roll";
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useFocusEffect } from '@react-navigation/native';
// import { useRoadModel } from '../../../utils/tflite';

// const { width } = Dimensions.get('window');





// const FaceDetectionScreen = ({ navigation, route }) => {
//     const { onImageCaptured } = route.params || {};

//     const [loading, setLoading] = useState(false);
//     const [loadingMessage, setLoadingMessage] = useState('');
//     const [capturedImage, setCapturedImage] = useState(null);
//     const [tempCaptureData, setTempCaptureData] = useState(null);
//     const viewShotRef = useRef(null);
//     const locationRef = useRef(null);
//     const { runPrediction } = useRoadModel();


//     useFocusEffect(
//         useCallback(() => {
//             // Start high-accuracy fetch immediately on focus
//             getCurrentLocation()
//                 .then(coords => {
//                     locationRef.current = coords;
//                 })
//                 .catch(err => console.log("Pre-focus location error:", err));

//             return () => {
//                 locationRef.current = null; // Clear on leave
//             };
//         }, [])
//     );


//     const isLocationEnabled = async () => {
//         return new Promise((resolve) => {
//             Geolocation.getCurrentPosition(
//                 () => resolve(true),
//                 (error) => {
//                     if (error.code === 2) resolve(false);
//                     else resolve(true);
//                 },
//                 { enableHighAccuracy: false, timeout: 2000, maximumAge: 0 }
//             );
//         });
//     };

//     const promptEnableLocation = () => {
//         return new Promise((resolve) => {
//             Alert.alert(
//                 "Location Services Required",
//                 "Please enable Location Services to capture geo-tagged photos.",
//                 [
//                     { text: "Cancel", onPress: () => resolve(false), style: "cancel" },
//                     { text: "Open Settings", onPress: () => { Linking.openSettings(); resolve(false); } }
//                 ]
//             );
//         });
//     };

//     const getCurrentLocation = async (retryCount = 0) => {
//         const MAX_RETRIES = 3;
//         return new Promise((resolve, reject) => {
//             const options = retryCount === 0
//                 ? { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
//                 : { enableHighAccuracy: false, timeout: 10000, maximumAge: 5000 };

//             Geolocation.getCurrentPosition(
//                 pos => resolve(pos.coords),
//                 async error => {
//                     if (error.code === 2) {
//                         reject({ type: 'LOCATION_DISABLED', originalError: error });
//                         return;
//                     }
//                     if (error.code === 3 && retryCount < MAX_RETRIES) {
//                         try {
//                             const coords = await getCurrentLocation(retryCount + 1);
//                             resolve(coords);
//                         } catch (retryError) { reject(retryError); }
//                         return;
//                     }
//                     reject(error);
//                 },
//                 options
//             );
//         });
//     };

//     const handleTakePhoto = async () => {
//         setLoading(true);
//         setLoadingMessage('Checking Permissions...');

//         try {
//             const hasPermissions = await requestPermissions();
//             if (!hasPermissions) {
//                 Alert.alert("Permissions Required", "Please enable Camera and Location in Settings.");
//                 setLoading(false);
//                 return;
//             }

//             setLoadingMessage('Checking Location...');
//             const locationOn = await isLocationEnabled();
//             if (!locationOn) {
//                 setLoading(false);
//                 await promptEnableLocation();
//                 return;
//             }

//             setLoadingMessage('Acquiring Location...');
//             let location;
//             try {
//                 location = await getCurrentLocation();
//             } catch (error) {
//                 if (error.type === 'LOCATION_DISABLED') {
//                     setLoading(false);
//                     await promptEnableLocation();
//                     return;
//                 }
//                 throw error;
//             }

//             const latText = location.latitude.toFixed(5);
//             const longText = location.longitude.toFixed(5);
//             const coordsText = `Lat: ${latText}  •  Long: ${longText}`;

//             setLoadingMessage('Opening Camera...');
//             const response = await launchCamera({
//                 mediaType: 'photo',
//                 saveToPhotos: false,
//                 quality: 0.4,
//                 maxWidth: 1200,
//                 maxHeight: 1200,
//             });

//             if (response.didCancel || !response.assets?.[0]?.uri) {
//                 setLoading(false);
//                 return;
//             }

//             setLoadingMessage('Analyzing Image...');
//             const rawUri = response.assets[0].uri;

//             try {
//                 // rawUri = 
//                 const predictedClass = await runPrediction(rawUri);
//                 if (!predictedClass || predictedClass.length === 0) {
//                     setLoading(false);
//                     Alert.alert("No Road detected.");
//                     return;
//                 }

//                 // Check if any detection is "road" 
//                 const hasRoad = predictedClass.some(det => det.label.toLowerCase() === "road");
//                 if (!hasRoad) {
//                     setLoading(false);
//                     Alert.alert("Not a Road. Please capture a road photo.");
//                     return;
//                 }
//             }
//             catch (err) {
//                 console.error("Prediction error:", err);
//                 setLoading(false);
//                 Alert.alert("Error", "Could not run road detection.");
//                 return;
//             }

//             setLoadingMessage('Fetching Area...');
//             let areaName = "Unknown Area";
//             try {
//                 const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}&zoom=18&addressdetails=1`;
//                 const res = await fetch(url, { headers: { 'User-Agent': 'SurveyApp/1.0' } });
//                 const data = await res.json();
//                 if (data?.address) {
//                     const addr = data.address;
//                     const locality = addr.suburb || addr.neighbourhood || addr.residential || addr.village || addr.town || "";
//                     const city = addr.city || addr.state_district || addr.county || "";
//                     areaName = locality && city ? `${locality}, ${city}` : (locality || city || "Area Located");
//                 }
//             } catch (error) {
//                 areaName = "Location Network Error";
//             }

//             setLoadingMessage('Processing Image...');
//             const now = new Date();
//             const dateStr = now.toLocaleString('en-IN', {
//                 day: '2-digit', month: 'short', year: 'numeric',
//                 hour: '2-digit', minute: '2-digit', hour12: true
//             });



//             const cleanArea = (text) => {
//                 if (!text) return "";
//                 return text
//                     .replace(/Sector\s*[- ]*\w+/gi, '')
//                     .replace(/Sector/gi, '')
//                     .replace(/,\s*,/g, ',')
//                     .replace(/^[\s,]+|[\s,]+$/g, '')
//                     .trim();
//             };
//             const finalAreaName = cleanArea(areaName);
//             const overlayText = `${finalAreaName}\n${coordsText}\n${dateStr}`;

//             setTempCaptureData({
//                 uri: response.assets[0].uri,
//                 text: overlayText
//             });

//         } catch (error) {
//             console.error(error);
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (tempCaptureData && viewShotRef.current) {
//             setTimeout(() => {
//                 viewShotRef.current.capture()
//                     .then(async (uri) => {
//                         if (Platform.OS === 'android' && Platform.Version < 33) {
//                             await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
//                         }
//                         await CameraRoll.save(uri, { type: 'photo', album: 'RA Survey' });

//                         setCapturedImage(uri);
//                         setTempCaptureData(null);
//                         setLoading(false);

//                         Alert.alert("Success", "Photo saved with location!");
//                         if (onImageCaptured) onImageCaptured(uri);
//                         navigation.goBack();
//                     })
//                     .catch(err => {
//                         setLoading(false);
//                         Alert.alert("Error", "Could not process image overlay.");
//                     });
//             }, 800);
//         }
//     }, [tempCaptureData]);

//     const requestPermissions = async () => {
//         if (Platform.OS !== 'android') return true;
//         try {
//             const granted = await PermissionsAndroid.requestMultiple([
//                 PermissionsAndroid.PERMISSIONS.CAMERA,
//                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//             ]);
//             return granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
//                 granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED;
//         } catch (err) { return false; }
//     };

//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

//             <View style={styles.header}>
//                 <Text style={styles.headerTitle}>GeoTag Camera</Text>
//                 <Text style={styles.headerSubtitle}>Capture location-verified photos</Text>
//             </View>

//             <View style={styles.content}>
//                 <View style={styles.card}>
//                     {capturedImage ? (
//                         <Image source={{ uri: capturedImage }} style={styles.previewImage} resizeMode="cover" />
//                     ) : (
//                         <View style={styles.placeholder}>
//                             <Text style={styles.placeholderText}>No photo captured</Text>
//                         </View>
//                     )}
//                 </View>
//             </View>

//             <View style={styles.footer}>
//                 <TouchableOpacity
//                     style={[styles.btn, loading && styles.btnDisabled]}
//                     onPress={handleTakePhoto}
//                     disabled={loading}
//                 >
//                     {loading ? (
//                         <View style={styles.loadingContainer}>
//                             <ActivityIndicator color="#fff" size="small" />
//                             <Text style={styles.btnText}>{loadingMessage}</Text>
//                         </View>
//                     ) : (
//                         <Text style={styles.btnText}>
//                             {capturedImage ? "Retake Photo" : "Capture Photo"}
//                         </Text>
//                     )}
//                 </TouchableOpacity>
//             </View>


//             <View style={styles.hiddenLayer}>
//                 <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.4 }}>
//                     {tempCaptureData?.uri ? (
//                         <View style={{ position: 'relative' }}>
//                             <Image source={{ uri: tempCaptureData.uri }} style={{ width: 1000, height: 1333 }} />
//                             <View style={styles.overlayBanner}>
//                                 <Text style={styles.overlayText}>{tempCaptureData.text}</Text>
//                             </View>
//                         </View>
//                     ) : (
//                         <View style={{ width: 100, height: 100, backgroundColor: 'transparent' }} />
//                     )}
//                 </ViewShot>
//             </View>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#F8F9FA' },
//     header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 10 },
//     headerTitle: { fontSize: 28, fontWeight: '800', color: '#1A1A1A' },
//     headerSubtitle: { fontSize: 14, color: '#6C757D', marginTop: 4 },
//     content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
//     card: { width: '100%', aspectRatio: 3 / 4, backgroundColor: '#fff', borderRadius: 24, elevation: 10, borderWidth: 1, borderColor: '#F0F0F0', overflow: 'hidden' },
//     previewImage: { width: '100%', height: '100%' },
//     placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
//     placeholderText: { color: '#ADB5BD', fontSize: 16, fontWeight: '500' },
//     footer: { padding: 24, backgroundColor: '#F8F9FA' },
//     btn: { backgroundColor: '#2D3436', borderRadius: 16, height: 56, justifyContent: 'center', alignItems: 'center' },
//     btnDisabled: { backgroundColor: '#636e72' },
//     btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
//     loadingContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//     hiddenLayer: { position: 'absolute', top: 0, left: -5000, opacity: 0 },
//     overlayBanner: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', padding: 40 },
//     overlayText: { color: '#fff', fontSize: 32, fontWeight: '600', lineHeight: 44 }
// });

// export default FaceDetectionScreen;