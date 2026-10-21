import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useNetInfo } from '@react-native-community/netinfo';

// Keep the native splash up until login state and the base font are ready (no white flash in between)
SplashScreen.preventAutoHideAsync().catch(() => {});
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Platform, AppState, Alert } from 'react-native';
import { Text } from './components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { wrapApp } from './sentry';
import { syncReminders, onReminderTap } from './notifications';

// Contexts
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DateProvider } from './context/DateContext';

// Theme & Layout
import { colors } from './theme';

// Screens
import OnboardingScreen from './screens/OnboardingScreen';
import LoginScreen from './screens/LoginScreen';
import JoinScreen from './screens/JoinScreen';
import TodoListScreen from './screens/TodoListScreen';
import CalendarScreen from './screens/CalendarScreen';
import DailyWriteScreen from './screens/DailyWriteScreen';
import UserModifyScreen from './screens/UserModifyScreen';
import MyPageScreen from './screens/MyPageScreen';
import Step01Screen from './screens/Step01Screen';
import Step03Screen from './screens/Step03Screen';
import Step04Screen from './screens/Step04Screen';
import NoticeScreen from './screens/NoticeScreen';
import InquiryScreen from './screens/InquiryScreen';
import AdminLoginScreen from './screens/AdminLoginScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import TermsScreen from './screens/TermsScreen';
import AccountDeletionScreen from './screens/AccountDeletionScreen';
import PasswordResetScreen from './screens/PasswordResetScreen';
import NotificationSettingsScreen from './screens/NotificationSettingsScreen';
import FontSettingsScreen from './screens/FontSettingsScreen';
import LanguageSettingsScreen from './screens/LanguageSettingsScreen';
import { t } from './i18n';

// react-native-web's Alert.alert does nothing, so on the web every login/join error and confirm vanished.
// Map it to the browser's alert/confirm: a cancel button + an action becomes OK/Cancel.
if (Platform.OS === 'web') {
  Alert.alert = (title, message, buttons = []) => {
    const text = [title, message].filter(Boolean).join('\n\n');
    const cancel = buttons.find((b) => b.style === 'cancel');
    const action = buttons.find((b) => b.style !== 'cancel');
    if (cancel && action) {
      if (window.confirm(text)) action.onPress?.();
      else cancel.onPress?.();
      return;
    }
    window.alert(text);
    action?.onPress?.();
  };
}

// Admin dashboard is a web-only tool; it is not registered in the store apps
const IS_WEB = Platform.OS === 'web';


const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets(); // keep tabs above the iPhone home indicator / Android gesture bar

  return (
    <View style={[styles.tabBarContainer, { borderTopColor: colors.border, backgroundColor: colors.body, paddingBottom: insets.bottom }]}>
      <View style={[styles.fnbList, { backgroundColor: colors.body }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          // Icon Logic
          let iconName = 'help-circle';
          if (route.name === 'Todolist') iconName = isFocused ? 'list' : 'list-outline';
          else if (route.name === 'Calendar') iconName = isFocused ? 'calendar' : 'calendar-outline';
          else if (route.name === 'MyPage') iconName = isFocused ? 'person' : 'person-outline';

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.btnFnb}
            >
              <Ionicons
                name={iconName}
                size={24}
                color={isFocused ? colors.fnbActive : colors.fnb} // design: selected tab is dark, not teal
                style={styles.fnbIcon}
              />
              <Text style={[
                styles.fnbTit,
                { color: isFocused ? colors.fnbActive : colors.fnbText, fontWeight: '500' }
              ]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Todolist" component={TodoListScreen} options={{ tabBarLabel: t('투두리스트') }} />
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ tabBarLabel: t('캘린더') }} />
      <Tab.Screen name="MyPage" component={MyPageScreen} options={{ tabBarLabel: t('마이페이지') }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  offline: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#333', paddingBottom: 6, alignItems: 'center' },
  offlineText: { color: '#fff', fontSize: 12 },
  // In the layout (not floating), so screens end above it and need no bottom padding hacks
  tabBarContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center', // Center the tab bar itself
  },
  fnbList: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 440, // Match global responsive layout
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  btnFnb: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: '100%',
  },
  fnbIcon: {
    marginBottom: 4,
  },
  fnbTit: {
    fontSize: 11,
  }
});

function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <DateProvider>
          <ThemeProvider>
            <AuthWrapper />
          </ThemeProvider>
        </DateProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const navigationRef = createNavigationContainerRef();

function AuthWrapper() {
  const { user, isLoading } = useAuth();
  const { effectiveLanguage, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const net = useNetInfo();
  const offline = net.isConnected === false || net.isInternetReachable === false;
  const ready = !isLoading && theme.font !== null;
  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);
  const pendingScreen = useRef(null); // reminder tapped before navigation was ready

  // Keep reminders current: after login and whenever the user leaves the app (to-dos/diary may have changed)
  useEffect(() => {
    if (!user?.token) return;
    syncReminders(user);
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'background') syncReminders(user);
    });
    return () => sub.remove();
  }, [user?.token]);

  // Reminder taps: 'Daily' opens today's record (no longer a tab), anything else is a tab
  const openTab = (screen) => (screen === 'Daily'
    ? navigationRef.navigate('DailyWrite')
    : navigationRef.navigate('MainTabs', { screen }));

  useEffect(() => onReminderTap((screen) => {
    if (navigationRef.isReady()) openTab(screen);
    else pendingScreen.current = screen;
  }), []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.main} />
      </View>
    );
  }

  const linking = {
    prefixes: ['https://editodo.com', 'editodo://'],
    config: {
      screens: {
        ...(IS_WEB ? { AdminLogin: 'admin', AdminDashboard: 'admin/dashboard' } : {}),
        PrivacyPolicy: 'privacy',
        Terms: 'terms',
        AccountDeletion: 'delete-account',
        DailyWrite: 'daily',
        UserModify: 'mypage/edit',
        PasswordReset: 'reset-password',
        Login: 'login',
        Join: 'join',
        MainTabs: {
          screens: {
            Todolist: 'todo',
            Calendar: 'calendar',
            MyPage: 'mypage',
          },
        },
        Step01: 'setup',
      },
    },
  };

  return (
    <NavigationContainer
      key={effectiveLanguage} // language change: remount so every screen re-reads t()
      ref={navigationRef}
      linking={linking}
      onReady={() => {
        if (pendingScreen.current && user) openTab(pendingScreen.current);
        pendingScreen.current = null;
      }}
    >
      <Stack.Navigator
        initialRouteName={user ? "MainTabs" : "Onboarding"}
        screenOptions={{
          headerShown: false,
          // flex: 1 keeps each card at screen height on web; otherwise it grows with its content and,
          // since Expo's web page doesn't scroll, long screens (privacy, terms) can't scroll at all
          cardStyle: { backgroundColor: '#fff', flex: 1 }
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ title: 'EdiTodo' }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Join" component={JoinScreen} />
        <Stack.Screen name="Step01" component={Step01Screen} />
        <Stack.Screen name="Step03" component={Step03Screen} />
        <Stack.Screen name="Step04" component={Step04Screen} />
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen name="Notice" component={NoticeScreen} />
        <Stack.Screen name="Inquiry" component={InquiryScreen} />
        {/* Admin Screens (web only) */}
        {IS_WEB && <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />}
        {IS_WEB && <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />}
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
        <Stack.Screen name="AccountDeletion" component={AccountDeletionScreen} />
        <Stack.Screen name="DailyWrite" component={DailyWriteScreen} />
        <Stack.Screen name="UserModify" component={UserModifyScreen} />
        <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
        <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
        <Stack.Screen name="FontSettings" component={FontSettingsScreen} />
        <Stack.Screen name="LanguageSettings" component={LanguageSettingsScreen} />
      </Stack.Navigator>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      {offline && (
        <View style={[styles.offline, { paddingTop: insets.top + 6 }]} pointerEvents="none" accessibilityLiveRegion="polite">
          <Text style={styles.offlineText}>{t('인터넷에 연결되어 있지 않아요. 저장되지 않을 수 있어요.')}</Text>
        </View>
      )}
    </NavigationContainer>
  );
}

export default wrapApp(App);
