// src/groupOrder/presentation/screens/DashboardScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useGroupOrderViewModel } from '../hooks/useGroupOrderViewModel';
import { useAuthViewModel } from '../../../auth/presentation/hooks/useAuthViewModel';

export const DashboardScreen = ({ navigation }: any) => {
  const { user, handleLogout } = useAuthViewModel();
  const { createNewSession, loading } = useGroupOrderViewModel(null, user);
  const [inputGroupId, setInputGroupId] = useState('');

  const handleStartGroup = async () => {
    const id = await createNewSession();
    if (id) navigation.navigate('MenuScreen', { groupId: id });
  };

  const handleJoinGroup = () => {
    if (inputGroupId.trim()) {
      navigation.navigate('MenuScreen', { groupId: inputGroupId.trim() });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {user?.email}</Text>
      {loading ? <ActivityIndicator size="large" color="#FF3008" /> : (
        <TouchableOpacity style={styles.primaryBtn} onPress={handleStartGroup}>
          <Text style={styles.btnText}>🚀 Start DoorDash-Style Group Order</Text>
        </TouchableOpacity>
      )}
      <View style={styles.dividerZone}>
        <TextInput style={styles.input} placeholder="Paste Group Order Session ID" value={inputGroupId} onChangeText={setInputGroupId} autoCapitalize="none" />
        <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: '#111' }]} onPress={handleJoinGroup}>
          <Text style={styles.btnText}>Join Group</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={{ color: '#070707' }}>Logout Session</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#FFF' },
  welcome: { fontSize: 18, fontWeight: '600', marginBottom: 32, textAlign: 'center' },
  primaryBtn: { backgroundColor: '#FF3008', padding: 16, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  dividerZone: { marginTop: 40, borderTopWidth: 1, borderColor: '#EEE', paddingTop: 40 },
  input: { backgroundColor: '#e4dfdf', padding: 14, borderRadius: 8, borderColor: '#DDD', marginBottom: 12 },
  logout: { marginTop: 50, alignItems: 'center' }
});
