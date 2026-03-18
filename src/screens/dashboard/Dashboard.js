import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS_LONG  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// WMO weather-code → emoji + label mapping (Open-Meteo uses WMO codes)
const WMO_WEATHER = {
  0:  { emoji: '☀️',  label: 'Clear'         },
  1:  { emoji: '🌤️', label: 'Mostly clear'   },
  2:  { emoji: '⛅',  label: 'Partly cloudy'  },
  3:  { emoji: '☁️',  label: 'Overcast'       },
  45: { emoji: '🌫️', label: 'Foggy'          },
  48: { emoji: '🌫️', label: 'Icy fog'        },
  51: { emoji: '🌦️', label: 'Light drizzle'  },
  53: { emoji: '🌦️', label: 'Drizzle'        },
  55: { emoji: '🌧️', label: 'Heavy drizzle'  },
  61: { emoji: '🌧️', label: 'Light rain'     },
  63: { emoji: '🌧️', label: 'Rain'           },
  65: { emoji: '🌧️', label: 'Heavy rain'     },
  71: { emoji: '🌨️', label: 'Light snow'     },
  73: { emoji: '🌨️', label: 'Snow'           },
  75: { emoji: '❄️',  label: 'Heavy snow'     },
  80: { emoji: '🌦️', label: 'Rain showers'   },
  95: { emoji: '⛈️', label: 'Thunderstorm'   },
  99: { emoji: '⛈️', label: 'Severe storm'   },
};

const DEFAULT_WEATHER = { emoji: '🌤️', label: 'Loading…', temp: '--', unit: '°C' };

// ─── Static Data ──────────────────────────────────────────────────────────────

export const MOODS = [
  { emoji: '😄', label: 'Great!'    },
  { emoji: '😊', label: 'Good'      },
  { emoji: '😐', label: 'So so'     },
  { emoji: '😕', label: 'Not good'  },
  { emoji: '😣', label: 'Awful'     },
  { emoji: '😡', label: 'Angry!'    },
];

export const LEAVE_DATA = [
  { label: 'Annual Leave',  used: 5, total: 24 },
  { label: 'Sick Leave',    used: 3, total: 15 },
  { label: 'Special Leave', used: 5, total: 15 },
];

export const TODAY_EVENTS = [
  {
    id: '1',
    title: "Albert's birthday",
    time: '08:00 am – 09:00 am',
    iconEmoji: '🎂',
    iconBg: '#FDE8E8',
  },
  {
    id: '2',
    title: 'Meeting with Jason',
    time: '13:00 pm – 14:00 pm',
    iconEmoji: '📹',
    iconBg: '#E8F0FD',
  },
];

export const REIMBURSEMENT = {
  used:  350000,
  total: 5000000,
  label: 'Medical Reimbursement',
};

export const NAV_TABS = [
  { icon: '🏠', label: 'Home', active: false },
  { icon: '📅', label: 'Task',      active: false },
  { icon: '📋', label: 'Leave',      active: false },
  { icon: '💳', label: 'Reimburse',  active: false },
  { icon: '⏰', label: 'Attendance', active: false },
];

export const MAX_CHART_HOURS = 10;
export const BAR_HEIGHT      = 90;

// ─── Utilities ────────────────────────────────────────────────────────────────

/**
 * Formats elapsed seconds → "HH:MM:SS"
 * @param {number} secs
 * @returns {string}
 */
export function formatElapsedTime(secs) {
  const h = String(Math.floor(secs / 3600)).padStart(2, '0');
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

/**
 * Returns the Monday-anchored 7-day week containing `date`.
 * Past days get seeded working hours; future days get 0.
 * Today gets partially-filled hours proportional to time of day.
 *
 * @param {Date} date
 * @returns {{ day: string; hours: number; isToday: boolean; isFuture: boolean }[]}
 */
export function buildWeeklyData(date) {
  const dayOfWeek = date.getDay();                       // 0=Sun … 6=Sat
  const mondayOffset = (dayOfWeek + 6) % 7;             // days since last Monday
  const monday = new Date(date);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(date.getDate() - mondayOffset);

  // Seeded-random helper (deterministic per date so it doesn't flicker on re-render)
  const seed = (n) => {
    const x = Math.sin(n + 1) * 10000;
    return x - Math.floor(x);
  };

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    d.setHours(0, 0, 0, 0);

    const todayMidnight = new Date(date);
    todayMidnight.setHours(0, 0, 0, 0);

    const isToday  = d.getTime() === todayMidnight.getTime();
    const isFuture = d > todayMidnight;

    let hours = 0;
    if (isToday) {
      // Partial fill: fraction of working day elapsed (9 AM–6 PM = 9 hrs)
      const workStart = 9 * 60;
      const workEnd   = 18 * 60;
      const nowMins   = date.getHours() * 60 + date.getMinutes();
      const elapsed   = Math.max(0, Math.min(nowMins - workStart, workEnd - workStart));
      hours = parseFloat(((elapsed / 60)).toFixed(1));
    } else if (!isFuture) {
      // Seeded between 6.5–9.5 hrs for past working days
      hours = parseFloat((6.5 + seed(d.getDate() + d.getMonth() * 31) * 3).toFixed(1));
    }

    return {
      day: `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`,
      hours,
      isToday,
      isFuture,
    };
  });
}

/**
 * Formats a Date as "Today, 16 March 2026"
 * @param {Date} date
 * @returns {string}
 */
export function formatDateLabel(date) {
  return `Today, ${date.getDate()} ${MONTHS_LONG[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Returns greeting based on hour of day.
 * @param {Date} date
 * @returns {string}
 */
export function getGreeting(date) {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Fetches current weather from Open-Meteo (free, no API key).
 * Falls back gracefully on network failure.
 *
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<{ emoji: string; label: string; temp: string; unit: string }>}
 */
export async function fetchWeather(lat, lon) {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current_weather=true` +
      `&temperature_unit=celsius`;

    const res  = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const cw   = json.current_weather;
    const code = cw.weathercode;
    const info = WMO_WEATHER[code] || { emoji: '🌤️', label: 'Partly cloudy' };

    return {
      emoji: info.emoji,
      label: info.label,
      temp:  Math.round(cw.temperature).toString(),
      unit:  '°C',
    };
  } catch (err) {
    console.warn('Weather fetch failed:', err);
    return { emoji: '🌤️', label: 'Unavailable', temp: '--', unit: '°C' };
  }
}

/**
 * Gets device location via Geolocation API.
 * Falls back to Ludhiana, Punjab coordinates.
 *
 * @returns {Promise<{ lat: number; lon: number; city: string }>}
 */
export async function getLocation() {
  return new Promise((resolve) => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude, city: 'Your Location' }),
        ()    => resolve({ lat: 30.9010,  lon: 75.8573,  city: 'Ludhiana, Punjab' }),
        { timeout: 5000 }
      );
    } else {
      resolve({ lat: 30.9010, lon: 75.8573, city: 'Ludhiana, Punjab' });
    }
  });
}

// ─── Custom Hook ─────────────────────────────────────────────────────────────

/**
 * useDashboard — encapsulates all Dashboard business logic.
 * Returns only the data and callbacks the UI needs.
 */
export function useDashboard() {
  // ── Live clock (ticks every minute for date/greeting updates)
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(tick);
  }, []);

  // ── User
  const [user, setUser] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('attendanceUser');
        if (stored) setUser(JSON.parse(stored));
      } catch (e) {
        console.warn('Failed to load user:', e);
      }
    })();
  }, []);

  // ── Location + Weather
  const [location, setLocation] = useState({ city: 'Loading…' });
  const [weather,  setWeather]  = useState(DEFAULT_WEATHER);

  useEffect(() => {
    (async () => {
      const loc = await getLocation();
      setLocation(loc);
      const wx = await fetchWeather(loc.lat, loc.lon);
      setWeather(wx);
    })();
  }, []);

  // ── Mood
  const [selectedMood, setSelectedMood] = useState(null);
  const handleMoodSelect = useCallback((label) => {
    setSelectedMood((prev) => (prev === label ? null : label));
  }, []);

  // ── Working timer
  const [isWorking, setIsWorking] = useState(false);
  const [elapsed,   setElapsed]   = useState(0);
  const timerRef                  = useRef(null);

  useEffect(() => {
    if (isWorking) {
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isWorking]);

  const handleStartWorking = useCallback(() => { setElapsed(0); setIsWorking(true);  }, []);
  const handleEndWorking   = useCallback(() => { setIsWorking(false); }, []);

  // ── Event toggles (keyed by event id)
  const [eventToggles, setEventToggles] = useState(
    TODAY_EVENTS.reduce((acc, e) => ({ ...acc, [e.id]: e.id === '2' }), {})
  );
  const handleEventToggle = useCallback((id) => {
    setEventToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // ── Side nav visibility
  const [showNavTabs, setShowNavTabs] = useState(false);
  const toggleNavTabs = useCallback(() => {
    setShowNavTabs((prev) => !prev);
  }, []);

  // ── Derived / computed values
  const dateLabel    = formatDateLabel(now);
  const greeting     = getGreeting(now);
  const weeklyData   = buildWeeklyData(now);   // re-computed each minute via `now`
  const formattedTime = formatElapsedTime(elapsed);
  const reimbursedPct = REIMBURSEMENT.used / REIMBURSEMENT.total;
  const userName      = user?.name || 'Peter';

  return {
    // Identity
    userName,
    greeting,

    // Date / Location / Weather
    dateLabel,
    city:         location.city,
    weatherEmoji: weather.emoji,
    weatherLabel: weather.label,
    weatherTemp:  `${weather.temp}${weather.unit}`,

    // Mood
    moods: MOODS,
    selectedMood,
    handleMoodSelect,

    // Timer
    isWorking,
    formattedTime,
    handleStartWorking,
    handleEndWorking,

    // Events
    todayEvents:   TODAY_EVENTS,
    eventToggles,
    handleEventToggle,

    // Chart (real week)
    weeklyData,
    maxChartHours: MAX_CHART_HOURS,
    barHeight:     BAR_HEIGHT,

    // Leave
    leaveData: LEAVE_DATA,

    // Reimbursement
    reimbursement: REIMBURSEMENT,
    reimbursedPct,

    // Nav
    navTabs:NAV_TABS,
    showNavTabs,
    toggleNavTabs,
  };
}