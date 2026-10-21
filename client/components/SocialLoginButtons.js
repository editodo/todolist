import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Alert, ActivityIndicator } from 'react-native';
import { Text } from './AppText';
import * as AppleAuthentication from 'expo-apple-authentication';
import Constants from 'expo-constants';
import { useAuth } from '../context/AuthContext';
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from '../config';
import { colors } from '../theme';
import { t } from '../i18n';
import KakaoButton from './KakaoButton';
import SocialRound from './SocialRound';
import { kakaoEnabled } from '../kakaoAuth';

// Kakao: everywhere once KAKAO_REST_API_KEY is set. Apple: iOS only (App Store rule 4.8 requires it next to Google there). Google: Android + iOS once client IDs are set.
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
        else Alert.alert(t('로그인 실패'), result.error);
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
            if (e.code !== 'ERR_REQUEST_CANCELED') Alert.alert(t('로그인 실패'), t('Apple 로그인을 완료하지 못했습니다.'));
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
            if (!cancelled) Alert.alert(t('로그인 실패'), t('Google 로그인을 완료하지 못했습니다.'));
        } finally {
            setBusy(false);
        }
    };

    if (!appleAvailable && !googleEnabled && !kakaoEnabled) return null;

    return (
        <View style={styles.wrap}>
            <View style={styles.dividerRow}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>{t('SNS로 시작하기')}</Text>
                <View style={styles.line} />
            </View>
            <View style={styles.row}>
                {kakaoEnabled && <KakaoButton finish={finish} />}
                {googleEnabled && <SocialRound provider="google" label={t('Google로 계속하기')} onPress={handleGoogle} disabled={busy} />}
                {appleAvailable && <SocialRound provider="apple" label={t('Apple로 계속하기')} onPress={handleApple} disabled={busy} />}
            </View>
            {busy && <ActivityIndicator color={colors.main} style={{ marginTop: 12 }} />}
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { marginTop: 16 },
    dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    line: { flex: 1, height: 1, backgroundColor: '#eee' },
    dividerText: { marginHorizontal: 10, fontSize: 12, color: colors.subText },
    row: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
});
