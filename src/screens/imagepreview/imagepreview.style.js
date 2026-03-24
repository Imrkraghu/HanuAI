
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  fullImage: { flex: 1, width: '100%', height: '100%' },
  text: { color: 'white', textAlign: 'center', marginTop: 50 },

  downloadButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    alignSelf: 'center',
    backgroundColor: 'red',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  downloadText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  closeButton: {
    position: 'absolute',
    bottom: 40,
    left: 80,
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
   SubmitButton: {
    position: 'absolute',
    bottom: 40,
    right: 80,
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  closeText: { color: '#000', fontWeight: 'bold' }
});