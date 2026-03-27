import React from 'react';
import { View, Text, FlatList, ListRenderItem } from 'react-native';
import styles from './notification.style';

// Define the shape of a notification item
interface NotificationItem {
  id: string;
  title: string;
  time: string;
}

const notifications: NotificationItem[] = [
  { id: '1', title: 'Attendance marked successfully', time: '10:30 AM' },
  { id: '2', title: 'WFH request approved', time: '9:15 AM' },
  { id: '3', title: 'Meeting at 3 PM', time: 'Yesterday' },
];

const NotificationPage: React.FC = () => {
  const renderItem: ListRenderItem<NotificationItem> = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.time}>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default NotificationPage;