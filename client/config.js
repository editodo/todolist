
// client/config.js
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// In development (running locally), use localhost.
// In production (bundled app or web deployment), use the domain.
// Note: Android Emulator needs '10.0.2.2' instead of 'localhost'.

// Phones running the dev build reach the PC by the same address Expo serves the app from (e.g. 192.168.0.5:8081)
const devHost = Constants.expoConfig?.hostUri?.split(':')[0];
const DEV_API_URL = Platform.OS === 'web'
    ? 'http://localhost:8080'
    : `http://${devHost || (Platform.OS === 'android' ? '10.0.2.2' : 'localhost')}:8080`;

const PROD_API_URL = 'https://editodo.com';

// You can toggle this manually or use __DEV__ if configured
// Automatically detect environment
// __DEV__ is true in development, false in production builds
// For web, we can also check the hostname to be sure
const isLocalhost = Platform.OS === 'web' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const IS_DEV = __DEV__ || isLocalhost;

export const API_URL = IS_DEV ? DEV_API_URL : PROD_API_URL;

// Operator info shown in 문의하기, terms and the privacy policy. SUPPORT_EMAIL must be a mailbox someone reads.
export const COMPANY = 'codemodo';
export const COMPANY_WEB = 'https://www.codemodo.kr';
export const SUPPORT_EMAIL = 'hello@codemodo.kr';

// Google sign-in (Google Cloud Console → APIs & Services → Credentials → OAuth client IDs).
// WEB is the "Web application" client: its ID is the token audience the server checks (GOOGLE_CLIENT_IDS).
// IOS is the "iOS" client; also put its reversed form in app.json → google-signin plugin → iosUrlScheme.
// While WEB is empty the Google button is hidden (and on iOS while IOS is empty).
export const GOOGLE_WEB_CLIENT_ID = '';
export const GOOGLE_IOS_CLIENT_ID = '';

// Sign in with Apple on the web: the Services ID (Apple Developer → Identifiers → Services IDs). Empty = no Apple button on web.
// Kakao login: the app's REST API key from developers.kakao.com (a public client ID; the secret stays on the server).
export const KAKAO_REST_API_KEY = '';
export const APPLE_SERVICES_ID = '';

// Login token, set by AuthContext. Every API call goes through apiFetch so the server knows who is asking.
let authToken = null;
export const setAuthToken = (token) => { authToken = token || null; };

export const apiFetch = (url, options = {}) => fetch(url, {
    ...options,
    headers: { ...options.headers, ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
});
