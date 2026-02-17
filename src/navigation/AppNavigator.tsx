import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import BookingDetailsScreen from '../screens/BookingDetailsScreen';
import RestaurantBookingDetailsScreen from '../screens/RestaurantBookingDetailsScreen';
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  saveAuthTokens,
  saveAccessToken,
} from '../services/auth-storage';
import { adminLogin, LoginCredentials, refreshAdminAccessToken } from '../services/auth.service';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const bootstrapToken = async () => {
      try {
        const [savedAccessToken, savedRefreshToken] = await Promise.all([
          getAccessToken(),
          getRefreshToken(),
        ]);

        if (savedAccessToken && savedRefreshToken) {
          setAccessToken(savedAccessToken);
          setRefreshToken(savedRefreshToken);
        }
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrapToken();
  }, []);

  const handleLoginSuccess = async (credentials: LoginCredentials) => {
    const tokens = await adminLogin(credentials);
    await saveAuthTokens(tokens.accessToken, tokens.refreshToken);
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
  };

  const handleRefreshAccessToken = async () => {
    if (!accessToken || !refreshToken) {
      return null;
    }

    const newAccessToken = await refreshAdminAccessToken({
      accessToken,
      refreshToken,
    });
    await saveAccessToken(newAccessToken);
    setAccessToken(newAccessToken);
    return newAccessToken;
  };

  const handleLogout = async () => {
    await clearAuthTokens();
    setAccessToken(null);
    setRefreshToken(null);
  };

  if (isBootstrapping) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: '#0f0f0f' }}>
        <Text className="text-slate-200 text-sm">Loading scanner...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {accessToken && refreshToken ? (
          <>
            <Stack.Screen name="Home">
              {props => (
                <HomeScreen
                  {...props}
                  accessToken={accessToken}
                  onRefreshAccessToken={handleRefreshAccessToken}
                  onLogout={handleLogout}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
            <Stack.Screen name="RestaurantBookingDetails" component={RestaurantBookingDetailsScreen} />
          </>
        ) : (
          <Stack.Screen name="Login">
            {props => (
              <LoginScreen
                {...props}
                onLoginSuccess={handleLoginSuccess}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
