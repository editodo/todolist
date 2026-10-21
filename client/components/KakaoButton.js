import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './AppText';
import { kakaoAuthorize } from '../kakaoAuth';
import { t } from '../i18n';

// Kakao's login button guideline: #FEE500, black speech-bubble symbol, 85% black label.
// finish(provider, payload) is the shared SocialLoginButtons sign-in step.
export default function KakaoButton({ finish }) {
    const [busy, setBusy] = useState(false);
    const handle = async () => {
        if (busy) return;
        setBusy(true);
        try {
            const payload = await kakaoAuthorize();
            if (payload) await finish('kakao', payload);
        } catch (e) {
            Alert.alert(t('로그인 실패'), t('카카오 로그인을 완료하지 못했습니다.'));
        } finally {
            setBusy(false);
        }
    };
    return (
        <TouchableOpacity style={styles.btn} onPress={handle} activeOpacity={0.85} accessibilityRole="button" accessibilityState={{ busy }}>
            <Ionicons name="chatbubble" size={18} color="#000" />
            <Text style={styles.text}>{t('카카오로 계속하기')}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btn: {
        height: 48, borderRadius: 6, backgroundColor: '#FEE500', marginBottom: 10,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    },
    text: { fontSize: 15, fontWeight: '600', color: 'rgba(0,0,0,0.85)' },
});
