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
import styles, {PRIMARY} from './Dashboard.style.js';
// import Icon from 'react-native-vector-icons/Ionicons';
type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Settings: undefined;
  markattendance: undefined;
  Signup: undefined;
  LeaveApplication: undefined;
  Records: undefined;
  TaskBoard: undefined;
};
 



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
    alreadyDone,
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
        <Text style={styles.startBtnText}>
          {alreadyDone? 'Already Done for Today' : 'Start Working'}
        </Text>
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
            <TouchableOpacity key={tab.label} style={styles.sideNavItem} activeOpacity={0.7}  onPress={() => {
          // Map tab labels to actual route names in your navigator
          switch (tab.label) {
            case 'Home':
              navigation.navigate('Dashboard');
              break;
            case 'Task':
              navigation.navigate('TaskBoard'); // your task screen
              break;
            case 'Leave':
              navigation.navigate('LeaveApplication'); // your leave screen
              break;
            case 'Attendance':
              navigation.navigate('Records'); // attendance records screen
              break;
            default:
              break;
          }
        }}>
              <View style={styles.sideNavIconBox}>
                <Text style={styles.sideNavIcon}>{tab.icon}</Text>
              </View>
              <Text style={styles.sideNavLabel}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}


    <View style={styles.bottomBar}>
  {navTabs.map((tab, index) => (
    <TouchableOpacity
      key={index}
      style={styles.bottomItem}
      onPress={() => {
        switch (tab.label) {
          case 'Home':
            navigation.navigate('Dashboard');
            break;
          case 'Task':
            navigation.navigate('TaskBoard');
            break;
          case 'Leave':
            navigation.navigate('LeaveApplication');
            break;
          case 'Attendance':
            navigation.navigate('Records');
            break;
          default:
            break;
        }
      }}
    >
      <Text style={styles.bottomIcon}>{tab.icon}</Text>
      <Text style={styles.bottomLabel}>{tab.label}</Text>
    </TouchableOpacity>
  ))}
</View>
    </View>
  );
};

export default Dashboard;