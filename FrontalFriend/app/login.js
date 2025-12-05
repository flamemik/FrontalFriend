import React, { useEffect, useState } from 'react';
import { Switch, StyleSheet, Text, View, TextInput, Button, ActivityIndicator, KeyboardAvoidingView, Image } from 'react-native';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail} from 'firebase/auth';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { syncSupabaseAuth } from './syncSupabaseAuth';

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  return result;
}

async function deleteKey(key) {
  await SecureStore.deleteItemAsync(key);
}

async function construct_values(setEmail, setPassword, setIsEnabled) {
  if (await getValueFor('remember-me') === 'true') {
    setIsEnabled(true);
    setEmail(await getValueFor('email'));
    setPassword(await getValueFor('password'));
  }
}

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [rememberMeEnabled, setIsEnabled] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = FIREBASE_AUTH;
  const router = useRouter();
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  useEffect(() => {
    (async () => {
      await construct_values(setEmail, setPassword, setIsEnabled);
    })();
  }, []);

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in successfully:', response.user);
      // ⭐ Sync Firebase → Supabase
    await syncSupabaseAuth();   
      if (rememberMeEnabled === true) {
        await save('remember-me', 'true');
        await save('password', password);
        await save('email', email);
      } else {
        await save('remember-me', 'false');
        await deleteKey('password');
        await deleteKey('email');
      }
      console.log(rememberMeEnabled);
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
      // ⭐ Sync Firebase → Supabase for new account
    await syncSupabaseAuth();
      if (rememberMeEnabled === true) {
        await save('remember-me', 'true');
        await save('password', password);
        await save('email', email);
      } else {
        await save('remember-me', 'false');
        await deleteKey('password');
        await deleteKey('email');
      }
      console.log(rememberMeEnabled);
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
      {/* Background */}
  <Text style={styles.brain1}>🧠</Text>
  <Text style={styles.brain2}>🧠</Text>
      
      <View style={styles.logoContainer}>
            <Image 
            source={require('../assets/images/gradBrainnobg.png')}
            style={styles.logo}
            resizeMode="contain"
            />
      </View>
      
      <Text style={styles.h1}>FrontalFriend</Text>
      
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
      <View style={{flexDirection: 'row', paddingLeft:10, paddingRight:10, alignItems: 'center'}}>
      <Text style={{textAlign: 'left'}}>Remember Me: </Text>

      <Switch
        trackColor={{false: '#7d7d7d', true: '#002b75'}}
        value={rememberMeEnabled}
        onValueChange={toggleSwitch}
        style={{paddingLeft: 100}}
      /></View>
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
  logoContainer: {
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: '#fff',   // optional circle background
  justifyContent: 'center',
  alignItems: 'center',
  alignSelf: 'center',
  marginBottom: 20,
  overflow: 'hidden',        // makes the image fit inside circle
},

logo: {
  width: 90,
  height: 90,
},
brain1: {
  position: 'absolute',
  fontSize: 250,
  opacity: 0.48,
  top: -40,
  left: -20,
},

brain2: {
  position: 'absolute',
  fontSize: 250,
  opacity: 0.48,
  bottom: -40,
  right: -20,
},
});
