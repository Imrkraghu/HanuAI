import { apiCall } from './api';
let serverTimeOffset = 0;

export async function syncServerTime() {
  try {
    const start = Date.now();

    const res = await apiCall('server-time', 'GET');

    const end = Date.now();

    if (res?.success) {
      const latency = (end - start) / 2;

      const serverTime = res.timestamp + latency;

      serverTimeOffset = serverTime - end;

      console.log(
        `Server time synced. Offset: ${serverTimeOffset}ms`
      );
    }

  } catch (e) {
    console.error('Failed to sync server time:', e);
  }
}

// ─── IST Time Helpers ─────────────────────────────────────────

export function getCurrentISTDate() {

  const syncedNow =
    new Date(Date.now() + serverTimeOffset);

  const utc =
    syncedNow.getTime() +
    syncedNow.getTimezoneOffset() * 60000;

  return new Date(utc + 3600000 * 5.5);
}

export function getCurrentDateTime() {

  const now = getCurrentISTDate();

  const date =
    now.toISOString().split('T')[0];

  const time =
    now.toTimeString().split(' ')[0];

  return { date, time };
}

export function formatTime(date) {
    return date.toTimeString().split(' ')[0];
}
export function formatDate(date) {
  // YYYY-MM-DD format
  return date.toISOString().split('T')[0];
}

export function formatDuration(hours) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
}

export async function isWithinAttendanceWindow(department, role) {
  const now = new Date();
  const currentHour = now.getHours();

  // Surveyors are always allowed
  if (role.toLowerCase() === 'surveyor') {
    return true;
  }

  // Non-surveyors: only between 9 AM and 6 PM
  const startHour = 9;
  const endHour = 18; // 6 PM in 24-hour format

  return currentHour >= startHour && currentHour < endHour;
}

export async function calcWorkedHours(checkInTime, checkOutTime) {
    const [inH, inM, inS = 0] = checkInTime.split(':').map(Number);
    const [outH, outM, outS = 0] = checkOutTime.split(':').map(Number);

    const inDate = getCurrentISTDate();
    inDate.setHours(inH, inM, inS, 0);

    const outDate = getCurrentISTDate();
    outDate.setHours(outH, outM, outS, 0);

    const diffMs = outDate - inDate;
    const diffHours = diffMs / (1000 * 60 * 60);
    return Math.round(diffHours * 100) / 100; // 2 decimals
}