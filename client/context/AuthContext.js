
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { API_URL, apiFetch, setAuthToken } from '../config';
import { cancelAll as cancelReminders } from '../notifications';
import { refreshWidget } from '../widget/refresh';
import { t } from '../i18n';

const AuthContext = createContext();

// The saved user carries the login token: keep it in Keychain/Keystore on phones. SecureStore has no web support.
const storage = Platform.OS === 'web'
    ? { get: (k) => AsyncStorage.getItem(k), set: (k, v) => AsyncStorage.setItem(k, v), remove: (k) => AsyncStorage.removeItem(k) }
    : { get: (k) => SecureStore.getItemAsync(k), set: (k, v) => SecureStore.setItemAsync(k, v), remove: (k) => SecureStore.deleteItemAsync(k) };

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { id, username, user_type, ... }
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            if (Platform.OS !== 'web') await AsyncStorage.removeItem('user'); // drop pre-SecureStore session copy
            const savedUser = await storage.get('user');
            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);

                // Sessions saved before the server required tokens can't call the API; ask for a fresh login
                if (!parsedUser.token) {
                    await storage.remove('user');
                    return;
                }
                setAuthToken(parsedUser.token);

                // Check Expiration
                if (parsedUser.expires_at) {
                    const expiryDate = new Date(parsedUser.expires_at);
                    if (new Date() > expiryDate) {
                        parsedUser.isExpired = true; // Mark as expired
                    }
                }

                setUser(parsedUser);
                refreshSession(parsedUser); // not awaited: the app opens right away, even offline
            }
        } catch (e) {
            console.error('Failed to load user', e);
        } finally {
            setLoading(false);
        }
    };

    // 로그인 유지: every app start trades the saved token for a fresh 90-day one and the latest profile,
    // so people who keep using the app are never logged out. Only a rejected token (expired, account deleted) logs out.
    const refreshSession = async (savedUser) => {
        try {
            const response = await apiFetch(`${API_URL}/api/auth/refresh`, { method: 'POST' });
            if (response.status === 401) return logout();
            if (!response.ok) return;
            const data = await response.json();
            const fresh = { ...savedUser, ...data.user, token: data.token };
            fresh.isExpired = Boolean(fresh.expires_at && new Date() > new Date(fresh.expires_at));
            await login(fresh);
        } catch (e) {
            // offline: keep the saved session
        }
    };

    // Apple/Google sign-in. A logged-in guest's token rides along so the server can keep their data.
    const socialLogin = async (provider, payload) => {
        try {
            const response = await apiFetch(`${API_URL}/api/auth/social/${provider}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.error || t('로그인에 실패했습니다.'));
            await login({ ...data.user, token: data.token });
            return { success: true, isNew: data.isNew };
        } catch (e) {
            return { success: false, error: e.message };
        }
    };

    // userData must carry the server-issued token ({ ...data.user, token: data.token })
    const login = async (userData) => {
        setAuthToken(userData.token);
        setUser(userData);
        await storage.set('user', JSON.stringify(userData));
        refreshWidget();
    };

    const logout = async () => {
        await cancelReminders();
        setAuthToken(null);
        setUser(null);
        await storage.remove('user');
        refreshWidget();
    };

    const startGuestMode = async () => {
        try {
            const response = await apiFetch(`${API_URL}/api/auth/guest-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Guest login failed');

            const data = await response.json();
            await login({ ...data.user, token: data.token });
            return { success: true, isNew: data.isNew };
        } catch (e) {
            console.error(e);
            return { success: false };
        }
    };

    const convertAccount = async (conversionData) => {
        try {
            const response = await apiFetch(`${API_URL}/api/auth/convert`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(conversionData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Conversion failed');
            }

            // Update local user state to REGULAR
            const updatedUser = {
                ...user,
                username: conversionData.username,
                email: conversionData.email,
                nickname: conversionData.nickname || user.nickname,
                user_type: 'REGULAR',
                expires_at: null,
                isExpired: false
            };
            await login(updatedUser);
            return { success: true };
        } catch (e) {
            console.error(e);
            return { success: false, error: e.message };
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await apiFetch(`${API_URL}/api/auth/user/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) throw new Error('Profile update failed');

            const updatedUser = { ...user, ...profileData };
            await login(updatedUser);
            return { success: true };
        } catch (e) {
            return { success: false, error: e.message };
        }
    };

    // Permanently deletes the account and all its todos, diaries and settings on the server
    const deleteAccount = async () => {
        try {
            const response = await apiFetch(`${API_URL}/api/auth/me`, { method: 'DELETE' });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || t('회원 탈퇴에 실패했습니다.'));
            }
            await logout();
            return { success: true };
        } catch (e) {
            return { success: false, error: e.message };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            startGuestMode,
            convertAccount,
            updateProfile,
            deleteAccount,
            socialLogin,
            isLoggedIn: !!user,
            isGuest: user?.user_type === 'GUEST',
            isExpired: user?.isExpired,
            isLoading: loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
