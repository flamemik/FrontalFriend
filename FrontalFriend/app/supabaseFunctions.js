import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from "../SupabaseClient";
import { Button } from '@react-navigation/elements';
import { useState } from 'react';

//to be used for the backend of the physical health tracking screen

const [steps, setSteps] = useState('');
const [hoursSlept, sethoursSlept] = useState('');
const [sleepQuality, setsleepQuality] = useState('');

const saveProgress = async ({ steps, hoursSlept, sleepQuality }) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("User not logged in");
    return;
  }

  const { data, error } = await supabase
    .from("progress")
    .insert([
      {
        user_id: user.id,
        date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
        steps,
        hours_slept: hoursSlept,
        sleep_quality: sleepQuality,
      },
    ]);

  if (error) {
    console.error("Error saving progress:", error);
  } else {
    console.log("Progress saved:", data);
  }
};

saveProgress({
  steps: 67,
  hoursSlept: 6.7,
  sleepQuality: "Okay",
})

const getProgressForDate = async (date) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", date);

  if (error) console.error(error);
  return data;
};


const getProgressHistory = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: true });

  if (error) console.error(error);
  return data;
};



export default function PhysicalHealthScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Physical Health</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Your Physical Wellness</Text>
        <Text style={styles.description}>
          Physical health and mental health are deeply connected. Track your activities and build healthy habits.
        </Text>
        <TextInput
                value={steps}
                style={styles.input}
                placeholder="Enter your daily steps."
                autoCapitalize="none"
                onChangeText={setSteps}
        />
        <TextInput
                value={hoursSlept}
                style={styles.input}
                placeholder="Enter hours slept last night."
                autoCapitalize="none"
                onChangeText={sethoursSlept}

        />
        <TextInput
                value={sleepQuality}
                style={styles.input}
                placeholder="Enter your sleep quality (e.g., Good, Okay, Poor)."
                autoCapitalize="none"
                onChangeText={setsleepQuality}
        />
        <Button title="Save Progress" onPress={() => saveProgress({ steps, hoursSlept, sleepQuality })} />
             


      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 18,
    color: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});
