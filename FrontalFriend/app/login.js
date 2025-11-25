import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail} from 'firebase/auth';
import { useRouter } from 'expo-router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const router = useRouter();

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in successfully:', response.user);
      //alert('Login Successful!');
      router.replace('/');
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Login Failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up successfully:', response.user);
      alert('Account created successfully!');
      router.replace('/');
    } catch (error) {
      console.error('Error signing up:', error);
      let errorMessage = 'Registration Failed: ';

      // Provide user-friendly error messages
      if (error.code === 'auth/email-already-in-use') {
        errorMessage += 'This email is already registered. Please sign in instead.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage += 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage += 'Password is too weak. Please use a stronger password.';
      } else {
        errorMessage += error.message;
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Text style={styles.h1}>FrontalFriend 🧠</Text>
      
      <TextInput
        value={email}
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={setEmail}
      />

      <TextInput
        secureTextEntry
        value={password}
        style={styles.input}
        placeholder="Password"
        autoCapitalize="none"
        onChangeText={setPassword}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={{ gap: 10 }}>
          <Button title="Login" onPress={signIn} />
          <Button title="Create Account" onPress={signUp} />
          
          <Text 
    style={{ color: 'blue', textAlign: 'center', marginTop: 5 }}
    onPress={() => router.push('/forgotPassword')}
  >
    Forgot Password?
          </Text>

        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    height: 50,
    marginVertical: 4,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});
