import React, { useState, useEffect } from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '@/libs/supabaseClient';  // Asegúrate de que la configuración de Supabase esté correctamente importada

import { NavigationProp } from '@react-navigation/native';

export default function FeedingScheduleScreen({ navigation }: { navigation: NavigationProp<any> }) {
  const [schedules, setSchedules] = useState<{ id: number; time: Date; active: boolean; days: string[]; pet_name: string, notified: boolean }[]>([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<{ id: number; time: Date; active: boolean; days: string[]; pet_name: string } | null>(null);
  const [tempTime, setTempTime] = useState(new Date());

  // Array para almacenar las horas y minutos programados como objetos
  const [timesArray, setTimesArray] = useState<{ hour: number, minute: number }[]>([]);
  const [notifiedMinutes, setNotifiedMinutes] = useState<number[]>([]);  // Estado para almacenar los minutos notificados

  useEffect(() => {
    // Llamada para obtener los horarios guardados
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('feeding_schedules')
        .select('*');  // Seleccionamos todos los registros

      if (error) {
        throw error;
      }

      // Si la consulta es exitosa, actualizamos el estado con los horarios obtenidos
      const formattedSchedules = data.map(schedule => ({
        ...schedule,
        notified: false,  // Añadir la propiedad notified para cada horario
      }));
      setSchedules(formattedSchedules);

      // Ahora extraemos las horas y minutos de cada horario y las almacenamos en un array de objetos
      const times = formattedSchedules.map((schedule) => {
        const scheduleTime = new Date(schedule.time);
        return {
          hour: scheduleTime.getHours(),
          minute: scheduleTime.getMinutes(),
        };  // Guardamos las horas y minutos como objetos
      });

      // Establecemos el array de tiempos
      setTimesArray(times);
    } catch (error) {
      console.error('Error al recuperar los horarios:', error);
      alert('Error al recuperar los horarios.');
    }
  };

  // Revisar si la hora actual coincide con alguna programada
  const checkSchedules = () => {
    if (timesArray.length === 0) {
      console.log('El array de horarios está vacío, no se puede verificar.');
      return;
    }

    const currentTime = new Date();
    const currentTimeInMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();  // Convertir la hora actual a minutos
    console.log("Hora actual (minutos):", currentTimeInMinutes);
    console.log("Array de horas programadas (minutos):", timesArray);
    console.log("Minutos notificados:", notifiedMinutes);

    // Verificar si la hora actual coincide con alguna hora programada
    timesArray.forEach((time, index) => {
      const scheduleTimeInMinutes = time.hour * 60 + time.minute;  // Convertimos la hora y minuto a minutos

      // Evitar repetir el mismo minuto
      if (
        scheduleTimeInMinutes === currentTimeInMinutes &&
        !schedules[index].notified &&
        schedules[index].active &&
        !notifiedMinutes.includes(currentTimeInMinutes)
      ) {

        alert("Es hora de alimentar")
        // fetchDataFromServer()

        setSchedules(prevSchedules => {
          const updatedSchedules = [...prevSchedules];
          updatedSchedules[index].notified = true;
          return updatedSchedules;
        });

        // Añadir el minuto notificado al array
        setNotifiedMinutes(prev => [...prev, currentTimeInMinutes]);
      }
    });
  };

  const fetchDataFromServer = async () => {
    try {
      const response = await fetch('https://tu-servidor.com/api/alert', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },

      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);
    } catch (error) {
      console.error('Error al hacer la solicitud GET:', error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => checkSchedules(), 30000);  // Verifica cada 30 segundos
    return () => clearInterval(intervalId);
  }, [timesArray, notifiedMinutes]);

  const toggleSchedule = (id: number) => {
    setSchedules(schedules.map(schedule =>
      schedule.id === id
        ? { ...schedule, active: !schedule.active }
        : schedule
    ));
  };

  const handleTimeChange = async (data: any) => {
    setShowTimePicker(false);

    if (data.type == 'set') {
      const newSchedulePetName = 'New Pet';
      const newSchedule = {
        id: Date.now(),
        time: new Date(data.nativeEvent.timestamp),
        active: true,
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        petName: "Terry",
        notified: false,
      };

      try {
        const { data: newData, error } = await supabase
          .from('feeding_schedules')
          .insert([{
            time: newSchedule.time,
            active: newSchedule.active,
            days: newSchedule.days,
            pet_name: newSchedule.petName
          }]);

        if (error) {
          throw error;
        }

        alert('Hora agregada exitosamente');
        console.log(newData);

        fetchSchedules();  // Vuelve a obtener los horarios actualizados
      } catch (error) {
        console.error('Error:', error);
        alert('Error al agregar una nueva hora');
      }
    } else {
      return;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation && navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Horario de alimentación</Text>
        <TouchableOpacity onPress={() => { setShowTimePicker(true) }}>
          <Ionicons name="add" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {schedules.length === 0 ? (
          <Text>No hay horarios de alimentación.</Text>
        ) : (
          schedules.map((schedule) => (
            <View key={schedule.id} style={styles.scheduleCard}>
              <View style={styles.scheduleHeader}>
                <View style={styles.petInfo}>
                  <MaterialCommunityIcons
                    name="dog-side"
                    size={24}
                    color="#B4E4E0"
                  />
                  <Text style={styles.petName}>{schedule.pet_name}</Text>
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
                  setShowTimePicker(true);
                }}
              >
                <Text style={[
                  styles.timeText,
                  !schedule.active && styles.inactiveText
                ]}>
                  {formatTime(new Date(schedule.time))}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
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
              <DateTimePicker
                mode='time'
                value={tempTime}
                onChange={handleTimeChange}
              />
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
