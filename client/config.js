
// client/config.js
import { Platform } from 'react-native';

// In development (running locally), use localhost.
// In production (bundled app or web deployment), use the domain.
// Note: Android Emulator needs '10.0.2.2' instead of 'localhost'.

const DEV_API_URL = Platform.OS === 'android'
    ? 'http://10.0.2.2:8080'
    : 'http://localhost:8080';

const PROD_API_URL = 'https://editodo.com';

// You can toggle this manually or use __DEV__ if configured
// Automatically detect environment
// __DEV__ is true in development, false in production builds
// For web, we can also check the hostname to be sure
const isLocalhost = Platform.OS === 'web' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const IS_DEV = __DEV__ || isLocalhost;

export const API_URL = IS_DEV ? DEV_API_URL : PROD_API_URL;
