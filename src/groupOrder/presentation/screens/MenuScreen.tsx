// src/groupOrder/presentation/screens/MenuScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useGroupOrderViewModel } from '../hooks/useGroupOrderViewModel';
import { useAuthViewModel } from '../../../auth/presentation/hooks/useAuthViewModel';
import { MENU_PRODUCTS } from '../../../core/types';

export const MenuScreen = ({ route, navigation }: any) => {
  const { groupId } = route.params;
  const { user } = useAuthViewModel();
  const { group, inviteParticipant, addProductToCart } = useGroupOrderViewModel(groupId, user);
  const [inviteEmail, setInviteEmail] = useState('');

  const handleInvite = async () => {
    try {
      await inviteParticipant(inviteEmail);
      setInviteEmail('');
      alert('Invite successful!');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const isHost = group?.hostId === user?.id;

  return (
    <View style={styles.container}>
      <Text style={styles.sessionInfo}>Session ID: {groupId}</Text>
      <Text style={styles.count}>Group size: {group?.participants.length || 0} / 3 Members</Text>

      {/* Invite System Section */}
      <View style={styles.inviteContainer}>
        <TextInput style={styles.input} placeholder="Participant Email Address" value={inviteEmail} onChangeText={setInviteEmail} autoCapitalize="none" keyboardType="email-address" />
        <TouchableOpacity style={styles.inviteBtn} onPress={handleInvite}>
          <Text style={styles.inviteText}>Invite</Text>
        </TouchableOpacity>
      </View>

      {/* Menu List Section */}
      <Text style={styles.menuTitle}>Digital Menu</Text>
      <FlatList
        data={MENU_PRODUCTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productRow}>
            <View>
              <Text style={styles.pName}>{item.name}</Text>
              <Text style={styles.pPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={() => addProductToCart(item)}>
              <Text style={styles.addBtnText}>+ Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Shared Persistent Checkout Controls Footer */}
      <View style={styles.footer}>
        {isHost ? (
          <TouchableOpacity style={styles.checkoutBtn} onPress={() => navigation.navigate('CheckoutScreen', { groupId })}>
            <Text style={styles.checkoutText}>View Checkout Summary (Host Only)</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.nonHostAlert}>Waiting for host {group?.hostEmail} to process orders...</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
  sessionInfo: { fontSize: 13, color: '#666', marginBottom: 4 },
  count: { fontSize: 16, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  inviteContainer: { flexDirection: 'row', marginBottom: 24 },
  input: { flex: 1, borderHeight: 1, borderColor: '#DDD', padding: 12, borderRadius: 8, backgroundColor: '#FAFAFA' },
  inviteBtn: { backgroundColor: '#111', justifyContent: 'center', paddingHorizontal: 16, borderRadius: 8, marginLeft: 8 },
  inviteText: { color: '#FFF', fontWeight: 'bold' },
  menuTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  productRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderColor: '#F0F0F0', alignItems: 'center' },
  pName: { fontSize: 15, fontWeight: '600' },
  pPrice: { color: '#FF3008', marginTop: 4, fontWeight: '500' },
  addBtn: { backgroundColor: '#FFF1EE', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  addBtnText: { color: '#FF3008', fontWeight: '600' },
  footer: { borderTopWidth: 1, borderColor: '#EEE', paddingTop: 16, marginTop: 12 },
  checkoutBtn: { backgroundColor: '#FF3008', padding: 16, borderRadius: 10, alignItems: 'center' },
  checkoutText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  nonHostAlert: { color: '#777', textAlign: 'center', fontStyle: 'italic' }
});
