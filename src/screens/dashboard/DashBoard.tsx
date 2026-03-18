import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { useDashboard } from './Dashboard.js';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Settings: undefined;
};
 

// ─── Design Tokens ────────────────────────────────────────────────────────────
// const PRIMARY         = '#4B4EFC';
// const PRIMARY_LIGHT   = '#EEEEFF';
// const CARD_BG        = '#FFFFFF';
// const SCREEN_BG      = '#E8EAF6';
// const TEXT_PRIMARY   = '#1E2047';
// const TEXT_SECONDARY = '#8C8FA8';
// const AMBER          = '#F59E2B';



// 🌿 Modern Soft UI Palette
const PRIMARY        = '#5DB7A3';   // teal green (main accent)
const PRIMARY_DARK   = '#3E8E7E';
const PRIMARY_LIGHT  = '#DFF5EF';

const SCREEN_BG      = '#F3F4F6';   // soft light grey background
const CARD_BG        = '#FFFFFF';

const TEXT_PRIMARY   = '#1C1C1E';   // near black
const TEXT_SECONDARY = '#8E8E93';   // iOS style grey

const SUCCESS        = '#34C759';   // green (positive stats)
const WARNING        = '#FF9F0A';   // orange
const ERROR          = '#FF3B30';

const DARK_CARD      = '#1C1C1E';   // for bottom nav / dark elements

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Circular progress ring — purely presentational. */
const CircularProgress: React.FC<{
  used: number;
  total: number;
  size?: number;
  color?: string;
}> = ({ used, total, size = 72, color = PRIMARY }) => {
  const progress = used / total;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          position: 'absolute',
          width: size, height: size,
          borderRadius: size / 2,
          borderWidth: 5,
          borderColor: '#E8E9F3',
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: size, height: size,
          borderRadius: size / 2,
          borderWidth: 5,
          borderColor: 'transparent',
          borderTopColor:    color,
          borderRightColor:  progress > 0.25 ? color : 'transparent',
          borderBottomColor: progress > 0.5  ? color : 'transparent',
          borderLeftColor:   progress > 0.75 ? color : 'transparent',
          transform: [{ rotate: '-45deg' }],
        }}
      />
      <Text style={{ fontSize: 13, fontWeight: '700', color: '#2D2E5F' }}>
        {used}
        <Text style={{ fontSize: 10, fontWeight: '400', color: '#A0A3C4' }}>/{total}</Text>
      </Text>
    </View>
  );
};

/** Bar chart — data-driven, built from real current-week dates. */
const BarChart: React.FC<{
  data: { day: string; hours: number; isToday: boolean; isFuture: boolean }[];
  maxHours: number;
  barHeight: number;
}> = ({ data, maxHours, barHeight }) => (
  <View style={styles.chartContainer}>
    {/* Y-axis labels */}
    <View style={[styles.yAxis, { height: barHeight + 20 }]}>
      {[10, 8, 6, 4, 2, 0].map((h) => (
        <Text key={h} style={styles.yLabel}>{h} hr</Text>
      ))}
    </View>

    {/* Bars */}
    <View style={styles.barsRow}>
      {data.map((d) => {
       const barColor = d.isToday
        ? PRIMARY
        : d.isFuture || d.hours === 0
        ? '#E5E5EA'
        : '#7FD1C2'; // lighter teal
        const filledHeight = d.hours > 0
          ? Math.max(4, (d.hours / maxHours) * barHeight)
          : 0;

        return (
          <View key={d.day} style={styles.barColumn}>
            {/* Today label pill */}
            {d.isToday && (
              <View style={styles.todayPill}>
                <Text style={styles.todayPillText}>Today</Text>
              </View>
            )}
            <View style={[styles.barTrack, { height: barHeight }]}>
              {filledHeight > 0 && (
                <View style={[styles.bar, { height: filledHeight, backgroundColor: barColor }]} />
              )}
            </View>
            <Text style={[styles.xLabel, d.isToday && styles.xLabelToday]}>{d.day}</Text>
          </View>
        );
      })}
    </View>
  </View>
);

// ─── Main UI Component ────────────────────────────────────────────────────────
const Dashboard: React.FC = () => {
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    userName,
    greeting,
    dateLabel,
    city,
    weatherEmoji,
    weatherLabel,
    weatherTemp,
    moods,
    selectedMood,
    handleMoodSelect,
    isWorking,
    formattedTime,
    handleStartWorking,
    handleEndWorking,
    todayEvents,
    eventToggles,
    handleEventToggle,
    weeklyData,
    maxChartHours,
    barHeight,
    leaveData,
    reimbursement,
    reimbursedPct,
    navTabs,
    showNavTabs,
    toggleNavTabs,
  } = useDashboard();

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Settings')}
          >
            {/* <Icon name="person" size={30} color="#900" /> */}
            <Text>⚙️</Text>
          </TouchableOpacity>
          <Text style={styles.greeting}>{greeting}, {userName}!</Text>
          <Text style={styles.headerIcon}>🔔</Text>
        </View>

        {/* ── Date, Location & Live Weather ── */}
        <View style={styles.dateCard}>
          <View style={styles.dateLeft}>
            <Text style={styles.dateText}>{dateLabel}</Text>
            <Text style={styles.locationText}>{city}</Text>
          </View>
          <View style={styles.weatherBadge}>
            <Text style={styles.weatherEmoji}>{weatherEmoji}</Text>
            <View style={styles.weatherInfo}>
              <Text style={styles.weatherTemp}>{weatherTemp}</Text>
              <Text style={styles.weatherLabel}>{weatherLabel}</Text>
            </View>
          </View>
        </View>

        {/* ── Mood Card ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>How are you feeling today?</Text>
          <View style={styles.moodRow}>
            {moods.map((m) => (
              <TouchableOpacity
                key={m.label}
                style={[styles.moodBtn, selectedMood === m.label && styles.moodBtnActive]}
                onPress={() => handleMoodSelect(m.label)}
                activeOpacity={0.7}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text style={[styles.moodLabel, selectedMood === m.label && styles.moodLabelActive]}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {isWorking ? (
            <View style={styles.timerRow}>
              <Text style={styles.timerText}>{formattedTime}</Text>
              <TouchableOpacity style={styles.endBtn} onPress={handleEndWorking} activeOpacity={0.8}>
                <Text style={styles.endBtnText}>End Working</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.startBtn} onPress={handleStartWorking} activeOpacity={0.85}>
              <Text style={styles.startBtnText}>Start Working</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Today Events ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today Events</Text>
          {todayEvents.map((event, idx) => (
            <View
              key={event.id}
              style={[styles.eventRow, idx === todayEvents.length - 1 && { marginBottom: 0 }]}
            >
              <View style={[styles.eventIcon, { backgroundColor: event.iconBg }]}>
                <Text style={styles.eventIconText}>{event.iconEmoji}</Text>
              </View>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventTime}>{event.time}</Text>
              </View>
              <Switch
                value={eventToggles[event.id]}
                onValueChange={() => handleEventToggle(event.id)}
                trackColor={{ false: '#D1D5DB', true: PRIMARY }}
                thumbColor="#fff"
              />
            </View>
          ))}
        </View>

        {/* ── Working Statistic (real week) ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Working Statistic</Text>
            <TouchableOpacity style={styles.dropdownBtn}>
              <Text style={styles.dropdownText}>Weekly ▾</Text>
            </TouchableOpacity>
          </View>
          <BarChart data={weeklyData} maxHours={maxChartHours} barHeight={barHeight} />
        </View>

        {/* ── Leave Allowance ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Leave Allowance</Text>
          <View style={styles.leaveRow}>
            {leaveData.map((item) => (
              <View key={item.label} style={styles.leaveItem}>
                <CircularProgress used={item.used} total={item.total} color={PRIMARY} />
                <Text style={styles.leaveLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Medical Reimbursement ── */}
        <View style={[styles.card, { marginBottom: 24 }]}>
          <Text style={styles.cardTitle}>{reimbursement.label}</Text>
          <View style={styles.reimburseHeader}>
            <Text style={styles.reimburseAmount}>
              Rp{reimbursement.used.toLocaleString('id-ID')}
            </Text>
            <Text style={styles.reimburseTotal}>
              /Rp{reimbursement.total.toLocaleString('id-ID')}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${reimbursedPct * 100}%` as any }]} />
            <View style={[styles.progressThumb, { left: `${reimbursedPct * 100}%` as any }]} />
          </View>
        </View>
      </ScrollView>

      {/* ── Dim overlay — tappable to close, only mounted when open ── */}
      {showNavTabs && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={toggleNavTabs}
          activeOpacity={1}
        />
      )}

      {/* ── Floating icon stack — absolutely positioned above everything ── */}
      {showNavTabs && (
        <View style={styles.iconStack}>
          {navTabs.map((tab) => (
            <TouchableOpacity key={tab.label} style={styles.sideNavItem} activeOpacity={0.7}>
              <View style={styles.sideNavIconBox}>
                <Text style={styles.sideNavIcon}>{tab.icon}</Text>
              </View>
              <Text style={styles.sideNavLabel}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ── FAB — always visible, fixed bottom-right ── */}
      {/* <TouchableOpacity
        style={[styles.fab, showNavTabs && styles.fabOpen]}
        onPress={toggleNavTabs}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>{showNavTabs ? '✕' : '＋'}</Text>
      </TouchableOpacity> */}

      <View style={styles.bottomBar}>
  {navTabs.map((tab, index) => (
    <TouchableOpacity key={index} style={styles.bottomItem}>
      <Text style={styles.bottomIcon}>{tab.icon}</Text>
      <Text style={styles.bottomLabel}>{tab.label}</Text>
    </TouchableOpacity>
  ))}
</View>
    </View>
  );
};

export default Dashboard;

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Screen
  screen:        { flex: 1, backgroundColor: SCREEN_BG },
  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 52, paddingBottom: 80 },
  iconBtn: { backgroundColor: '#E5E5EA', padding: 10, borderRadius: 12 },

  // Header
  header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerIcon: { fontSize: 20 },
  // greeting:   { fontSize: 17, fontWeight: '700', color: PRIMARY, letterSpacing: 0.2 },
  greeting: {fontSize: 18,fontWeight: '700',color: TEXT_PRIMARY,},

  // Date + Weather card
  dateCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 16,
    shadowColor: '#B0B4E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 3,
  },
  dateLeft:      { flex: 1 },
  dateText:      { fontSize: 15, fontWeight: '700', color: TEXT_PRIMARY },
  locationText:  { fontSize: 12, color: TEXT_SECONDARY, marginTop: 2 },
  weatherBadge:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 12 },
  weatherEmoji:  { fontSize: 30 },
  weatherInfo:   { alignItems: 'flex-end' },
  weatherTemp:   { fontSize: 16, fontWeight: '800', color: TEXT_PRIMARY },
  weatherLabel:  { fontSize: 10, color: TEXT_SECONDARY, marginTop: 1 },

  // Card
  // card: {
  //   backgroundColor: CARD_BG,
  //   borderRadius: 20,
  //   padding: 18,
  //   marginBottom: 16,
  //   shadowColor: '#B0B4E8',
  //   shadowOffset: { width: 0, height: 6 },
  //   shadowOpacity: 0.18,
  //   shadowRadius: 14,
  //   elevation: 4,
  // },

  card: {
  backgroundColor: CARD_BG,
  borderRadius: 20,
  padding: 18,
  marginBottom: 16,
  
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 6,
  elevation: 2,
},

  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardTitle:  { fontSize: 15, fontWeight: '700', color: TEXT_PRIMARY, marginBottom: 14 },

  // Mood
  moodRow:         { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  moodBtn:         { alignItems: 'center', padding: 6, borderRadius: 12, minWidth: 44 },
  // moodBtnActive:   { backgroundColor: PRIMARY_LIGHT },
  moodBtnActive: {backgroundColor: PRIMARY_LIGHT,},
  moodEmoji:       { fontSize: 22, marginBottom: 4 },
  moodLabel:       { fontSize: 9, color: TEXT_SECONDARY, fontWeight: '500' },
  // moodLabelActive: { color: PRIMARY, fontWeight: '700' },
  moodLabelActive: {color: PRIMARY,fontWeight: '700',},

  // Start / End Working
  // startBtn:     { backgroundColor: PRIMARY, borderRadius: 14, paddingVertical: 15, alignItems: 'center', shadowColor: PRIMARY, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 5 },
  startBtn: {
  backgroundColor: PRIMARY,
  borderRadius: 16,
  paddingVertical: 14,
  alignItems: 'center',
},
  // startBtnText: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
  startBtnText: {
  color: '#fff',
  fontSize: 15,
  fontWeight: '600',
},
  timerRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timerText:    { fontSize: 28, fontWeight: '800', color: PRIMARY, letterSpacing: 1 },
  endBtn:       { backgroundColor: PRIMARY, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 22, shadowColor: PRIMARY, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  endBtnText:   { color: '#fff', fontWeight: '700', fontSize: 14 },

  // Events
  eventRow:      { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  eventIcon:     { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  eventIconText: { fontSize: 18 },
  eventInfo:     { flex: 1 },
  eventTitle:    { fontSize: 14, fontWeight: '600', color: TEXT_PRIMARY },
  eventTime:     { fontSize: 12, color: TEXT_SECONDARY, marginTop: 2 },

  // Bar Chart
  chartContainer: { flexDirection: 'row', marginTop: 4 },
  yAxis:          { justifyContent: 'space-between', paddingBottom: 20, paddingRight: 6 },
  yLabel:         { fontSize: 9, color: TEXT_SECONDARY, textAlign: 'right' },
  barsRow:        { flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  barColumn:      { alignItems: 'center', flex: 1 },
  barTrack:       { justifyContent: 'flex-end' },
  bar:            { width: 18, borderRadius: 6 },
  xLabel:         { fontSize: 8, color: TEXT_SECONDARY, marginTop: 6, textAlign: 'center' },
  xLabelToday:    { color: PRIMARY, fontWeight: '700' },
  todayPill:      { backgroundColor: PRIMARY_LIGHT, borderRadius: 6, paddingHorizontal: 4, paddingVertical: 2, marginBottom: 4 },
  todayPillText:  { fontSize: 7, color: PRIMARY, fontWeight: '700' },

  // Dropdown
  dropdownBtn:  { backgroundColor: '#F3F4F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  dropdownText: { fontSize: 12, fontWeight: '600', color: TEXT_PRIMARY },

  // Leave Allowance
  leaveRow:   { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 4 },
  leaveItem:  { alignItems: 'center', gap: 8 },
  leaveLabel: { fontSize: 11, color: TEXT_SECONDARY, fontWeight: '500', marginTop: 6, textAlign: 'center' },

  // Reimbursement
  reimburseHeader: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 14 },
  reimburseAmount: { fontSize: 18, fontWeight: '700', color: TEXT_PRIMARY },
  reimburseTotal:  { fontSize: 13, color: TEXT_SECONDARY, marginLeft: 4 },
  progressTrack:   { height: 8, backgroundColor: '#E8E9F3', borderRadius: 4, overflow: 'visible' },
  // progressFill:    { height: 8, backgroundColor: PRIMARY, borderRadius: 4 },
  progressFill: {height: 8,backgroundColor: PRIMARY,borderRadius: 4,},
  progressThumb:   { position: 'absolute', top: -5, width: 18, height: 18, borderRadius: 9, backgroundColor: PRIMARY, marginLeft: -9, shadowColor: PRIMARY, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 4, elevation: 3 },

  // Side Rail + FAB
  // Dim overlay — covers entire screen behind the icon stack
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.30)',
  },

  // Icon stack — floats above content, anchored above the FAB
  iconStack: {
    position: 'absolute',
    right: 20,
    bottom: 110,           // sits just above the FAB
    alignItems: 'center',
    gap: 10,
  },
  sideNavItem:    { alignItems: 'center', gap: 4 },
  sideNavIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: CARD_BG,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
  sideNavIcon:  { fontSize: 18 },
  sideNavLabel: { fontSize: 9, color: TEXT_SECONDARY, fontWeight: '600' },

  // FAB — always at bottom-right, independent of icon stack
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 48,
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: DARK_CARD,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
  bottomBar: {
  position: 'absolute',
  bottom: 30,
  left: 20,
  right: 20,

  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',

  backgroundColor: DARK_CARD,
  borderRadius: 28,
  paddingVertical: 12,

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.25,
  shadowRadius: 12,
  elevation: 10,
},

bottomItem: {
  alignItems: 'center',
  justifyContent: 'center',
},

bottomIcon: {
  fontSize: 20,
  color: '#fff',
},

bottomLabel: {
  fontSize: 10,
  color: '#ccc',
  marginTop: 2,
},
  fabIcon: { fontSize: 24, color: '#fff', lineHeight: 28 },
  fabOpen: { backgroundColor: DARK_CARD },
});