import { StyleSheet } from 'react-native';

// 🌿 Modern Soft UI Palette
export const PRIMARY        = '#5DB7A3';   // teal green (main accent)
export const PRIMARY_DARK   = '#3E8E7E';
export const PRIMARY_LIGHT  = '#DFF5EF';
export const SCREEN_BG      = '#F3F4F6';   // soft light grey background
export const CARD_BG        = '#FFFFFF';
export const TEXT_PRIMARY   = '#1C1C1E';   // near black
export const TEXT_SECONDARY = '#8E8E93';   // iOS style grey
export const SUCCESS        = '#34C759';   // green (positive stats)
export const WARNING        = '#FF9F0A';   // orange
export const ERROR          = '#FF3B30';
export const DARK_CARD      = '#1C1C1E';   // for bottom nav / dark elements

export default StyleSheet.create({
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

  backgroundColor: PRIMARY,
  // opacity: 0.25,
  borderRadius: 28,
  paddingVertical: 12,

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.25,
  shadowRadius: 12,
  elevation: 10,
},

bottomItem: {
  flex:1,

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