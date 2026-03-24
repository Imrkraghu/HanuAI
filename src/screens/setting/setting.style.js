import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
  },

  profile: {
    alignItems: 'center',
    marginBottom: 30,
  },

  avatar: {
    backgroundColor: '#016dbf',
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 40,
  },

  name: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10,
    color: '#1C1C1E',
  },

  email: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },

  option: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },

  logout: {
    color: '#FF3B30',
    fontWeight: '700',
    fontSize: 16,
  },

  footer: {
    marginTop: 'auto',
    alignItems: 'center',
  },

  footerText: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
  },

});