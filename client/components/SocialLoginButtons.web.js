import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from './AppText';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { GOOGLE_WEB_CLIENT_ID, APPLE_SERVICES_ID } from '../config';
import { colors } from '../theme';
import { t } from '../i18n';

// Web version of the Apple/Google buttons (the native one uses the phone SDKs). Each provider's official
// script is loaded only when its ID is configured; the server verifies the resulting ID token either way.
const loadScript = (src) => new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) return existing.dataset.loaded ? resolve() : existing.addEventListener('load', resolve);
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => { s.dataset.loaded = '1'; resolve(); };
    s.onerror = reject;
    document.head.appendChild(s);
});

export default function SocialLoginButtons({ onDone }) {
    const { socialLogin } = useAuth();
    const googleBox = useRef(null);
    const [appleReady, setAppleReady] = useState(false);
    const onDoneRef = useRef(onDone);
    onDoneRef.current = onDone;

    const finish = async (provider, payload) => {
        const result = await socialLogin(provider, payload);
        if (result.success) onDoneRef.current?.({ isNew: result.isNew });
        else Alert.alert(t('로그인 실패'), result.error);
    };

    useEffect(() => {
        if (!GOOGLE_WEB_CLIENT_ID) return;
        loadScript('https://accounts.google.com/gsi/client').then(() => {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_WEB_CLIENT_ID,
                callback: (resp) => finish('google', { idToken: resp.credential }),
            });
            if (googleBox.current) {
                window.google.accounts.id.renderButton(googleBox.current, {
                    theme: 'outline', size: 'large', text: 'continue_with', locale: 'ko', width: 320,
                });
            }
        }).catch(() => {});
    }, []);

    useEffect(() => {
        if (!APPLE_SERVICES_ID) return;
        loadScript('https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/ko_KR/appleid.auth.js').then(() => {
            window.AppleID.auth.init({
                clientId: APPLE_SERVICES_ID,
                scope: 'name email',
                redirectURI: `${window.location.origin}/login`,
                usePopup: true,
            });
            setAppleReady(true);
        }).catch(() => {});
    }, []);

    const handleApple = async () => {
        try {
            const data = await window.AppleID.auth.signIn();
            const name = data.user?.name; // Apple sends the name only on the very first sign-in
            await finish('apple', {
                identityToken: data.authorization.id_token,
                authorizationCode: data.authorization.code,
                fullName: name ? { givenName: name.firstName, familyName: name.lastName } : null,
            });
        } catch (e) {
            if (e?.error !== 'popup_closed_by_user' && e?.error !== 'user_cancelled_authorize') {
                Alert.alert(t('로그인 실패'), t('Apple 로그인을 완료하지 못했습니다.'));
            }
        }
    };

    if (!GOOGLE_WEB_CLIENT_ID && !APPLE_SERVICES_ID) return null;

    return (
        <View style={styles.wrap}>
            <View style={styles.dividerRow}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>{t('또는')}</Text>
                <View style={styles.line} />
            </View>
            {APPLE_SERVICES_ID ? (
                <TouchableOpacity style={styles.appleBtn} onPress={appleReady ? handleApple : undefined} accessibilityRole="button" activeOpacity={0.85}>
                    <Ionicons name="logo-apple" size={18} color="#fff" />
                    <Text style={styles.appleText}>{t('Apple로 계속하기')}</Text>
                </TouchableOpacity>
            ) : null}
            {GOOGLE_WEB_CLIENT_ID ? <View ref={googleBox} style={styles.googleBox} /> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { marginTop: 16 },
    dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    line: { flex: 1, height: 1, backgroundColor: '#eee' },
    dividerText: { marginHorizontal: 10, fontSize: 12, color: colors.subText },
    appleBtn: {
        height: 44, borderRadius: 5, backgroundColor: '#000', marginBottom: 10,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    },
    appleText: { color: '#fff', fontSize: 15, fontWeight: '600' },
    googleBox: { alignItems: 'center', minHeight: 44 },
});
