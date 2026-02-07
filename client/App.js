import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
import DailyScreen from './screens/DailyScreen';
import MyPageScreen from './screens/MyPageScreen';
import Step01Screen from './screens/Step01Screen';
import Step02Screen from './screens/Step02Screen';
import Step03Screen from './screens/Step03Screen';
import Step04Screen from './screens/Step04Screen';
import NoticeScreen from './screens/NoticeScreen';
import InquiryScreen from './screens/InquiryScreen';
import AdminLoginScreen from './screens/AdminLoginScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';


const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <View style={[styles.tabBarContainer, { borderTopColor: colors.border, backgroundColor: colors.body }]}>
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
          else if (route.name === 'Daily') iconName = isFocused ? 'book' : 'book-outline';
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
                color={isFocused ? colors.main : '#CCCCCC'}
                style={styles.fnbIcon}
              />
              <Text style={[
                styles.fnbTit,
                { color: isFocused ? colors.main : '#CCCCCC', fontWeight: isFocused ? '700' : '500' }
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
const Drawer = createDrawerNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Todolist" component={TodoListScreen} options={{ tabBarLabel: '투두리스트' }} />
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ tabBarLabel: '캘린더' }} />
      <Tab.Screen name="Daily" component={DailyScreen} options={{ tabBarLabel: '하루일기' }} />
      <Tab.Screen name="MyPage" component={MyPageScreen} options={{ tabBarLabel: '마이페이지' }} />
    </Tab.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: '#fff', width: 280 },
        drawerActiveTintColor: colors.main,
      }}
    >
      <Drawer.Screen
        name="Home"
        component={MainTabNavigator}
        options={{
          drawerLabel: '홈',
          drawerIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />
        }}
      />
      {/* Daily is now inside MainTabNavigator */}
      {/* Add more items here like Settings, Theme, etc. */}
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
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

export default function App() {
  return (
    <AuthProvider>
      <DateProvider>
        <ThemeProvider>
          <AuthWrapper />
        </ThemeProvider>
      </DateProvider>
    </AuthProvider>
  );
}

function AuthWrapper() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading Editodo...</Text>
      </View>
    );
  }

  const linking = {
    prefixes: ['https://editodo.com', 'editodo://'],
    config: {
      screens: {
        AdminLogin: 'admin',
        AdminDashboard: 'admin/dashboard',
        PrivacyPolicy: 'privacy',
        Login: 'login',
        Join: 'join',
        MainTabs: {
          screens: {
            Todolist: 'todo',
            Calendar: 'calendar',
            Daily: 'daily',
            MyPage: 'mypage',
          }
        }
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName={user ? "MainTabs" : "Onboarding"}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#fff' }
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Join" component={JoinScreen} />
        <Stack.Screen name="Step01" component={Step01Screen} />
        <Stack.Screen name="Step02" component={Step02Screen} />
        <Stack.Screen name="Step03" component={Step03Screen} />
        <Stack.Screen name="Step04" component={Step04Screen} />
        <Stack.Screen name="MainTabs" component={DrawerNavigator} />
        <Stack.Screen name="Notice" component={NoticeScreen} />
        <Stack.Screen name="Inquiry" component={InquiryScreen} />
        {/* Admin Screens */}
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
