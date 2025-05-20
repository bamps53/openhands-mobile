// Jest setup file
jest.mock('expo-av', () => ({
  Audio: {
    Recording: jest.fn().mockImplementation(() => ({
      prepareToRecordAsync: jest.fn().mockResolvedValue({}),
      startAsync: jest.fn().mockResolvedValue({}),
      stopAndUnloadAsync: jest.fn().mockResolvedValue({}),
      getURI: jest.fn().mockReturnValue('file://test/audio.m4a'),
    })),
    requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
    setAudioModeAsync: jest.fn().mockResolvedValue({}),
    RecordingOptionsPresets: {
      HIGH_QUALITY: {},
    },
  },
}));

jest.mock('expo-speech', () => ({
  speak: jest.fn(),
}));

// Mock for react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock for react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({}));

// Mock for expo-secure-store
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
