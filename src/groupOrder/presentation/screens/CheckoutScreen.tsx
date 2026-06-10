// src/groupOrder/presentation/screens/CheckoutScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useGroupOrderViewModel } from '../hooks/useGroupOrderViewModel';
import { useAuthViewModel } from '../../../auth/presentation/hooks/useAuthViewModel';

export const CheckoutScreen = ({ route, navigation }: any) => {
  const { groupId } = route.params;
  const { user } = useAuthViewModel();
  const { group, orderSummary, finalizeOrder } = useGroupOrderViewModel(groupId, user);

  const isHost = group?.hostId === user?.id;

  if (!isHost) {
    return (
      <View style={styles.fallbackCenter}>
        <Text style={styles.errorText}>Access Denied. Only the host can view checkout details.</Text>
      </View>
    );
  }

  const handlePlaceOrder = async () => {
    await finalizeOrder();
    alert('Group Order successfully placed via Transaction processing!');
    navigation.navigate('DashboardScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Host Order Split Summary</Text>
      <FlatList
        data={orderSummary.individualBreakdown}
        keyExtractor={(item) => item.user.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.emailHeader}>{item.user.email} {item.user.id === group?.hostId ? '(Host)' : ''}</Text>
            {item.items.map((cartItem, idx) => (
              <View key={idx} style={styles.itemRow}>
                <Text style={styles.itemText}>{cartItem.quantity}x {cartItem.product.name}</Text>
                <Text style={styles.priceText}>${(cartItem.product.price * cartItem.quantity).toFixed(2)}</Text>
              </View>
            ))}
            <Text style={styles.userSubtotal}>Subtotal: ${item.subtotal.toFixed(2)}</Text>
          </View>
        )}
      />
      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Grand Total Amount:</Text>
        <Text style={styles.totalAmount}>${orderSummary.grandTotal.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.confirmBtn} onPress={handlePlaceOrder}>
        <Text style={styles.confirmText}>Execute Digital Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FAFAFA' },
  fallbackCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText: { color: '#E53E3E', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  card: { backgroundColor: '#FFF', borderRadius: 10, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#EEE' },
  emailHeader: { fontWeight: '700', fontSize: 14, color: '#333', borderBottomWidth: 1, borderColor: '#F0F0F0', paddingBottom: 6, marginBottom: 8 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  itemText: { color: '#555', fontSize: 14 },
  priceText: { color: '#111', fontWeight: '500' },
  userSubtotal: { textAlign: 'right', fontWeight: '700', color: '#FF3008', marginTop: 8, fontSize: 13 },
  totalBox: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#FFF', borderRadius: 10, marginTop: 12, borderWidth: 1, borderColor: '#E0E0E0' },
  totalLabel: { fontSize: 16, fontWeight: 'bold' },
  totalAmount: { fontSize: 18, fontWeight: 'bold', color: '#FF3008' },
  confirmBtn: { backgroundColor: '#FF3008', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  confirmText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
