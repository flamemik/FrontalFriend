import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { auth } from '../FirebaseConfig';   // make sure this matches your export
import { sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { FIREBASE_AUTH } from '../FirebaseConfig';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const forgotPassword = () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    sendPasswordResetEmail(FIREBASE_AUTH, email)
      .then(() => {
        alert('Password reset email sent!');
        router.back(); // optional: go back to login
      })
      .catch((error) => {
        console.error('Error sending password reset email:', error);
        alert('Failed to send password reset email: ' + error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Button title="Send Reset Email" onPress={forgotPassword} />
      {/* BACK BUTTON */}
      {/*<Button title="Back to Login" onPress={() => router.back()} />*/}
        <Text 
            style={{ color: 'blue', textAlign: 'center', marginTop: 5 }}
            onPress={() => router.back()}
          >
            Back to Login
                  </Text>
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
