// src/auth/presentation/screens/AuthScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuthViewModel } from '../hooks/useAuthViewModel';

export const AuthScreen = () => {
  const { handleLogin, handleSignUp } = useAuthViewModel();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      if (isSignUp) await handleSignUp(email, password);
      else await handleLogin(email, password);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUp ? 'Create Architecture Account' : 'Group Order Login'}</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      {loading ? <ActivityIndicator size="large" /> : (
        <>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.btnText}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.toggleText}>{isSignUp ? 'Already have an account? Login' : 'New here? Register Account'}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#FAFAFA' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 24, color: '#111', textAlign: 'center' },
  input: { backgroundColor: '#FFF', padding: 14, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#EAEAEA' },
  button: { backgroundColor: '#FF3008', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  toggleText: { color: '#555', textAlign: 'center', marginTop: 16, fontSize: 14 }
});
