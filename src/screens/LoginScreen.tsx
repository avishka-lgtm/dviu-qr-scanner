import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type LoginScreenProps = StackScreenProps<RootStackParamList, 'Login'> & {
  onLoginSuccess: () => void;
};

type LoginErrors = {
  username?: string;
  password?: string;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDisabled = useMemo(() => isSubmitting, [isSubmitting]);

  const validate = () => {
    const nextErrors: LoginErrors = {};
    if (!username.trim()) {
      nextErrors.username = 'Username is required';
    }
    if (!password.trim()) {
      nextErrors.password = 'Password is required';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Wire this up to the real admin login endpoint.
      onLoginSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#0f0f0f' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 items-center justify-center px-6"
      >
        <View className="w-full rounded-3xl border border-white/10 bg-[#1a1a1a] p-6">
          <View className="items-center mb-6">
            <View className="w-14 h-14 rounded-full items-center justify-center bg-[#f5b301]">
              <Ionicons name="log-in-outline" size={26} color="#141414" />
            </View>
          </View>

          <Text className="text-white text-2xl font-bold text-center">
            Admin Login
          </Text>
          <Text className="text-slate-400 text-sm text-center mt-2 mb-6">
            Enter your credentials to access the admin panel
          </Text>

          <View className="mb-4">
            <Text className="text-slate-300 text-sm font-semibold mb-2">
              Username
            </Text>
            <TextInput
              value={username}
              onChangeText={value => setUsername(value)}
              placeholder="Enter your username"
              placeholderTextColor="#64748b"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="username"
              className="w-full rounded-2xl border px-4 py-3 text-white"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderColor: errors.username ? '#f87171' : 'rgba(255, 255, 255, 0.12)',
              }}
            />
            {errors.username ? (
              <Text className="text-xs text-red-400 mt-2">
                {errors.username}
              </Text>
            ) : null}
          </View>

          <View className="mb-6">
            <Text className="text-slate-300 text-sm font-semibold mb-2">
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={value => setPassword(value)}
              placeholder="Enter your password"
              placeholderTextColor="#64748b"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              className="w-full rounded-2xl border px-4 py-3 text-white"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderColor: errors.password ? '#f87171' : 'rgba(255, 255, 255, 0.12)',
              }}
            />
            {errors.password ? (
              <Text className="text-xs text-red-400 mt-2">
                {errors.password}
              </Text>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isDisabled}
            activeOpacity={0.85}
            className="w-full rounded-2xl px-4 py-3"
            style={{
              backgroundColor: isDisabled ? 'rgba(245, 179, 1, 0.5)' : '#f5b301',
            }}
          >
            <Text className="text-[#141414] text-center font-semibold text-base">
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
