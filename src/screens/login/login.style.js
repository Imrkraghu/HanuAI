import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },

  topContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarContainer: {
    width: 220,
    height: 180,
    marginBottom: 20,
    position: 'relative',
  },

  avatarLeft: {
    position: 'absolute',
    left: -20,
    top: 20,
  },

  avatarRight: {
    position: 'absolute',
    right: -20,
    top: 20,
  },

  avatarBottom: {
    position: 'absolute',
    bottom: 0,
    left: '0%',
    top: '50%',
  },

  centerTag: {
    position: 'absolute',
    top: '45%',
    left: '35%',
    backgroundColor: '#555',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  centerText: {
    color: '#fff',
    fontWeight: '600',
  },

  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sudotitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  card: {
    flex: 1.2,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },

  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },

  input: {
    backgroundColor: '#EAEAEA',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    color: '#000',
  },

  forgot: {
    textAlign: 'right',
    marginBottom: 15,
    color: '#555',
  },

  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },

  signupText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#333',
  },
});