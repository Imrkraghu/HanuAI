import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Camera, useCameraDevice, useCameraFormat } from 'react-native-vision-camera';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles, {PRIMARY} from './camera.style.js';
import { getCurrentLocation } from '../../utils/location.js';

import {
  calculateDistance,
  checkOut,
  checkWFHEligibility,
  fetchOffices,
  fetchTodayAttendance,
  findNearestOffice,
  markAttendance,
  requestCameraPermission,
  requestLocationPermission,
  uriToBase64,
} from './index.js';
import {syncServerTime, isWithinAttendanceWindow, getCurrentDateTime, getCurrentISTDate,  formatTime, calcWorkedHours,} from '../../utils/datetime.js';



// ─── Types ────────────────────────────────────────────────────────────────────
type WorkMode = 'wfh' | 'office' | 'client';

interface Office {
  id: number | string;
  name: string;
  address?: string;
  latitude: string | number;
  longitude: string | number;
  radius_meters: number;
}

interface NearestOffice {
  distance: number;
  office: Office | null;
  inRange: boolean;
}

interface UserCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function coordsLabel(coords: UserCoords | null): string {
  if (!coords) return 'Fetching location…';
  return `Lat: ${coords.latitude.toFixed(5)}  •  Long: ${coords.longitude.toFixed(5)}`;
}

// ─── Main Component ──────────────────────────────────────────────────────────
const FaceDetectionScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  // ── State ──────────────────────────────────────────────────────────────────
  const [step, setStep] = useState<'type' | 'office' | 'camera'>('type');
  const [workMode, setWorkMode] = useState<WorkMode | null>(null);
  const [offices, setOffices] = useState<Office[]>([]);
  const [selectedOfficeId, setSelectedOfficeId] = useState<number | string | null>(null);
  const [nearestInfo, setNearestInfo] = useState<NearestOffice | null>(null);
  const [officesLoading, setOfficesLoading] = useState(false);

  const [userCoords, setUserCoords] = useState<UserCoords | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Camera
  const [showCamera, setShowCamera] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('front');
  const format = useCameraFormat(device, [
    { videoResolution: { width: 1280, height: 720 } },
    {photoResolution : {width:720, height:720} },
    { fps: 30 },
  ]);

  // WFH
  const [wfhStatus, setWfhStatus] = useState<'checking' | 'approved' | 'not_approved'>('checking');

  // Submit
  const [submitting, setSubmitting] = useState(false);

  // Today's record (for check-out state)
  const [todayRecord, setTodayRecord] = useState<any | null>(null);
  const [checkingRecord, setCheckingRecord] = useState(true);

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ── Init ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    syncServerTime();
    initLocation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

useEffect(() => {

  const loadUser = async () => {

    try {

      // 1️⃣ Try from route first
      let user =
        route.params?.currentUser ?? null;

      // 2️⃣ If not passed → load from storage
      if (!user) {

        const storedUser =
          await AsyncStorage.getItem(
            'attendanceUser'
          );

        if (storedUser) {

          user =
            JSON.parse(storedUser);

        }

      }

      if (!user) {

        Alert.alert(
          'Session Expired',
          'Please login again.'
        );

        navigation.navigate('Login');

        return;

      }

      setCurrentUser(user);

      console.log(
        'Current User Loaded:',
        user
      );

    } catch (error) {

      console.error(
        'User load error:',
        error
      );

    } finally {

      setLoadingUser(false);

    }

  };

  loadUser();

}, []);

  // ── Location polling ──────────────────────────────────────────────────────
  const initLocation = async () => {
    const ok = await requestLocationPermission();
    if (!ok) {
      setLocationError('Location permission denied. Please enable in Settings.');
      return;
    }
    fetchAndSetLocation();
    pollRef.current = setInterval(fetchAndSetLocation, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  };

  const fetchAndSetLocation = async () => {
    try {
      const coords: any = await getCurrentLocation();
      setUserCoords({ latitude: coords.latitude, longitude: coords.longitude, accuracy: coords.accuracy });
      setLocationError(null);
    } catch (err: any) {
      if (err?.type === 'LOCATION_DISABLED') {
        setLocationError('Location services are off. Please enable GPS.');
      } else {
        console.warn('Location poll failed:', err);
      }
    }
  };

  const loadTodayRecord = async () => {
    setCheckingRecord(true);
    const rec = await fetchTodayAttendance(currentUser.id);
    setTodayRecord(rec);
    setCheckingRecord(false);
  };

  // ── Step 1: type selected ─────────────────────────────────────────────────
  const handleSelectType = async (type: WorkMode) => {
    if (!currentUser) {
      Alert.alert('Error', 'User session not found. Please log in again.');
      return;
    }
    if (!isWithinAttendanceWindow(currentUser.department, currentUser.role)) {
      Alert.alert(
        'Outside Hours',
        'Non-surveyors can only check in between 9:00 AM and 6:00 PM.'
      );
      return;
    }

    setWorkMode(type);

    if (type === 'wfh') {
      setWfhStatus('checking');
      const elig = await checkWFHEligibility(currentUser.id, getCurrentDateTime().date);
      console.log('WFH Eligibility:', elig);
      if (!elig.hasApprovedRequest) {
        Alert.alert(
          'WFH Not Approved',
          'You do not have an approved WFH request for today. Please request through the Calendar.'
        );
        setWorkMode(null);
        return;
      }
      setWfhStatus('approved');
      setStep('camera');
    } else if (type === 'office') {
      setStep('office');
      loadOffices();
    } else {
      // client — no office needed
      setStep('camera');
    }
  };

  // ── Load offices + compute nearest ───────────────────────────────────────
  const loadOffices = async () => {
    setOfficesLoading(true);
    const list = await fetchOffices();
    setOffices(list);
    setOfficesLoading(false);

    if (userCoords && list.length > 0) {
      const info = findNearestOffice(userCoords.latitude, userCoords.longitude, list);
      setNearestInfo(info);
    }
  };

  // Recompute nearest whenever coords update and we're on the office step
  useEffect(() => {
    if (step === 'office' && userCoords && offices.length > 0) {
      const info = findNearestOffice(userCoords.latitude, userCoords.longitude, offices);
      setNearestInfo(info);
    }
  }, [userCoords, step, offices]);

  const handleSelectOffice = (officeId: number | string) => {
    setSelectedOfficeId(officeId);
  };

  const handleOfficeNext = () => {
    if (!selectedOfficeId) {
      Alert.alert('Select Office', 'Please select an office before proceeding.');
      return;
    }
    // Check if user is in range of the selected office
    if (userCoords) {
      const office = offices.find(o => o.id === selectedOfficeId);
      if (office) {
        const dist = calculateDistance(
          userCoords.latitude,
          userCoords.longitude,
          parseFloat(String(office.latitude)),
          parseFloat(String(office.longitude))
        );
        if (dist > office.radius_meters) {
          Alert.alert(
            'Out of Range',
            `You are ${Math.round(dist)}m away from ${office.name}. You must be within ${office.radius_meters}m to mark office attendance.`
          );
          return;
        }
      }
    }
    setStep('camera');
  };

  // ── Camera ────────────────────────────────────────────────────────────────
  const handleProceedToCamera = async () => {
    const camOk = await requestCameraPermission();
    if (!camOk) {
      Alert.alert('Camera Permission', 'Camera permission is required to capture attendance photo.');
      return;
    }
    if (!userCoords) {
      Alert.alert('Location Required', 'GPS location is required for attendance. Please wait for location to load.');
      return;
    }
    setShowCamera(true);
  };

  const capturePhoto = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      console.log("cjsdj", cameraRef);
      const photo = await cameraRef.current.takeSnapshot({ quality:30 });
      setShowCamera(false);
      const fileUri = `file://${photo.path}`;
      // Navigate to preview
      navigation.navigate('imagepreview', {
        imageUri: fileUri,
        workMode,
        officeId: workMode === 'office' ? selectedOfficeId : null,
        officeName:
          workMode === 'office'
            ? offices.find(o => o.id === selectedOfficeId)?.name ?? null
            : null,
        latitude: userCoords?.latitude ?? null,
        longitude: userCoords?.longitude ?? null,
        accuracy: userCoords?.accuracy ?? null,
        currentUser,
      });
    } catch (err) {
      console.error('Capture error:', err);
      Alert.alert('Capture Error', 'Failed to take photo. Please try again.');
    } finally {
      setCapturing(false);
    }
  };

  // ── Check-out ─────────────────────────────────────────────────────────────
  const handleCheckOut = async () => {
    if (!todayRecord) return;

    const hoursWorked = calcWorkedHours(todayRecord.check_in_time, todayRecord.date);
    if (hoursWorked < 4.5) {
      Alert.alert('Too Early', `You have only worked ${hoursWorked.toFixed(1)}h. Minimum 4.5h required.`);
      return;
    }
    if (hoursWorked < 8) {
      Alert.alert(
        'Half Day Warning',
        `You have worked ${hoursWorked.toFixed(1)} hours. This will be marked as a half day. Continue?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Check Out', style: 'destructive', onPress: submitCheckOut },
        ]
      );
      return;
    }
    submitCheckOut();
  };

  const submitCheckOut = async () => {
    setSubmitting(true);
    try {
      let lat = null, lng = null;
      if (userCoords) { lat = userCoords.latitude; lng = userCoords.longitude; }
      const res = await checkOut(currentUser.id, lat, lng);
      if (res?.success) {
        Alert.alert('Checked Out', res.message || 'Check-out recorded successfully!');
        loadTodayRecord();
      } else {
        Alert.alert('Error', res?.message || 'Check-out failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Reset flow ────────────────────────────────────────────────────────────
  const resetFlow = () => {
    setStep('type');
    setWorkMode(null);
    setSelectedOfficeId(null);
    setNearestInfo(null);
    setShowCamera(false);
  };

  // ── Render helpers ────────────────────────────────────────────────────────
  const renderLocationBadge = () => (
    <View style={styles.locationBadge}>
      <Text style={styles.locationIcon}>📍</Text>
      <Text style={styles.locationText} numberOfLines={1}>
        {locationError ? locationError : coordsLabel(userCoords)}
      </Text>
      {!userCoords && !locationError && <ActivityIndicator size="small" color={PRIMARY} style={{ marginLeft: 6 }} />}
    </View>
  );

  const renderTypeSelection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>How are you working today?</Text>
      <View style={styles.typeGrid}>
        {([
          { key: 'office', emoji: '🏢', label: 'Office' },
          { key: 'wfh', emoji: '🏠', label: 'Work From Home' },
          { key: 'client', emoji: '📋', label: 'Client Site', hidden: currentUser?.department !== 'Surveyors' },
        ] as { key: WorkMode; emoji: string; label: string; hidden?: boolean }[])
          .filter(t => !t.hidden)
          .map(type => (
            <TouchableOpacity
              key={type.key}
              style={[styles.typeCard, workMode === type.key && styles.typeCardSelected]}
              onPress={() => handleSelectType(type.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.typeEmoji}>{type.emoji}</Text>
              <Text style={[styles.typeLabel, workMode === type.key && styles.typeLabelSelected]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
      </View>

      {wfhStatus === 'checking' && workMode === 'wfh' && (
        <View style={styles.infoRow}>
          <ActivityIndicator size="small" color={PRIMARY} />
          <Text style={styles.infoText}>  Checking WFH approval…</Text>
        </View>
      )}
    </View>
  );

  const renderOfficeSelection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Select Your Office</Text>
      {officesLoading ? (
        <ActivityIndicator color={PRIMARY} style={{ marginVertical: 24 }} />
      ) : offices.length === 0 ? (
        <Text style={styles.emptyText}>No offices found for your department.</Text>
      ) : (
        offices.map(office => {
          const isSelected = selectedOfficeId === office.id;
          let distanceM: number | null = null;
          let inRange = false;

          if (userCoords) {
            distanceM = calculateDistance(
              userCoords.latitude,
              userCoords.longitude,
              parseFloat(String(office.latitude)),
              parseFloat(String(office.longitude))
            );
            inRange = distanceM <= office.radius_meters;
          }
          if (loadingUser) {

          return (

            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >

              <ActivityIndicator
                size="large"
                color="#5DB7A3"
              />

              <Text style={{ marginTop: 10 }}>
                Loading user...
              </Text>

            </View>

          );

        }

          return (
            <TouchableOpacity
              key={String(office.id)}
              style={[
                styles.officeCard,
                isSelected && styles.officeCardSelected,
                !inRange && userCoords ? styles.officeCardOutOfRange : null,
              ]}
              onPress={() => handleSelectOffice(office.id)}
              activeOpacity={0.75}
            >
              <View style={styles.officeCardLeft}>
                <Text style={styles.officeIcon}>🏢</Text>
                <View>
                  <Text style={styles.officeName}>{office.name}</Text>
                  {office.address ? (
                    <Text style={styles.officeAddress} numberOfLines={1}>{office.address}</Text>
                  ) : null}
                </View>
              </View>

              <View style={[styles.rangeBadge, inRange ? styles.rangeBadgeIn : styles.rangeBadgeOut]}>
                <Text style={[styles.rangeText, inRange ? styles.rangeTextIn : styles.rangeTextOut]}>
                  {userCoords
                    ? inRange
                      ? '✓ In Range'
                      : `${Math.round(distanceM!)}m away`
                    : 'No GPS'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })
      )}

      {nearestInfo?.office && (
        <View style={styles.nearestBanner}>
          <Text style={styles.nearestText}>
            Nearest: <Text style={{ fontWeight: '700' }}>{nearestInfo.office.name}</Text>{' '}
            ({Math.round(nearestInfo.distance)}m)
          </Text>
        </View>
      )}

      <View style={styles.rowButtons}>
        <TouchableOpacity style={styles.backButton} onPress={resetFlow}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextButton, !selectedOfficeId ? styles.nextButtonDisabled : null]}
          onPress={handleOfficeNext}
          disabled={!selectedOfficeId}
        >
          <Text style={styles.nextButtonText}>Next →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCameraStep = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Capture Photo</Text>
      <View style={styles.summaryCard}>
        <SummaryRow label="Mode" value={workMode?.toUpperCase() ?? ''} />
        {workMode === 'office' && selectedOfficeId && (
          <SummaryRow
            label="Office"
            value={offices.find(o => o.id === selectedOfficeId)?.name ?? String(selectedOfficeId)}
          />
        )}
        <SummaryRow label="Location" value={coordsLabel(userCoords)} />
        <SummaryRow label="Time" value={getCurrentDateTime().time} />
      </View>

      {locationError && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>⚠️ {locationError}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.proceedButton, (!userCoords || submitting) ? styles.proceedButtonDisabled : null]}
        onPress={handleProceedToCamera}
        disabled={!userCoords || submitting}
        activeOpacity={0.8}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.proceedButtonText}>📸  Open Camera</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => setStep(workMode === 'office' ? 'office' : 'type')}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTodayStatus = () => {
    if (checkingRecord) return <ActivityIndicator color={PRIMARY} style={{ marginBottom: 16 }} />;
    if (!todayRecord) return null;

    const isCheckedOut = !!todayRecord.check_out_time;
    return (
      <View style={styles.todayCard}>
        <View style={styles.todayRow}>
          <Text style={styles.todayLabel}>Today's Status</Text>
          <View style={[styles.statusBadge, isCheckedOut ? styles.statusBadgeCompleted : styles.statusBadgeCheckedIn]}>
            <Text style={styles.statusBadgeText}>
              {isCheckedOut ? 'Completed' : 'Checked In'}
            </Text>
          </View>
        </View>

        <View style={styles.todayRow}>
          <Text style={styles.todayInfo}>
            {todayRecord.type?.toUpperCase()}  •  {formatTime(todayRecord.check_in_time)}
            {todayRecord.check_out_time ? ` → ${formatTime(todayRecord.check_out_time)}` : ' → Now'}
          </Text>
        </View>

        {!isCheckedOut && (
          <TouchableOpacity
            style={[styles.checkOutButton, submitting ? styles.checkOutButtonDisabled : null]}
            onPress={handleCheckOut}
            disabled={submitting}
          >
            {submitting
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.checkOutButtonText}>Check Out 🏁</Text>}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // ── Root render ───────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.headerBack}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mark Attendance</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Location bar */}
          {renderLocationBadge()}

          {/* Today's status / check-out */}
          {renderTodayStatus()}

          {/* Step flow */}
          {!todayRecord || todayRecord.check_out_time ? null : null}

          {/* Show attendance flow only if not already checked in+out */}
          {(!todayRecord || (!todayRecord.check_in_time)) && (
            <>
              {/* Step breadcrumb */}
              <View style={styles.breadcrumb}>
                {(['type', 'office', 'camera'] as const).map((s, i) => {
                  const labels = ['Type', 'Office', 'Camera'];
                  const isActive = step === s;
                  const isDone =
                    (s === 'type' && step !== 'type') ||
                    (s === 'office' && step === 'camera');
                  return (
                    <React.Fragment key={s}>
                      <View style={[styles.breadStep, isActive && styles.breadStepActive, isDone && styles.breadStepDone]}>
                        <Text style={[styles.breadStepText, (isActive || isDone) && styles.breadStepTextActive]}>
                          {labels[i]}
                        </Text>
                      </View>
                      {i < 2 && <View style={[styles.breadLine, isDone && styles.breadLineDone]} />}
                    </React.Fragment>
                  );
                })}
              </View>

              {step === 'type' && renderTypeSelection()}
              {step === 'office' && renderOfficeSelection()}
              {step === 'camera' && renderCameraStep()}
            </>
          )}
        </Animated.View>
      </ScrollView>

      {/* ── Camera Modal ─────────────────────────────────────────────────── */}
      <Modal visible={showCamera} animationType="slide" onRequestClose={() => setShowCamera(false)}>
        <View style={styles.cameraModal}>
          {device ? (
            <>
              <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                format={format}
                photoQualityBalance='speed'
                isActive={showCamera}
                photo
              />

              {/* GPS overlay */}
              <View style={styles.cameraOverlay}>
                <Text style={styles.cameraOverlayText}>📍 {coordsLabel(userCoords)}</Text>
                <Text style={styles.cameraOverlayText}>
                  {getCurrentDateTime().time}  •  IST
                </Text>
              </View>

              {/* Controls */}
              <SafeAreaView style={styles.cameraControls}>
                <TouchableOpacity style={styles.cameraCloseBtn} onPress={() => setShowCamera(false)}>
                  <Text style={styles.cameraCloseBtnText}>✕</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.captureButton, capturing && styles.captureButtonDisabled]}
                  onPress={capturePhoto}
                  disabled={capturing}
                >
                  {capturing
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.captureButtonText}>📸</Text>}
                </TouchableOpacity>
                <View style={{ width: 44 }} />
              </SafeAreaView>
            </>
          ) : (
            <View style={styles.centered}>
              <Text style={styles.errorText}>No camera device found</Text>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ─── Small helper component ──────────────────────────────────────────────────
const SummaryRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.summaryRow}>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={styles.summaryValue} numberOfLines={1}>{value}</Text>
  </View>
);

export default FaceDetectionScreen;