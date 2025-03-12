import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  Modal,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DatePicker from 'react-native-modern-datepicker';

import { NavigationProp } from '@react-navigation/native';

export default function FeedingScheduleScreen({ navigation }: { navigation: NavigationProp<any> }) {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      time: new Date('2024-01-01T08:00:00'),
      active: true,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      petName: 'Max',
    },
    {
      id: 2,
      time: new Date('2024-01-01T12:30:00'),
      active: true,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      petName: 'Bella',
    },
    {
      id: 3,
      time: new Date('2024-01-01T18:00:00'),
      active: false,
      days: ['Mon', 'Wed', 'Fri'],
      petName: 'Max',
    },
  ]);

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<{ id: number; time: Date; active: boolean; days: string[]; petName: string } | null>(null);
  const [tempTime, setTempTime] = useState(new Date());

  const daysOfWeek = ['Sab', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleSchedule = (id: number) => {
    setSchedules(schedules.map(schedule =>
      schedule.id === id
        ? { ...schedule, active: !schedule.active }
        : schedule
    ));
  };

  const handleTimeChange = (data: any) => {
    alert(data);

    setShowTimePicker(false);
    // if (selectedSchedule) {
    //   const newTime = new Date(`${selectedTime}:00`);
    //   setSchedules(schedules.map(schedule =>
    //     schedule.id === selectedSchedule.id
    //       ? { ...schedule, time: newTime }
    //       : schedule
    //   ));
    // }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const fetchSchedules = async () => {
    try {
      const response = await fetch('https://tu-api.com/schedules');
      if (!response.ok) {
        throw new Error('Error');
      }
      const data = await response.json();
      alert(data)
      // setSchedules(data); 
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addNewSchedule = () => {
    const newSchedule = {
      id: Date.now(),
      time: new Date(),
      active: true,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      petName: 'New Pet',
    };
    setSchedules([...schedules, newSchedule]);

    fetchSchedules()
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation && navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Horario de alimentación</Text>
        <TouchableOpacity onPress={addNewSchedule}>
          <Ionicons name="add" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {schedules.map((schedule) => (
          <View key={schedule.id} style={styles.scheduleCard}>
            <View style={styles.scheduleHeader}>
              <View style={styles.petInfo}>
                <MaterialCommunityIcons
                  name="dog-side"
                  size={24}
                  color="#B4E4E0"
                />
                <Text style={styles.petName}>{schedule.petName}</Text>
              </View>
              <Switch
                value={schedule.active}
                onValueChange={() => toggleSchedule(schedule.id)}
                trackColor={{ false: '#E5E5E5', true: '#B4E4E0' }}
                thumbColor={schedule.active ? '#2D3A3A' : '#FFF'}
              />
            </View>

            <TouchableOpacity
              style={styles.timeContainer}
              onPress={() => {
                setSelectedSchedule(schedule);
                setTempTime(schedule.time);
                setShowTimePicker(true);
              }}
            >
              <Text style={[
                styles.timeText,
                !schedule.active && styles.inactiveText
              ]}>
                {formatTime(schedule.time)}
              </Text>
            </TouchableOpacity>

            <View style={styles.daysContainer}>
              {daysOfWeek.map((day) => (
                <View
                  key={day}
                  style={[
                    styles.dayBadge,
                    schedule.days.includes(day) && styles.activeDayBadge,
                    !schedule.active && styles.inactiveDayBadge,
                  ]}
                >
                  <Text style={[
                    styles.dayText,
                    schedule.days.includes(day) && styles.activeDayText,
                    !schedule.active && styles.inactiveText,
                  ]}>
                    {day}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {showTimePicker && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={showTimePicker}
          onRequestClose={() => setShowTimePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Seleccionar hora</Text>
              <DatePicker
                mode="datepicker"
                // selected={tempTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                onDateChange={handleTimeChange}
              // minuteInterval={3} // Intervalos de 5 minutos
              />
              {/* <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3A3A',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scheduleCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  petInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petName: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3A3A',
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  timeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3A3A',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  dayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    marginRight: 4,
    marginBottom: 4,
  },
  activeDayBadge: {
    backgroundColor: '#B4E4E0',
  },
  inactiveDayBadge: {
    backgroundColor: '#F5F5F5',
  },
  dayText: {
    fontSize: 12,
    color: '#9B9B9B',
  },
  activeDayText: {
    color: '#2D3A3A',
    fontWeight: '500',
  },
  inactiveText: {
    color: '#9B9B9B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3A3A',
    textAlign: 'center',
    marginBottom: 20,
  },
  doneButton: {
    backgroundColor: '#B4E4E0',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  doneButtonText: {
    color: '#2D3A3A',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
