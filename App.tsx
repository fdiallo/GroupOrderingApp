// src/App.tsx
import React from 'react';
import { SafeAreaView, StatusBar, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthViewModel } from './src/auth/presentation/hooks/useAuthViewModel';
import { AuthScreen } from './src/auth/presentation/screens/AuthScreen';
import { DashboardScreen } from './src/groupOrder/presentation/screens/DashboardScreen';
import { MenuScreen } from './src/groupOrder/presentation/screens/MenuScreen';
import { CheckoutScreen } from './src/groupOrder/presentation/screens/CheckoutScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const { user, loading } = useAuthViewModel();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF3008" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerTintColor: '#111' }}>
          {user == null ? (
            <Stack.Screen name="AuthScreen" component={AuthScreen} options={{ headerShown: false }} />
          ) : (
            <>
              <Stack.Screen name="DashboardScreen" component={DashboardScreen} options={{ title: 'DoorDash Hub' }} />
              <Stack.Screen name="MenuScreen" component={MenuScreen} options={{ title: 'Group Menu' }} />
              <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} options={{ title: 'Checkout Bill Split' }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}








// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { AuthScreen } from './src/views/AuthScreen';
// import { DashboardScreen } from './src/views/DashboardScreen';
// import { MenuScreen } from './src/views/MenuScreen';
// import { HostSummaryScreen } from './src/views/HostSummaryScreen';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Auth">
//         <Stack.Screen name="Auth" component={AuthScreen} options={{ title: 'Login' }} />
//         <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Group Dashboard' }} />
//         <Stack.Screen name="Menu" component={MenuScreen} options={{ title: 'DoorDash Menu' }} />
//         <Stack.Screen name="HostSummary" component={HostSummaryScreen} options={{ title: 'Checkout Summary' }} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }





// // import { StatusBar } from 'expo-status-bar';
// // import { StyleSheet, Text, View } from 'react-native';

// // export default function App() {
// //   return (
// //     <View style={styles.container}>
// //       <Text>Open up App.js to start working on your app!</Text>
// //       <StatusBar style="auto" />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#fff',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// // });
