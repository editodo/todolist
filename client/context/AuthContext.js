
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
                const parsedUser = JSON.parse(savedUser);

                // Check Expiration
                if (parsedUser.expires_at) {
                    const expiryDate = new Date(parsedUser.expires_at);
                    if (new Date() > expiryDate) {
                        parsedUser.isExpired = true; // Mark as expired
                    }
                }

                setUser(parsedUser);
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

    const convertAccount = async (conversionData) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/convert`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...conversionData, user_id: user.id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Conversion failed');
            }

            // Update local user state to REGULAR
            const updatedUser = {
                ...user,
                ...conversionData,
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
            const response = await fetch(`${API_URL}/api/auth/user/${user.id}`, {
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

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            startGuestMode,
            convertAccount,
            updateProfile,
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
