import { Alert } from 'react-native';

export const notify = (message, type = 'info') => {
  Alert.alert(
    type === 'error' ? 'Error' : type === 'success' ? 'Success' : 'Notice',
    message
  );
};

export async function showConfirm(message, title, icon) {
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
        { text: 'OK', onPress: () => resolve(true) }
      ],
      { cancelable: true }
    );
  });
}
