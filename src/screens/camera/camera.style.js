import { Platform, StyleSheet} from 'react-native';



// ─── Design tokens (match Dashboard palette) ────────────────────────────────
export const PRIMARY = '#5DB7A3';
export const PRIMARY_LIGHT = '#DFF5EF';
export const DANGER = '#FF3B30';
export const WARNING_BG = '#FFF3CD';
export const WARNING_TEXT = '#856404';
export const SCREEN_BG = '#F3F4F6';
export const CARD_BG = '#FFFFFF';
export const TEXT_PRIMARY = '#1C1C1E';
export const TEXT_SECONDARY = '#8E8E93';
export const BORDER = '#E5E7EB';
export const SUCCESS = '#34C759';
export const DISABLED_BG = '#D1D5DB';

export default StyleSheet.create({
  safe: { flex: 1, backgroundColor: SCREEN_BG },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 12,
    paddingBottom: 12,
    backgroundColor: CARD_BG,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  headerBack: { fontSize: 28, color: PRIMARY, fontWeight: '300', lineHeight: 32 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: TEXT_PRIMARY },

  // Location badge
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_LIGHT,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 4,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  locationIcon: { fontSize: 14, marginRight: 6 },
  locationText: { flex: 1, fontSize: 13, color: '#1a6b5a', fontWeight: '500' },

  // Today card
  todayCard: {
    backgroundColor: CARD_BG,
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  todayRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  todayLabel: { fontSize: 15, fontWeight: '700', color: TEXT_PRIMARY },
  todayInfo: { fontSize: 13, color: TEXT_SECONDARY },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusBadgeCheckedIn: { backgroundColor: '#D1FAE5' },
  statusBadgeCompleted: { backgroundColor: '#E0F2FE' },
  statusBadgeText: { fontSize: 12, fontWeight: '700', color: '#065F46' },

  checkOutButton: {
    marginTop: 12,
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  checkOutButtonDisabled: { backgroundColor: DISABLED_BG },
  checkOutButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  // Breadcrumb
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 4,
    paddingHorizontal: 20,
  },
  breadStep: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: BORDER,
  },
  breadStepActive: { backgroundColor: PRIMARY },
  breadStepDone: { backgroundColor: '#D1FAE5' },
  breadStepText: { fontSize: 12, fontWeight: '600', color: TEXT_SECONDARY },
  breadStepTextActive: { color: '#fff' },
  breadLine: { flex: 1, height: 2, backgroundColor: BORDER, marginHorizontal: 4 },
  breadLineDone: { backgroundColor: SUCCESS },

  // Section
  section: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: TEXT_PRIMARY, marginBottom: 16 },

  // Type cards
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  typeCard: {
    flex: 1,
    minWidth: '44%',
    backgroundColor: SCREEN_BG,
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeCardSelected: { borderColor: PRIMARY, backgroundColor: PRIMARY_LIGHT },
  typeEmoji: { fontSize: 28, marginBottom: 8 },
  typeLabel: { fontSize: 13, fontWeight: '600', color: TEXT_SECONDARY, textAlign: 'center' },
  typeLabelSelected: { color: PRIMARY },

  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  infoText: { fontSize: 13, color: TEXT_SECONDARY },

  // Office cards
  officeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SCREEN_BG,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  officeCardSelected: { borderColor: PRIMARY, backgroundColor: PRIMARY_LIGHT },
  officeCardOutOfRange: { opacity: 0.65 },
  officeCardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10 },
  officeIcon: { fontSize: 22 },
  officeName: { fontSize: 14, fontWeight: '600', color: TEXT_PRIMARY },
  officeAddress: { fontSize: 12, color: TEXT_SECONDARY, maxWidth: 160 },

  rangeBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, marginLeft: 8 },
  rangeBadgeIn: { backgroundColor: '#D1FAE5' },
  rangeBadgeOut: { backgroundColor: '#FEE2E2' },
  rangeText: { fontSize: 11, fontWeight: '700' },
  rangeTextIn: { color: '#065F46' },
  rangeTextOut: { color: '#991B1B' },

  nearestBanner: {
    marginTop: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 10,
  },
  nearestText: { fontSize: 13, color: '#1D4ED8' },

  emptyText: { fontSize: 14, color: TEXT_SECONDARY, textAlign: 'center', paddingVertical: 24 },

  // Buttons row
  rowButtons: { flexDirection: 'row', gap: 12, marginTop: 16 },
  backButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: BORDER,
    alignItems: 'center',
  },
  backButtonText: { fontSize: 15, color: TEXT_SECONDARY, fontWeight: '600' },
  nextButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonDisabled: { backgroundColor: DISABLED_BG, shadowOpacity: 0 },
  nextButtonText: { fontSize: 15, color: '#fff', fontWeight: '700' },

  // Summary card (camera step)
  summaryCard: {
    backgroundColor: SCREEN_BG,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    gap: 8,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 13, color: TEXT_SECONDARY, fontWeight: '500' },
  summaryValue: { fontSize: 13, color: TEXT_PRIMARY, fontWeight: '700', maxWidth: '60%' },

  warningBanner: {
    backgroundColor: WARNING_BG,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  warningText: { fontSize: 13, color: WARNING_TEXT, fontWeight: '500' },

  // Proceed button
  proceedButton: {
    backgroundColor: PRIMARY,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  proceedButtonDisabled: { backgroundColor: DISABLED_BG, shadowOpacity: 0 },
  proceedButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Camera modal
  cameraModal: { flex: 1, backgroundColor: '#000' },
  cameraOverlay: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 10,
    padding: 10,
    gap: 4,
  },
  cameraOverlayText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  cameraControls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  cameraCloseBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraCloseBtnText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },
  captureButtonDisabled: { backgroundColor: DISABLED_BG },
  captureButtonText: { fontSize: 28, color: '#fff' },

  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: DANGER, fontSize: 16, fontWeight: '600' },
});
