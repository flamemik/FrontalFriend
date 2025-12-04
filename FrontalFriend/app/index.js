import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';

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

  // Get first name from email
  const getFirstName = () => {
    if (!user?.email) return 'Friend';
    const emailName = user.email.split('@')[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  };

  // Show loading or nothing while checking auth state
  if (loading || !user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#3B7EBF', '#2E6BA8']}
        style={styles.header}
      >
            <View style={styles.headerRow}>
        <Text style={styles.greeting}>Hi {getFirstName()}!</Text>
        <Text style={styles.logout} onPress={() => FIREBASE_AUTH.signOut()}>
        Logout
      </Text>
          </View>
        <View style={styles.divider} />
        <Text style={styles.welcomeMessage}>
          Welcome! We're glad you're here. How do you want to improve your mental health today?
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.cardsGrid}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push('/consent')}
          >
            <View style={styles.iconPlaceholder}>
              <Text style={styles.iconText}>💬</Text>
            </View>
            <Text style={styles.cardTitle}>Chat</Text>
            <Text style={styles.cardDescription}>Talk with AI for emotional support</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push('/relax')}
          >
            <View style={styles.iconPlaceholder}>
              <Text style={styles.iconText}>🧘</Text>
            </View>
            <Text style={styles.cardTitle}>Relax</Text>
            <Text style={styles.cardDescription}>Calm your mind with grounding videos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push('/reminders')}
          >
            <View style={styles.iconPlaceholder}>
              <Text style={styles.iconText}>⏰</Text>
            </View>
            <Text style={styles.cardTitle}>Reminders</Text>
            <Text style={styles.cardDescription}>Stay on track with alerts</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push('/physical-health')}
          >
            <View style={styles.iconPlaceholder}>
              <Text style={styles.iconText}>💪</Text>
            </View>
            <Text style={styles.cardTitle}>Physical Health</Text>
            <Text style={styles.cardDescription}>Log activity to boost your well-being</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push('/contact')}
          >
            <View style={styles.iconPlaceholder}>
              <Text style={styles.iconText}>📞</Text>
            </View>
            <Text style={styles.cardTitle}>Contact</Text>
            <Text style={styles.cardDescription}>Reach out for help from resources</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push('/important-documents')}
          >
            <View style={styles.iconPlaceholder}>
              <Text style={styles.iconText}>📄</Text>
            </View>
            <Text style={styles.cardTitle}>Documents</Text>
            <Text style={styles.cardDescription}>Store important information</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 2,
  backgroundColor: "#000",
  marginVertical: 8,
  opacity: 0.3,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  headerRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  welcomeMessage: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    opacity: 0.95,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '47%',
    aspectRatio: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 28,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 6,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  logout: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
  },
});
