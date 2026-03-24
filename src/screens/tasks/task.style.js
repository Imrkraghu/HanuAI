import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#F3F4F6',
  },
  column: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  taskCard: {
    backgroundColor: '#E8E9F3',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  taskText: {
    fontSize: 14,
    color: '#1C1C1E',
  },
});
