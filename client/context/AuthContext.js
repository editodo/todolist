
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { id, username, user_type, ... }
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const savedUser = await AsyncStorage.getItem('user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            } else {
                // If no user, we'll wait for the guest trigger in Onboarding
                // or we could auto-generate one here.
                // User said: "Returning guest skips onboarding", so we MUST check guestId.
            }
        } catch (e) {
            console.error('Failed to load user', e);
        } finally {
            setLoading(false);
        }
    };

    const login = async (userData) => {
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem('user');
    };

    const startGuestMode = async () => {
        try {
            const response = await fetch(`${API_URL}/api/auth/guest-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Guest login failed');

            const data = await response.json();
            await login(data.user);
            return { success: true, isNew: data.isNew };
        } catch (e) {
            console.error(e);
            return { success: false };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            startGuestMode,
            isLoggedIn: !!user,
            isLoading: loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
