import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import Constants from 'expo-constants';
import { useAuth } from '../context/AuthContext';
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from '../config';
import { colors } from '../theme';

// Apple: iOS only (App Store rule 4.8 requires it next to Google there). Google: Android + iOS once client IDs are set.
// Web keeps ID/password login. onDone({ isNew }) runs after the server accepted the sign-in.
// Expo Go has no Google Sign-In native module, so the library is only loaded where it can run (dev/store builds)
const isExpoGo = Constants.executionEnvironment === 'storeClient';
const googleEnabled = !isExpoGo && Platform.OS !== 'web' && Boolean(GOOGLE_WEB_CLIENT_ID) && (Platform.OS !== 'ios' || Boolean(GOOGLE_IOS_CLIENT_ID));
const Google = googleEnabled ? require('@react-native-google-signin/google-signin') : null;
if (googleEnabled) {
    Google.GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID, iosClientId: GOOGLE_IOS_CLIENT_ID || undefined });
}

export default function SocialLoginButtons({ onDone }) {
    const { socialLogin } = useAuth();
    const [appleAvailable, setAppleAvailable] = useState(false);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (Platform.OS === 'ios') AppleAuthentication.isAvailableAsync().then(setAppleAvailable).catch(() => {});
    }, []);

    const finish = async (provider, payload) => {
        const result = await socialLogin(provider, payload);
        if (result.success) onDone?.({ isNew: result.isNew });
        else Alert.alert('로그인 실패', result.error);
    };

    const handleApple = async () => {
        setBusy(true);
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });
            await finish('apple', {
                identityToken: credential.identityToken,
                authorizationCode: credential.authorizationCode,
                fullName: credential.fullName, // Apple sends the name only on the very first sign-in
            });
        } catch (e) {
            if (e.code !== 'ERR_REQUEST_CANCELED') Alert.alert('로그인 실패', 'Apple 로그인을 완료하지 못했습니다.');
        } finally {
            setBusy(false);
        }
    };

    const handleGoogle = async () => {
        setBusy(true);
        try {
            await Google.GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const response = await Google.GoogleSignin.signIn();
            if (Google.isSuccessResponse(response)) await finish('google', { idToken: response.data.idToken });
        } catch (e) {
            const cancelled = Google.isErrorWithCode(e) && [Google.statusCodes.SIGN_IN_CANCELLED, Google.statusCodes.IN_PROGRESS].includes(e.code);
            if (!cancelled) Alert.alert('로그인 실패', 'Google 로그인을 완료하지 못했습니다.');
        } finally {
            setBusy(false);
        }
    };

    if (!appleAvailable && !googleEnabled) return null;

    return (
        <View style={styles.wrap}>
            <View style={styles.dividerRow}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>또는</Text>
                <View style={styles.line} />
            </View>
            {busy && <ActivityIndicator color={colors.main} style={{ marginBottom: 10 }} />}
            {appleAvailable && (
                <AppleAuthentication.AppleAuthenticationButton
                    buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
                    buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                    cornerRadius={5}
                    style={styles.appleBtn}
                    onPress={busy ? () => {} : handleApple}
                />
            )}
            {googleEnabled && (
                <TouchableOpacity style={styles.googleBtn} onPress={busy ? undefined : handleGoogle} activeOpacity={0.8} accessibilityRole="button">
                    <Ionicons name="logo-google" size={18} color="#4285F4" />
                    <Text style={styles.googleText}>Google로 계속하기</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { marginTop: 16 },
    dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    line: { flex: 1, height: 1, backgroundColor: '#eee' },
    dividerText: { marginHorizontal: 10, fontSize: 12, color: colors.subText },
    appleBtn: { width: '100%', height: 48, marginBottom: 10 },
    googleBtn: {
        height: 48, borderRadius: 5, borderWidth: 1, borderColor: '#dadce0', backgroundColor: '#fff',
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    },
    googleText: { fontSize: 15, fontWeight: '600', color: '#3c4043' },
});
