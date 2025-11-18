import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // If no user is logged in, redirect to login screen
      if (!currentUser) {
        router.replace('/login');
      }
    });

    return () => unsubscribe();
  }, []);

  // Show loading or nothing while checking auth state
  if (loading || !user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.title}>Frontal Friend</Text>
        <Text style={styles.subtitle}>Mental Health Support</Text>
        <Text style={styles.welcomeText}>Welcome back, {user.email}!</Text>
      </View>

      <Text style={styles.exploreText}>Explore Features</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/chat')}
        >
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/relax')}
        >
          <Text style={styles.buttonText}>Relax</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/reminders')}
        >
          <Text style={styles.buttonText}>Reminders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/physical-health')}
        >
          <Text style={styles.buttonText}>Physical Health</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/contact')}
        >
          <Text style={styles.buttonText}>Contact</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/important-documents')}
        >
          <Text style={styles.buttonText}>Important Documents</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  topSection: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 20,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  exploreText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    alignSelf: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
    alignSelf: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 30,
    borderRadius: 15,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
