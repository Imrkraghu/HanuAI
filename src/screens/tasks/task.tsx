import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import styles from './task.style.js';

const initialTasks = {
  todo: [
    { id: '1', title: 'Design login screen' },
    { id: '2', title: 'Write API docs' },
  ],
  inProgress: [
    { id: '3', title: 'Implement dashboard UI' },
  ],
  completed: [
    { id: '4', title: 'Set up project repo' },
  ],
};

const TaskBoard = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const renderColumn = (title, data, color) => (
    <View style={styles.column}>
      <Text style={[styles.columnTitle, { color }]}>{title}</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <Text style={styles.taskText}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {renderColumn('To Do', tasks.todo, '#FF3B30')}
      {renderColumn('In Progress', tasks.inProgress, '#FF9F0A')}
      {renderColumn('Completed', tasks.completed, '#34C759')}
    </View>
  );
};

export default TaskBoard;
