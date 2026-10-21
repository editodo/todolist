import React, { useState } from 'react';
import { Alert } from 'react-native';
import SocialRound from './SocialRound';
import { kakaoAuthorize } from '../kakaoAuth';
import { t } from '../i18n';

// finish(provider, payload) is the shared SocialLoginButtons sign-in step.
export default function KakaoButton({ finish, size }) {
    const [busy, setBusy] = useState(false);
    const handle = async () => {
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
    return <SocialRound provider="kakao" label={t('카카오로 계속하기')} onPress={handle} disabled={busy} size={size} />;
}
