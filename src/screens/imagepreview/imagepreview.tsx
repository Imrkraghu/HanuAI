import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
  Platform,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {MarkAttendance} from './index.js';
import styles from './imagepreview.style.js';

const ImagePreviewScreen = () => {
  const route = useRoute();
  console.log("Received route params:", route.params);
  const navigation = useNavigation();
  const { imageUri } = route.params || {};

  const handleDownload = async () => {
    if (!imageUri) {
      Alert.alert("Error", "No image to download");
      return;
    }

    try {
      // Android write permission for API < 33
      if (Platform.OS === 'android' && Platform.Version < 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert("Permission Denied", "Cannot save image");
          return;
        }
      }

    } catch (error) {
      console.error("Download failed", error);
      Alert.alert("Error", "Failed to save image");
    }
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.fullImage}
          resizeMode="contain"
        />
      ) : (
        <Text style={styles.text}>No Image Found</Text>
      )}

      {/* Download Button */}
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={handleDownload}
      >
        <Text style={styles.downloadText}>Download</Text>
      </TouchableOpacity>

      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeText}>Retake</Text>
      </TouchableOpacity>
      {/* submit button */}
       <TouchableOpacity
        style={styles.SubmitButton}
        onPress={() => {
          MarkAttendance({
            selectedType: route.params?.workMode || 'office',
            selectedOffice: route.params?.officeId || null,
            capturedPhotoData: imageUri,
            location_lat: route.params?.latitude || null,
            location_lng: route.params?.longitude || null,
            navigation
          });
        }}>
        <Text style={styles.closeText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};



export default ImagePreviewScreen;