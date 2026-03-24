import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { apiCall } from '../../utils/api';
// ─── Permissions ─────────────────────────────────────────

export async function requestLocationPermission() {

  if (Platform.OS === 'android') {

    try {

      const granted =
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs your location to verify office attendance.',
            buttonPositive: 'OK',
          }
        );

      return (
        granted === PermissionsAndroid.RESULTS.GRANTED
      );

    } catch (err) {

      console.warn('Location permission error', err);

      return false;
    }
  }

  return true;
}

export async function requestCameraPermission() {

  if (Platform.OS === 'android') {

    try {

      const granted =
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message:
              'Camera access is required to capture your attendance photo.',
            buttonPositive: 'OK',
          }
        );

      return (
        granted === PermissionsAndroid.RESULTS.GRANTED
      );

    } catch (err) {

      console.warn('Camera permission error', err);

      return false;
    }
  }

  return true;
}

// ─── GPS ─────────────────────────────────────────

export function getCurrentLocation(retryCount = 0) {

  const MAX_RETRIES = 2;

  return new Promise((resolve, reject) => {

    const options =
      retryCount === 0
        ? {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 0,
          }
        : {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 5000,
          };

    Geolocation.getCurrentPosition(

      pos => resolve(pos.coords),

      async error => {

        console.log(
          `Location attempt ${retryCount + 1} failed:`,
          error
        );

        if (error.code === 2) {

          reject({
            type: 'LOCATION_DISABLED',
            originalError: error,
          });

          return;
        }

        if (
          error.code === 3 &&
          retryCount < MAX_RETRIES
        ) {

          try {

            const coords =
              await getCurrentLocation(
                retryCount + 1
              );

            resolve(coords);

          } catch (retryError) {

            reject(retryError);
          }

          return;
        }

        reject(error);
      },

      options
    );
  });
}

// ─── Distance ─────────────────────────────────────────

export function calculateDistance(
  lat1,
  lng1,
  lat2,
  lng2
) {

  const toRad = v => (v * Math.PI) / 180;

  const R = 6371000;

  const dLat =
    toRad(lat2 - lat1);

  const dLng =
    toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;

  return (
    R *
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )
  );
}

// ─── Offices ─────────────────────────────────────────

export async function fetchOffices() {

  const res =
    await apiCall('offices', 'GET');

  return res?.success &&
    Array.isArray(res.offices)
    ? res.offices
    : [];
}

export function findNearestOffice(
  userLat,
  userLng,
  offices
) {

  let nearest = {
    distance: Infinity,
    office: null,
    inRange: false,
  };

  for (const o of offices) {

    const d =
      calculateDistance(
        userLat,
        userLng,
        parseFloat(o.latitude),
        parseFloat(o.longitude)
      );

    if (d < nearest.distance) {

      nearest = {
        distance: d,
        office: o,
        inRange:
          d <= (o.radius_meters || 0),
      };
    }
  }

  return nearest;
}

// ─── Attendance ─────────────────────────────────────────

export async function markAttendance({
  employeeId,
  type,
  officeId,
  latitude,
  longitude,
  photoBase64,
}) {

  const { date, time } =
    getCurrentDateTime();

  const payload = {

    employee_id: employeeId,

    date,

    check_in: time,

    type,

    status:
      type === 'office'
        ? 'present'
        : type,

    office_id:
      type === 'office'
        ? officeId
        : null,

    location: {
      latitude,
      longitude,
    },

    photo: photoBase64,
  };

  return await apiCall(
    'mark-attendance',
    'POST',
    payload
  );
}

export async function fetchTodayAttendance(
  employeeId
) {

  return await apiCall(
    `today-attendance?employee_id=${employeeId}`,
    'GET'
  );
}

export async function checkOut(
  employeeId,
  latitude = null,
  longitude = null
) {

  const { date, time } =
    getCurrentDateTime();

  const payload = {

    employee_id: employeeId,

    date,

    check_out: time,
  };

  if (
    latitude !== null &&
    longitude !== null
  ) {

    payload.location = {
      latitude,
      longitude,
    };
  }

  return await apiCall(
    'check-out',
    'POST',
    payload
  );
}

// ─── Reverse Geocode ─────────────────────────────────────────

export async function reverseGeocode(
  lat,
  lng
) {

  try {

    const controller =
      new AbortController();

    const timeout =
      setTimeout(
        () => controller.abort(),
        5000
      );

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'AttendanceApp',
        },
      }
    );

    clearTimeout(timeout);

    if (!res.ok) return null;

    const data =
      await res.json();

    const addr =
      data.address || {};

    const city =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.county ||
      '';

    const state =
      addr.state || '';

    return {

      shortAddress:
        [city, state]
          .filter(Boolean)
          .join(', '),

      fullAddress:
        data.display_name || '',
    };

  } catch {

    return null;
  }
}

export async function uriToBase64(r) {
    const candidate =
        r.photo_url ||
        r.check_in_photo ||
        r.check_out_photo ||
        null;

    if (!candidate) return null;

    // If it already looks like a URL or data URL, just use it
    if (/^(https?:|data:|blob:)/i.test(candidate)) return candidate;

    // Raw base64 (no data: prefix) → wrap it
    const looksLikeBase64 = /^[A-Za-z0-9+/=\s]+$/.test(candidate) && candidate.length > 100;
    if (looksLikeBase64) return `data:image/jpeg;base64,${candidate}`;

    // Relative path on your server (e.g., "uploads/img123.jpg")
    // Adjust prefix if your images live elsewhere.
    if (!candidate.startsWith('/')) return `./${candidate}`;

    return candidate; // absolute path starting with /
}

export async function checkWFHEligibility(employeeId, date) {
    try {
        const result = await apiCall('wfh-eligibility', 'GET', {
            employee_id: employeeId,
            date: date
        });

        if (result) {
            const currentCount = result.current_count || 0;
            const maxWfhLimit = 2; // Monthly WFH limit

            // Fetch approved leave requests for current month
            const now = getCurrentISTDate();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;

            const leaveRequestsResult = await apiCall('my-requests', 'GET', {
                employee_id: currentUser.id
            });

            console.log('DEBUG: Leave requests result:', leaveRequestsResult);

            let leavesUsed = 0;
            if (leaveRequestsResult && leaveRequestsResult.success && leaveRequestsResult.requests) {
                console.log('DEBUG: All requests:', leaveRequestsResult.requests);

                // Use safe date parser to avoid UTC shifts (same as calendar logic)
                const parseDate = (s) => {
                    const parts = s.split('-');
                    return new Date(parts[0], parts[1] - 1, parts[2]);
                };

                const filteredLeaves = leaveRequestsResult.requests.filter(req => {
                    console.log('DEBUG: Checking request:', req);
                    if (req.type !== 'full_day' || req.status !== 'approved') {
                        console.log('DEBUG: Rejected - type or status mismatch', { type: req.type, status: req.status });
                        return false;
                    }
                    const reqDate = parseDate(req.start_date);
                    const matches = reqDate.getFullYear() === year && (reqDate.getMonth() + 1) === month;
                    console.log(`DEBUG: Date check - reqDate: ${reqDate}, year: ${year}, month: ${month}, matches: ${matches}`);
                    return matches;
                });
                console.log('DEBUG: Filtered leaves for current month:', filteredLeaves);
                leavesUsed = filteredLeaves.length;
            }

            const maxLeaveLimit = 1; // Monthly leave limit

            // Update WFH
            if (statWFH) {
                statWFH.textContent = `${currentCount}/${maxWfhLimit}`;
                statWFH.style.color = currentCount >= maxWfhLimit ? '#ef4444' : '#10b981';

                // Animate Ring (Circumference ~ 201)
                if (wfhRing) {
                    const wfhPercent = Math.min((currentCount / maxWfhLimit), 1);
                    const wfhOffset = 201 - (wfhPercent * 201);
                    wfhRing.style.strokeDashoffset = wfhOffset;
                }
            }

            // Update Leaves
            if (statLeaves) {
                statLeaves.textContent = `${leavesUsed}/${maxLeaveLimit}`;
                statLeaves.style.color = leavesUsed >= maxLeaveLimit ? '#ef4444' : '#10b981';

                // Animate Ring (Circumference ~ 201)
                if (leavesRing) {
                    const leavesPercent = Math.min((leavesUsed / maxLeaveLimit), 1);
                    const leavesOffset = 201 - (leavesPercent * 201);
                    leavesRing.style.strokeDashoffset = leavesOffset;
                }
            }
        }
    } catch (error) {
        console.error('Error loading WFH eligibility:', error);
    }
}